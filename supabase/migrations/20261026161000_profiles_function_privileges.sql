-- handle_new_user poziva samo okidač na auth.users, a ne korisnici preko API-ja.
revoke execute on function public.handle_new_user() from public, anon, authenticated;

-- allowed_student_domains je javno čitljiva (RLS), pa student_institution ne treba povišena prava.
alter function public.student_institution(text) security invoker;
