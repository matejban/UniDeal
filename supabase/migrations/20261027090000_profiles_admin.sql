-- Upravljanje korisničkim računima (F-026): administrator pregledava profile i deaktivira račune.

-- E-mail se kopira u profil da ga administrator vidi bez pristupa tablici auth.users.
-- Deaktivirani korisnik (is_active = false) ne može se prijaviti (src/lib/auth.ts, /auth/callback).
alter table public.profiles
  add column email text,
  add column is_active boolean not null default true;

update public.profiles p
set email = u.email
from auth.users u
where u.id = p.id;

-- Je li prijavljeni korisnik administrator. Security definer da pravilo nad profiles ne poziva samo sebe.
create function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles
    where id = (select auth.uid()) and role = 'admin' and is_active
  );
$$;

create policy "Administrator čita sve profile"
  on public.profiles for select
  to authenticated
  using ((select public.is_admin()));

-- Aktivaciju mijenja samo administrator, i to ne za vlastiti račun.
-- Korisnici i dalje nemaju pravilo za update, pa je ovo jedini način promjene is_active.
create function public.set_user_active(target_id uuid, active boolean)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not public.is_admin() then
    raise exception 'Samo administrator može mijenjati aktivnost računa' using errcode = '42501';
  end if;
  if target_id = (select auth.uid()) then
    raise exception 'Administrator ne može deaktivirati vlastiti račun' using errcode = '42501';
  end if;
  update public.profiles set is_active = active where id = target_id;
  if not found then
    raise exception 'Korisnik ne postoji' using errcode = 'P0002';
  end if;
end;
$$;

revoke execute on function public.set_user_active(uuid, boolean) from public, anon;
grant execute on function public.set_user_active(uuid, boolean) to authenticated;

-- Novi korisnik dobiva i e-mail u profilu.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  is_student boolean := new.raw_app_meta_data ->> 'provider' = 'azure';
  inst text := public.student_institution(new.email);
begin
  insert into public.profiles (id, role, student_status, institution, full_name, email)
  values (
    new.id,
    case when is_student then 'student' else 'partner' end,
    case when is_student then (case when inst is null then 'nepotvrden' else 'potvrden' end) end,
    case when is_student then inst end,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name'),
    new.email
  );
  return new;
end;
$$;
