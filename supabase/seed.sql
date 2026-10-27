-- Demonstracijski partneri i ponude (preneseni iz nekadašnjeg src/lib/mock-data.ts), da aplikacija nije prazna.
-- Partneri nemaju korisnički račun (owner_id je prazan), odobreni su i imaju aktivnu pretplatu.
-- OIB-i su izmišljeni, ali s ispravnom kontrolnom znamenkom. Koordinate su približne.

insert into public.partners (id, name, oib, category_id, address, city, lat, lng, phone, hours, description, approval_status)
select v.id::uuid, v.name, v.oib, c.id, v.address, v.city, v.lat, v.lng, v.phone, v.hours, v.description, 'odobren'
from (values
  ('a1000000-0000-4000-8000-000000000001', 'Kafić Kampus', '00000000010', 'Hrana', 'Unska ulica 3, Zagreb', 'Zagreb',
   45.8008, 15.9707, '01 111 2222', 'Pon–Pet 7–22, Sub 8–14', 'Kafić uz kampus s doručkom i kavom za van.'),
  ('a1000000-0000-4000-8000-000000000002', 'Fit Zona', '00000000028', 'Zdravlje i sport', 'Savska cesta 25, Zagreb', 'Zagreb',
   45.8040, 15.9662, '01 333 4444', 'Svaki dan 6–23', 'Teretana s grupnim treninzima.'),
  ('a1000000-0000-4000-8000-000000000003', 'Knjižara Index', '00000000036', 'Obrazovanje', 'Ruđera Boškovića 31, Split', 'Split',
   43.5110, 16.4685, '021 555 666', 'Pon–Sub 9–20', 'Udžbenici, skripte i školski pribor.')
) as v (id, name, oib, category, address, city, lat, lng, phone, hours, description)
join public.categories c on c.name = v.category
on conflict (id) do nothing;

insert into public.subscriptions (partner_id, plan, status, valid_until)
select id, 'godisnja', 'aktivna', '2027-12-31 23:59:59+01'
from public.partners
where id in (
  'a1000000-0000-4000-8000-000000000001', 'a1000000-0000-4000-8000-000000000002', 'a1000000-0000-4000-8000-000000000003'
)
on conflict (partner_id) do nothing;

insert into public.offers (id, partner_id, category_id, title, description, discount_type, discount_value, valid_until, conditions, status, usage_limit)
select v.id::uuid, v.partner_id::uuid, c.id, v.title, v.description, v.discount_type, v.discount_value, v.valid_until::date,
       v.conditions, v.status, v.usage_limit
from (values
  ('b1000000-0000-4000-8000-000000000001', 'a1000000-0000-4000-8000-000000000001', 'Hrana', 'Kava + kroasan',
   'Kava po izboru i kroasan po studentskoj cijeni.', 'postotak', 30, '2026-12-31', 'Samo radnim danom do 11 h.', 'aktivna', 'neograniceno'),
  ('b1000000-0000-4000-8000-000000000002', 'a1000000-0000-4000-8000-000000000002', 'Zdravlje i sport', 'Mjesečna članarina',
   'Neograničen pristup teretani i grupnim treninzima.', 'iznos', 10, '2026-11-30', 'Jednom po studentu.', 'aktivna', 'jednom_po_studentu'),
  ('b1000000-0000-4000-8000-000000000003', 'a1000000-0000-4000-8000-000000000003', 'Obrazovanje', 'Popust na udžbenike',
   'Popust na sve udžbenike i skripte.', 'postotak', 15, '2027-01-31', 'Ne vrijedi uz druge akcije.', 'aktivna', 'neograniceno'),
  ('b1000000-0000-4000-8000-000000000004', 'a1000000-0000-4000-8000-000000000001', 'Hrana', 'Ručak dana',
   'Dnevni meni s juhom i desertom.', 'postotak', 20, '2026-12-15', 'Pon–Pet 12–15 h.', 'nacrt', 'neograniceno')
) as v (id, partner_id, category, title, description, discount_type, discount_value, valid_until, conditions, status, usage_limit)
join public.categories c on c.name = v.category
on conflict (id) do nothing;
