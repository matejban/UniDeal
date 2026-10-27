-- Inicijalna shema (#2) i RLS pravila (#3): partneri, ponude, kuponi, recenzije, favoriti, pretplate i obavijesti.
-- Tablice profiles i allowed_student_domains nastale su u ranijim migracijama.

-- ---------------------------------------------------------------------------
-- Tablice
-- ---------------------------------------------------------------------------

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  created_at timestamptz not null default now()
);

create table public.partners (
  id uuid primary key default gen_random_uuid(),
  -- Prazno samo za demonstracijske partnere iz seed.sql koji nemaju korisnički račun.
  owner_id uuid unique references public.profiles (id) on delete cascade,
  name text not null,
  -- Kontrolnu znamenku OIB-a provjerava aplikacija (F-006).
  oib text not null unique check (oib ~ '^[0-9]{11}$'),
  category_id uuid not null references public.categories (id),
  address text not null,
  city text not null,
  lat double precision,
  lng double precision,
  phone text not null,
  hours text,
  description text,
  logo_url text,
  approval_status text not null default 'na_cekanju' check (approval_status in ('na_cekanju', 'odobren', 'odbijen')),
  created_at timestamptz not null default now()
);

-- Jedna pretplata po partneru; piše je samo Stripe webhook sa secret ključem (#34).
create table public.subscriptions (
  partner_id uuid primary key references public.partners (id) on delete cascade,
  plan text not null check (plan in ('mjesecna', 'godisnja')),
  status text not null check (status in ('aktivna', 'istekla', 'otkazana')),
  valid_until timestamptz not null,
  stripe_customer_id text,
  stripe_subscription_id text unique,
  updated_at timestamptz not null default now()
);

create table public.subscription_prices (
  plan text primary key check (plan in ('mjesecna', 'godisnja')),
  amount_eur numeric(8, 2) not null check (amount_eur > 0),
  stripe_price_id text
);

create table public.offers (
  id uuid primary key default gen_random_uuid(),
  partner_id uuid not null references public.partners (id) on delete cascade,
  category_id uuid not null references public.categories (id),
  title text not null,
  description text not null,
  discount_type text not null check (discount_type in ('postotak', 'iznos')),
  discount_value numeric(8, 2) not null check (discount_value > 0 and (discount_type <> 'postotak' or discount_value <= 100)),
  valid_until date not null,
  conditions text,
  photo_url text,
  status text not null default 'nacrt' check (status in ('nacrt', 'aktivna', 'istekla')),
  usage_limit text not null default 'neograniceno' check (usage_limit in ('jednom_po_studentu', 'neograniceno')),
  created_at timestamptz not null default now()
);

create table public.coupons (
  id uuid primary key default gen_random_uuid(),
  offer_id uuid not null references public.offers (id) on delete cascade,
  student_id uuid not null references public.profiles (id) on delete cascade,
  code text not null unique,
  status text not null default 'izdan' check (status in ('izdan', 'iskoristen', 'istekao')),
  issued_at timestamptz not null default now(),
  redeemed_at timestamptz,
  check ((status = 'iskoristen') = (redeemed_at is not null))
);

-- partner_id je preslika iz kupona, da se prosječna ocjena partnera računa bez pristupa kuponima.
create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  coupon_id uuid not null unique references public.coupons (id) on delete cascade,
  student_id uuid not null references public.profiles (id) on delete cascade,
  partner_id uuid not null references public.partners (id) on delete cascade,
  rating smallint not null check (rating between 1 and 5),
  comment text,
  is_removed boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.favorites (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles (id) on delete cascade,
  offer_id uuid references public.offers (id) on delete cascade,
  partner_id uuid references public.partners (id) on delete cascade,
  created_at timestamptz not null default now(),
  check (num_nonnulls(offer_id, partner_id) = 1),
  unique (student_id, offer_id),
  unique (student_id, partner_id)
);

create table public.notification_subscriptions (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles (id) on delete cascade,
  category_id uuid references public.categories (id) on delete cascade,
  partner_id uuid references public.partners (id) on delete cascade,
  created_at timestamptz not null default now(),
  check (num_nonnulls(category_id, partner_id) = 1),
  unique (student_id, category_id),
  unique (student_id, partner_id)
);

create table public.offer_views (
  id bigint generated always as identity primary key,
  offer_id uuid not null references public.offers (id) on delete cascade,
  viewed_at timestamptz not null default now()
);

create index on public.partners (category_id);
create index on public.offers (partner_id);
create index on public.offers (category_id);
create index on public.coupons (offer_id);
create index on public.coupons (student_id);
create index on public.reviews (student_id);
create index on public.reviews (partner_id);
create index on public.favorites (offer_id);
create index on public.favorites (partner_id);
create index on public.notification_subscriptions (category_id);
create index on public.notification_subscriptions (partner_id);
create index on public.offer_views (offer_id);

insert into public.categories (name) values ('Hrana'), ('Zdravlje i sport'), ('Obrazovanje'), ('Zabava');

-- ---------------------------------------------------------------------------
-- Pomoćne funkcije za RLS pravila
-- Shema private nije izložena kroz API, pa se funkcije ne mogu pozvati izravno.
-- Security definer jer provjeravaju tablice koje pozivatelj ne smije čitati.
-- ---------------------------------------------------------------------------

create schema private;
grant usage on schema private to anon, authenticated;

-- Partner je javan kad ga je administrator odobrio, ima aktivnu pretplatu
-- i račun vlasnika nije deaktiviran (F-005, F-007).
create function private.partner_is_public(pid uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.partners p
    left join public.profiles o on o.id = p.owner_id
    join public.subscriptions s on s.partner_id = p.id
    where p.id = pid
      and p.approval_status = 'odobren'
      and coalesce(o.is_active, true)
      and s.status = 'aktivna'
      and s.valid_until > now()
  );
$$;

create function private.owns_partner(pid uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (select 1 from public.partners where id = pid and owner_id = (select auth.uid()));
$$;

create function private.owns_offer(oid uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.offers o join public.partners p on p.id = o.partner_id
    where o.id = oid and p.owner_id = (select auth.uid())
  );
$$;

-- Kupone smije generirati samo potvrđeni student s aktivnim računom (F-004).
create function private.is_verified_student()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles
    where id = (select auth.uid()) and role = 'student' and student_status = 'potvrden' and is_active
  );
$$;

-- Recenzija samo za vlastiti iskorišteni kupon, i to za partnera čija je ponuda (F-023).
create function private.can_review(cid uuid, pid uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.coupons c join public.offers o on o.id = c.offer_id
    where c.id = cid and c.student_id = (select auth.uid()) and c.status = 'iskoristen' and o.partner_id = pid
  );
$$;

revoke execute on all functions in schema private from public;
grant execute on all functions in schema private to anon, authenticated;

-- ---------------------------------------------------------------------------
-- RLS pravila (NF-03). Tablica bez pravila za neku radnju tu radnju odbija.
-- ---------------------------------------------------------------------------

alter table public.categories enable row level security;
alter table public.partners enable row level security;
alter table public.subscriptions enable row level security;
alter table public.subscription_prices enable row level security;
alter table public.offers enable row level security;
alter table public.coupons enable row level security;
alter table public.reviews enable row level security;
alter table public.favorites enable row level security;
alter table public.notification_subscriptions enable row level security;
alter table public.offer_views enable row level security;

-- Kategorije: svi čitaju, administrator uređuje (F-027).
create policy "Svi čitaju kategorije" on public.categories
  for select to anon, authenticated using (true);
create policy "Administrator dodaje kategorije" on public.categories
  for insert to authenticated with check ((select public.is_admin()));
create policy "Administrator mijenja kategorije" on public.categories
  for update to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "Administrator briše kategorije" on public.categories
  for delete to authenticated using ((select public.is_admin()));

-- Partneri: javni su samo odobreni s aktivnom pretplatom; vlasnik i administrator vide i ostale.
create policy "Svi čitaju javne partnere" on public.partners
  for select to anon using (private.partner_is_public(id));
create policy "Prijavljeni čitaju javne i svoje partnere" on public.partners
  for select to authenticated
  using (private.partner_is_public(id) or owner_id = (select auth.uid()) or (select public.is_admin()));
create policy "Partner stvara svoj profil na čekanju" on public.partners
  for insert to authenticated
  with check (
    owner_id = (select auth.uid())
    and approval_status = 'na_cekanju'
    and exists (select 1 from public.profiles where id = (select auth.uid()) and role = 'partner')
  );
create policy "Partner mijenja svoj profil" on public.partners
  for update to authenticated
  using (owner_id = (select auth.uid())) with check (owner_id = (select auth.uid()));
create policy "Administrator briše partnere" on public.partners
  for delete to authenticated using ((select public.is_admin()));
-- Partner ne smije sam promijeniti vlasnika ni status odobrenja; odobrenje ide funkcijom (#37).
revoke update on public.partners from anon, authenticated;
grant update (name, oib, category_id, address, city, lat, lng, phone, hours, description, logo_url)
  on public.partners to authenticated;

-- Pretplate: vlasnik i administrator čitaju; piše samo poslužitelj secret ključem (#34).
create policy "Partner i administrator čitaju pretplatu" on public.subscriptions
  for select to authenticated
  using (private.owns_partner(partner_id) or (select public.is_admin()));

-- Cijene pretplate: svi čitaju, administrator određuje (#41).
create policy "Svi čitaju cijene pretplate" on public.subscription_prices
  for select to anon, authenticated using (true);
create policy "Administrator dodaje cijene pretplate" on public.subscription_prices
  for insert to authenticated with check ((select public.is_admin()));
create policy "Administrator mijenja cijene pretplate" on public.subscription_prices
  for update to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));

-- Ponude: javne su aktivne i neistekle ponude javnih partnera (F-007, F-012);
-- partner upravlja svojima (F-011), administrator uklanja neprimjerene (#40).
create policy "Svi čitaju javne ponude" on public.offers
  for select to anon
  using (status = 'aktivna' and valid_until >= current_date and private.partner_is_public(partner_id));
create policy "Prijavljeni čitaju javne i svoje ponude" on public.offers
  for select to authenticated
  using (
    (status = 'aktivna' and valid_until >= current_date and private.partner_is_public(partner_id))
    or private.owns_partner(partner_id)
    or (select public.is_admin())
  );
create policy "Partner dodaje svoje ponude" on public.offers
  for insert to authenticated with check (private.owns_partner(partner_id));
create policy "Partner mijenja svoje ponude" on public.offers
  for update to authenticated
  using (private.owns_partner(partner_id) or (select public.is_admin()))
  with check (private.owns_partner(partner_id) or (select public.is_admin()));
create policy "Partner i administrator brišu ponude" on public.offers
  for delete to authenticated using (private.owns_partner(partner_id) or (select public.is_admin()));

-- Kuponi: student vidi svoje, partner kupone svojih ponuda (F-014, F-022).
create policy "Student, partner i administrator čitaju kupone" on public.coupons
  for select to authenticated
  using (student_id = (select auth.uid()) or private.owns_offer(offer_id) or (select public.is_admin()));
-- Ponuda mora biti vidljiva studentu, a to su samo javne, aktivne i neistekle ponude (F-020).
-- Ograničenje „jednom po studentu” (F-021) provjerava aplikacija (#29).
create policy "Potvrđeni student generira kupon" on public.coupons
  for insert to authenticated
  with check (
    student_id = (select auth.uid())
    and status = 'izdan'
    and private.is_verified_student()
    and exists (select 1 from public.offers where id = offer_id)
  );
create policy "Partner potvrđuje kupone svojih ponuda" on public.coupons
  for update to authenticated
  using (private.owns_offer(offer_id)) with check (private.owns_offer(offer_id) and status = 'iskoristen');
revoke update on public.coupons from anon, authenticated;
grant update (status, redeemed_at) on public.coupons to authenticated;

-- Recenzije: svi čitaju neuklonjene, student piše za iskorišteni kupon (F-023), administrator uklanja (#40).
create policy "Svi čitaju recenzije" on public.reviews
  for select to anon using (not is_removed);
create policy "Prijavljeni čitaju recenzije" on public.reviews
  for select to authenticated
  using (not is_removed or student_id = (select auth.uid()) or (select public.is_admin()));
create policy "Student recenzira iskorišteni kupon" on public.reviews
  for insert to authenticated
  with check (student_id = (select auth.uid()) and not is_removed and private.can_review(coupon_id, partner_id));
create policy "Administrator uklanja recenzije" on public.reviews
  for update to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));

-- Favoriti i pretplate na obavijesti: svatko upravlja samo svojima (F-019, F-024).
create policy "Korisnik čita svoje favorite" on public.favorites
  for select to authenticated using (student_id = (select auth.uid()));
create policy "Korisnik dodaje svoje favorite" on public.favorites
  for insert to authenticated with check (student_id = (select auth.uid()));
create policy "Korisnik briše svoje favorite" on public.favorites
  for delete to authenticated using (student_id = (select auth.uid()));

create policy "Korisnik čita svoje pretplate na obavijesti" on public.notification_subscriptions
  for select to authenticated using (student_id = (select auth.uid()));
create policy "Korisnik dodaje svoje pretplate na obavijesti" on public.notification_subscriptions
  for insert to authenticated with check (student_id = (select auth.uid()));
create policy "Korisnik briše svoje pretplate na obavijesti" on public.notification_subscriptions
  for delete to authenticated using (student_id = (select auth.uid()));

-- Pregledi ponuda: bilježi ih svatko tko ponudu vidi, čitaju vlasnik i administrator (F-015).
create policy "Svi bilježe pregled vidljive ponude" on public.offer_views
  for insert to anon, authenticated
  with check (exists (select 1 from public.offers where id = offer_id));
create policy "Partner i administrator čitaju preglede" on public.offer_views
  for select to authenticated using (private.owns_offer(offer_id) or (select public.is_admin()));

-- ---------------------------------------------------------------------------
-- Javni popisi: što vidi posjetitelj, neovisno o tome tko je prijavljen (pretraga, karta, javni profil).
-- security_invoker: pogled poštuje RLS pozivatelja.
-- ---------------------------------------------------------------------------

create view public.public_partners with (security_invoker = true) as
  select * from public.partners where private.partner_is_public(id);

create view public.public_offers with (security_invoker = true) as
  select * from public.offers
  where status = 'aktivna' and valid_until >= current_date and private.partner_is_public(partner_id);
