-- Test RLS pravila (#3, NF-03): za svaku ulogu pokušava dopuštene i nedopuštene radnje.
-- Pokreće se nad bazom s podacima iz seed.sql (psql ili SQL Editor). Sve se poništava na kraju (rollback).
-- Ako neki test padne, skripta završava greškom s nazivima palih testova.

begin;

create temp table rezultati (test text, ok boolean) on commit drop;
grant insert on rezultati to anon, authenticated;

-- Probni korisnici; okidač handle_new_user stvara im profile.
insert into auth.users (id, email, raw_app_meta_data, raw_user_meta_data, aud, role) values
  ('00000000-0000-4000-8000-0000000000a1', 'test.student@fer.hr', '{"provider":"azure"}', '{}', 'authenticated', 'authenticated'),
  ('00000000-0000-4000-8000-0000000000a2', 'test.partner@example.com', '{"provider":"email"}', '{}', 'authenticated', 'authenticated'),
  ('00000000-0000-4000-8000-0000000000a3', 'test.neodobren@example.com', '{"provider":"email"}', '{}', 'authenticated', 'authenticated'),
  ('00000000-0000-4000-8000-0000000000a4', 'test.admin@example.com', '{"provider":"email"}', '{}', 'authenticated', 'authenticated');
update public.profiles set role = 'admin' where id = '00000000-0000-4000-8000-0000000000a4';

-- test.partner preuzima demo partnera Kafić Kampus; test.neodobren ima profil na čekanju s nacrtom ponude.
update public.partners set owner_id = '00000000-0000-4000-8000-0000000000a2'
  where id = 'a1000000-0000-4000-8000-000000000001';
insert into public.partners (id, owner_id, name, oib, category_id, address, city, phone)
  select 'a1000000-0000-4000-8000-0000000000f1', '00000000-0000-4000-8000-0000000000a3', 'Neodobreni partner',
         '00000000044', id, 'Ilica 1, Zagreb', 'Zagreb', '01 000 0000'
  from public.categories where name = 'Hrana';
insert into public.offers (id, partner_id, category_id, title, description, discount_type, discount_value, valid_until, status)
  select 'b1000000-0000-4000-8000-0000000000f1', 'a1000000-0000-4000-8000-0000000000f1', id, 'Skrivena ponuda',
         'Partner nije odobren.', 'postotak', 50, '2027-12-31', 'aktivna'
  from public.categories where name = 'Hrana';

-- ---------------------------------------------------------------- posjetitelj (anon)
set local role anon;
set local request.jwt.claims = '{"role":"anon"}';

insert into rezultati select 'anon vidi samo 3 javne ponude', count(*) = 3 from public.offers;
insert into rezultati select 'anon vidi samo 3 javna partnera', count(*) = 3 from public.partners;
insert into rezultati select 'anon ne vidi pretplate', count(*) = 0 from public.subscriptions;
insert into rezultati select 'anon ne vidi kupone', count(*) = 0 from public.coupons;
do $$ begin
  insert into public.categories (name) values ('Hakirano');
  insert into rezultati values ('anon ne može dodati kategoriju', false);
exception when insufficient_privilege then
  insert into rezultati values ('anon ne može dodati kategoriju', true);
end $$;

-- ---------------------------------------------------------------- student
set local role authenticated;
set local request.jwt.claims = '{"sub":"00000000-0000-4000-8000-0000000000a1","role":"authenticated"}';

insert into rezultati select 'student ne vidi nacrte ni ponude neodobrenih', count(*) = 3 from public.offers;
do $$ begin
  insert into public.coupons (offer_id, student_id, code)
    values ('b1000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-0000000000a1', 'TEST-0001');
  insert into rezultati values ('student generira kupon za aktivnu ponudu', true);
exception when others then
  insert into rezultati values ('student generira kupon za aktivnu ponudu', false);
end $$;
do $$ begin
  insert into public.coupons (offer_id, student_id, code)
    values ('b1000000-0000-4000-8000-000000000004', '00000000-0000-4000-8000-0000000000a1', 'TEST-0002');
  insert into rezultati values ('student ne može kupon za nacrt', false);
exception when insufficient_privilege then
  insert into rezultati values ('student ne može kupon za nacrt', true);
end $$;
do $$ begin
  insert into public.coupons (offer_id, student_id, code)
    values ('b1000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-0000000000a2', 'TEST-0003');
  insert into rezultati values ('student ne može kupon u tuđe ime', false);
exception when insufficient_privilege then
  insert into rezultati values ('student ne može kupon u tuđe ime', true);
end $$;
do $$ begin
  insert into public.reviews (coupon_id, student_id, partner_id, rating)
    select id, student_id, 'a1000000-0000-4000-8000-000000000001', 5 from public.coupons where code = 'TEST-0001';
  insert into rezultati values ('student ne može recenzirati neiskorišten kupon', false);
exception when insufficient_privilege then
  insert into rezultati values ('student ne može recenzirati neiskorišten kupon', true);
end $$;
do $$ begin
  insert into public.offers (partner_id, category_id, title, description, discount_type, discount_value, valid_until)
    select 'a1000000-0000-4000-8000-000000000001', id, 'Lažna', 'Lažna', 'postotak', 99, '2027-01-01'
    from public.categories limit 1;
  insert into rezultati values ('student ne može dodati ponudu', false);
exception when insufficient_privilege then
  insert into rezultati values ('student ne može dodati ponudu', true);
end $$;

-- ---------------------------------------------------------------- partner bez odobrenja
set local request.jwt.claims = '{"sub":"00000000-0000-4000-8000-0000000000a3","role":"authenticated"}';

insert into rezultati select 'neodobreni partner vidi javne i svoje ponude', count(*) = 4 from public.offers;
insert into rezultati select 'neodobreni partner ne vidi tuđe kupone', count(*) = 0 from public.coupons;
do $$ begin
  update public.partners set approval_status = 'odobren' where id = 'a1000000-0000-4000-8000-0000000000f1';
  insert into rezultati values ('partner ne može sam odobriti profil', false);
exception when insufficient_privilege then
  insert into rezultati values ('partner ne može sam odobriti profil', true);
end $$;
do $$ begin
  insert into public.offers (partner_id, category_id, title, description, discount_type, discount_value, valid_until)
    select 'a1000000-0000-4000-8000-000000000001', id, 'Tuđa', 'Tuđa', 'postotak', 10, '2027-01-01'
    from public.categories limit 1;
  insert into rezultati values ('partner ne može dodati ponudu drugom partneru', false);
exception when insufficient_privilege then
  insert into rezultati values ('partner ne može dodati ponudu drugom partneru', true);
end $$;
do $$ declare n int; begin
  update public.coupons set status = 'iskoristen', redeemed_at = now() where code = 'TEST-0001';
  get diagnostics n = row_count;
  insert into rezultati values ('partner ne može potvrditi tuđi kupon', n = 0);
end $$;

-- ---------------------------------------------------------------- partner vlasnik ponude
set local request.jwt.claims = '{"sub":"00000000-0000-4000-8000-0000000000a2","role":"authenticated"}';

insert into rezultati select 'partner vidi kupon svoje ponude', count(*) = 1 from public.coupons;
do $$ declare n int; begin
  update public.coupons set status = 'iskoristen', redeemed_at = now() where code = 'TEST-0001';
  get diagnostics n = row_count;
  insert into rezultati values ('partner potvrđuje kupon svoje ponude', n = 1);
end $$;

-- ---------------------------------------------------------------- student nakon iskorištenja
set local request.jwt.claims = '{"sub":"00000000-0000-4000-8000-0000000000a1","role":"authenticated"}';

do $$ begin
  insert into public.reviews (coupon_id, student_id, partner_id, rating, comment)
    select id, student_id, 'a1000000-0000-4000-8000-000000000001', 5, 'Odlično' from public.coupons where code = 'TEST-0001';
  insert into rezultati values ('student recenzira iskorišteni kupon', true);
exception when others then
  insert into rezultati values ('student recenzira iskorišteni kupon', false);
end $$;
do $$ begin
  insert into public.reviews (coupon_id, student_id, partner_id, rating)
    select id, student_id, 'a1000000-0000-4000-8000-000000000001', 1 from public.coupons where code = 'TEST-0001';
  insert into rezultati values ('student ne može dvaput recenzirati isti kupon', false);
exception when unique_violation then
  insert into rezultati values ('student ne može dvaput recenzirati isti kupon', true);
end $$;
do $$ begin
  insert into public.subscriptions (partner_id, plan, status, valid_until)
    values ('a1000000-0000-4000-8000-0000000000f1', 'godisnja', 'aktivna', '2030-01-01');
  insert into rezultati values ('korisnik ne može sam upisati pretplatu', false);
exception when insufficient_privilege then
  insert into rezultati values ('korisnik ne može sam upisati pretplatu', true);
end $$;

-- ---------------------------------------------------------------- administrator
set local request.jwt.claims = '{"sub":"00000000-0000-4000-8000-0000000000a4","role":"authenticated"}';

insert into rezultati select 'administrator vidi sve ponude', count(*) = 5 from public.offers;
insert into rezultati select 'administrator vidi sve partnere', count(*) = 4 from public.partners;

-- ---------------------------------------------------------------- rezultat
reset role;

do $$ begin
  if exists (select 1 from rezultati where not ok) then
    raise exception 'Pali testovi: %', (select string_agg(test, '; ') from rezultati where not ok);
  end if;
end $$;

select * from rezultati;

rollback;
