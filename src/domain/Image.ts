// Pravila za slike koje partner učitava (#13): logo i fotografije ponuda.
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
