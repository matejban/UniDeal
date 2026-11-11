-- Brisanje stare slike pri zamjeni loga ili fotografije ponude i pri brisanju ponude (#13, #16).
-- Storage pri brisanju (remove) prvo pronalazi datoteku, pa uz pravilo za delete treba i pravilo za select.
-- Bez njega brisanje ne javlja grešku, ali datoteka ostaje. Slike su i dalje javne preko javnog URL-a;
-- ovo pravilo samo dopušta vlasniku da kroz API vidi datoteke u mapi svojeg partnera.
create policy "Partner vidi slike u svojoj mapi" on storage.objects
  for select to authenticated
  using (
    bucket_id in ('partner-logos', 'offer-photos')
    and private.owns_partner(((storage.foldername(name))[1])::uuid)
  );
