-- Cijene pretplate partnera (#32, F-008): po jedan redak za mjesečni i godišnji plan.
-- Iznosi su početni prijedlog (godišnja je oko 17 % jeftinija od 12 mjeseci); administrator ih kasnije mijenja (#41).
-- stripe_price_id ostaje prazan dok se u Stripeu ne naprave cijene. Zatim se upiše ručno u SQL Editoru:
--   update public.subscription_prices set stripe_price_id = 'price_…' where plan = 'mjesecna';
--   update public.subscription_prices set stripe_price_id = 'price_…' where plan = 'godisnja';
insert into public.subscription_prices (plan, amount_eur)
values
  ('mjesecna', 9.99),
  ('godisnja', 99.00)
on conflict (plan) do nothing;
