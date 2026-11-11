// Pravila za slike koje partner učitava (#13): logo i fotografije ponuda.
// Spremišta za slike u Supabase Storageu.
export type ImageBucket = "partner-logos" | "offer-photos";

export const MAX_IMAGE_SIZE = 2 * 1024 * 1024; // 2 MB

// Dopuštene vrste slika i nastavak datoteke za svaku.
export const IMAGE_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

// Vraća poruku o grešci ili prazan tekst ako je slika u redu.
export function checkImage(file: File): string {
  if (file.size === 0) {
    return "Odaberi sliku.";
  }
  if (!(file.type in IMAGE_TYPES)) {
    return "Slika mora biti JPG, PNG ili WebP.";
  }
  if (file.size > MAX_IMAGE_SIZE) {
    return "Slika može imati najviše 2 MB.";
  }
  return "";
}

// Putanja unutar bucketa (<partnerId>/<ime datoteke>) iz javnog URL-a ili null ako URL nije iz tog bucketa.
export function imagePath(bucket: ImageBucket, publicUrl: string): string | null {
  const marker = `/storage/v1/object/public/${bucket}/`;
  let pathname: string;
  try {
    pathname = new URL(publicUrl).pathname;
  } catch {
    return null;
  }
  const start = pathname.indexOf(marker);
  if (start === -1) {
    return null;
  }
  const path = decodeURIComponent(pathname.slice(start + marker.length));
  return path === "" ? null : path;
}
