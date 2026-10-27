-- Uređivanje vlastitog profila i deaktivacija vlastitog računa (F-005, #7).

-- Korisnik mijenja samo svoje ime; uloga, status studenta, e-mail i aktivnost ostaju mu nedostupni.
alter table public.profiles
  add constraint profiles_full_name_length check (full_name is null or char_length(full_name) between 1 and 100);
revoke update on public.profiles from anon, authenticated;
grant update (full_name) on public.profiles to authenticated;
create policy "Korisnik mijenja svoj profil" on public.profiles
  for update to authenticated
  using (id = (select auth.uid())) with check (id = (select auth.uid()));

-- Korisnik deaktivira vlastiti račun. Ponovno ga može aktivirati samo administrator (set_user_active).
create function public.deactivate_own_account()
returns void
language sql
security definer
set search_path = ''
as $$
  update public.profiles set is_active = false where id = (select auth.uid());
$$;
revoke execute on function public.deactivate_own_account() from public, anon;
grant execute on function public.deactivate_own_account() to authenticated;

-- Recenzije deaktiviranih korisnika nisu javne; ponude već skriva private.partner_is_public.
create function private.profile_is_active(uid uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce((select is_active from public.profiles where id = uid), false);
$$;
revoke execute on function private.profile_is_active(uuid) from public;
grant execute on function private.profile_is_active(uuid) to anon, authenticated;

alter policy "Svi čitaju recenzije" on public.reviews
  using (not is_removed and private.profile_is_active(student_id));
alter policy "Prijavljeni čitaju recenzije" on public.reviews
  using (
    (not is_removed and private.profile_is_active(student_id))
    or student_id = (select auth.uid())
    or (select public.is_admin())
  );
