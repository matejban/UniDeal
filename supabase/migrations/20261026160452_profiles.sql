-- Profil prijavljenog korisnika: uloga i status studenta (F-002, F-003).
-- Uloga se određuje načinom prijave: Microsoft → student, Google ili e-mail → partner.
-- Administrator se dodjeljuje ručno: update public.profiles set role = 'admin' where id = '…';

-- Naziv visokog učilišta za studentsku adresu ili null ako domena nije na popisu (AS-01).
-- Prihvaća domenu s popisa i njezine poddomene (npr. student.fer.hr), ali ne i sličnu (npr. evilfer.hr).
create function public.student_institution(email text)
returns text
language sql
stable
security definer
set search_path = ''
as $$
  select d.institution
  from public.allowed_student_domains d
  where lower(split_part(email, '@', 2)) = d.domain
     or lower(split_part(email, '@', 2)) like '%.' || d.domain
  order by length(d.domain) desc
  limit 1;
$$;

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  role text not null check (role in ('student', 'partner', 'admin')),
  student_status text check (student_status in ('potvrden', 'nepotvrden')),
  institution text,
  full_name text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Korisnik čita samo svoj profil. Ulogu i status ne može mijenjati sam (nema pravila za insert i update).
create policy "Korisnik čita svoj profil"
  on public.profiles for select
  to authenticated
  using (id = (select auth.uid()));

-- Novi korisnik u Supabase Authu odmah dobiva profil prema načinu prijave.
create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  is_student boolean := new.raw_app_meta_data ->> 'provider' = 'azure';
  inst text := public.student_institution(new.email);
begin
  insert into public.profiles (id, role, student_status, institution, full_name)
  values (
    new.id,
    case when is_student then 'student' else 'partner' end,
    case when is_student then (case when inst is null then 'nepotvrden' else 'potvrden' end) end,
    case when is_student then inst end,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Profili za korisnike koji su se prijavili prije ove migracije.
insert into public.profiles (id, role, student_status, institution, full_name)
select
  u.id,
  case when u.raw_app_meta_data ->> 'provider' = 'azure' then 'student' else 'partner' end,
  case when u.raw_app_meta_data ->> 'provider' = 'azure'
       then (case when public.student_institution(u.email) is null then 'nepotvrden' else 'potvrden' end) end,
  case when u.raw_app_meta_data ->> 'provider' = 'azure' then public.student_institution(u.email) end,
  coalesce(u.raw_user_meta_data ->> 'full_name', u.raw_user_meta_data ->> 'name')
from auth.users u
on conflict (id) do nothing;
