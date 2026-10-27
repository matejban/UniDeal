-- is_admin() koriste samo pravila za prijavljene korisnike; neprijavljeni je ne trebaju pozivati.
revoke execute on function public.is_admin() from public, anon;
grant execute on function public.is_admin() to authenticated;
