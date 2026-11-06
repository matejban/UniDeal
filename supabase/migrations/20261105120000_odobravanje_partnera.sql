-- Odobravanje i odbijanje profila partnera (F-025, #37).

-- Status odobrenja mijenja samo administrator, i to samo ovom funkcijom: stupac approval_status
-- nije u popisu stupaca koje authenticated smije mijenjati (inicijalna shema).
-- Administrator može i naknadno promijeniti odluku, npr. odobriti ranije odbijenog partnera.
create function public.set_partner_approval(target_id uuid, new_status text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not public.is_admin() then
    raise exception 'Samo administrator može odobravati partnere' using errcode = '42501';
  end if;
  if new_status is null or new_status not in ('odobren', 'odbijen') then
    raise exception 'Status odobrenja mora biti odobren ili odbijen' using errcode = '22023';
  end if;
  update public.partners set approval_status = new_status where id = target_id;
  if not found then
    raise exception 'Partner ne postoji' using errcode = 'P0002';
  end if;
end;
$$;

revoke execute on function public.set_partner_approval(uuid, text) from public, anon;
grant execute on function public.set_partner_approval(uuid, text) to authenticated;
