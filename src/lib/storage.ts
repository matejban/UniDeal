import { IMAGE_TYPES } from "@/domain/Image";
import { createClient } from "@/lib/supabase/server";

export type ImageBucket = "partner-logos" | "offer-photos";

// Učitava sliku u Supabase Storage i vraća njezin javni URL (#13).
// Slika ide u mapu partnera (<partnerId>/…); pravila Storagea dopuštaju upis samo vlasniku partnera.
// Prije poziva sliku treba provjeriti funkcijom checkImage (src/domain/Image.ts).
// Koristi je logo partnera (#11), a može i fotografija ponude (#16).
export async function uploadImage(bucket: ImageBucket, partnerId: string, file: File): Promise<string> {
  const supabase = await createClient();

  // Svaka slika dobiva novo ime, pa preglednik ne prikazuje staru sliku iz predmemorije.
  const extension = IMAGE_TYPES[file.type];
  const path = `${partnerId}/${Date.now()}.${extension}`;

  const { error } = await supabase.storage.from(bucket).upload(path, file, { contentType: file.type });
  if (error) {
    throw new Error(`Učitavanje slike nije uspjelo: ${error.message}`);
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}
