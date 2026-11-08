-- Spremišta za slike (#13): logo partnera (F-010) i fotografije ponuda (F-011).
-- Slike su javne za čitanje, a pišu se u mapu partnera: <partner_id>/<ime datoteke>.

-- Baza i sama odbija datoteke veće od 2 MB i one koje nisu JPG, PNG ili WebP.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('partner-logos', 'partner-logos', true, 2097152, array['image/jpeg', 'image/png', 'image/webp']),
  ('offer-photos', 'offer-photos', true, 2097152, array['image/jpeg', 'image/png', 'image/webp']);

-- Javni bucket čita se preko javnog URL-a bez pravila. Pravila ispod vrijede za upis i brisanje:
-- partner smije pisati samo u mapu svojeg partnera, pa ne može prepisati tuđi logo.
-- (storage.foldername(name))[1] je prva mapa u putanji, tj. ID partnera.
create policy "Partner učitava slike u svoju mapu" on storage.objects
  for insert to authenticated
  with check (
    bucket_id in ('partner-logos', 'offer-photos')
    and private.owns_partner(((storage.foldername(name))[1])::uuid)
  );

create policy "Partner mijenja slike u svojoj mapi" on storage.objects
  for update to authenticated
  using (
    bucket_id in ('partner-logos', 'offer-photos')
    and private.owns_partner(((storage.foldername(name))[1])::uuid)
  );

create policy "Partner briše slike iz svoje mape" on storage.objects
  for delete to authenticated
  using (
    bucket_id in ('partner-logos', 'offer-photos')
    and private.owns_partner(((storage.foldername(name))[1])::uuid)
  );
