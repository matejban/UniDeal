-- Statistika platforme za odabrano razdoblje (F-030, #42).

-- Razdoblje uključuje oba datuma i računa se po zagrebačkom vremenu.
-- Studenti i partneri zbrojeni su do kraja razdoblja. Aktivne ponude su trenutačno stanje jer baza ne pamti
-- povijest statusa, a broje se isto kao na /ponude. Partneri se broje iz tablice partners, a ne po ulozi u profiles:
-- uloga partner dodjeljuje se i prije registracije profila, a demonstracijski partneri nemaju vlasnika.
create function public.platform_statistics(date_from date, date_to date)
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  period_start timestamptz;
  period_end timestamptz;
begin
  if not public.is_admin() then
    raise exception 'Samo administrator može vidjeti statistiku' using errcode = '42501';
  end if;
  if date_from is null or date_to is null or date_from > date_to then
    raise exception 'Razdoblje nije ispravno' using errcode = '22023';
  end if;

  period_start := date_from::timestamp at time zone 'Europe/Zagreb';
  period_end := (date_to + 1)::timestamp at time zone 'Europe/Zagreb';

  return (
    with redeemed as (
      select cat.name as category, par.city
      from public.coupons cou
      join public.offers off on off.id = cou.offer_id
      join public.categories cat on cat.id = off.category_id
      join public.partners par on par.id = off.partner_id
      where cou.status = 'iskoristen'
        and cou.redeemed_at >= period_start
        and cou.redeemed_at < period_end
    ),
    per_category as (
      select category as name, count(*) as n from redeemed group by category
    ),
    per_city as (
      select city as name, count(*) as n from redeemed group by city
    )
    select jsonb_build_object(
      'students', (
        select count(*) from public.profiles
        where role = 'student' and is_active and created_at < period_end
      ),
      'partners', (
        select count(*) from public.partners
        where approval_status = 'odobren' and created_at < period_end
      ),
      'active_offers', (
        select count(*) from public.offers
        where status = 'aktivna' and valid_until >= current_date and private.partner_is_public(partner_id)
      ),
      'redeemed_coupons', (select count(*) from redeemed),
      'by_category', (
        select coalesce(jsonb_agg(jsonb_build_object('name', name, 'count', n) order by n desc, name), '[]'::jsonb)
        from per_category
      ),
      'by_city', (
        select coalesce(jsonb_agg(jsonb_build_object('name', name, 'count', n) order by n desc, name), '[]'::jsonb)
        from per_city
      )
    )
  );
end;
$$;

revoke execute on function public.platform_statistics(date, date) from public, anon;
grant execute on function public.platform_statistics(date, date) to authenticated;
