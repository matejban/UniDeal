-- Prihvaćanje uvjeta korištenja pri prvoj prijavi (F-032, #53).

alter table public.profiles add column terms_accepted_at timestamptz;

-- Korisnik bilježi samo vlastito prihvaćanje. Vrijeme postavlja baza, a jednom upisano se ne mijenja.
create function public.accept_terms()
returns void
language sql
security definer
set search_path = ''
as $$
  update public.profiles set terms_accepted_at = now()
  where id = (select auth.uid()) and terms_accepted_at is null;
$$;
revoke execute on function public.accept_terms() from public, anon;
grant execute on function public.accept_terms() to authenticated;
