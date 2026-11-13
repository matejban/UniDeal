import type { LatLng } from "../lib/geo";

// Pretvaranje adrese u koordinate (F-013). Google je iza ovog sučelja, pa se pravila
// geokodiranja u PartnerServiceu mogu ispitati bez Googlea.
export interface Geocoder {
  // Koordinate adrese ili null ako adresa nije pronađena dovoljno točno.
  geocode(address: string, city: string): Promise<LatLng | null>;
}

// Bez ključa (lokalni razvoj) adresa se nikad ne pronalazi, pa partner lokaciju označava ručno na karti.
export class NoGeocoder implements Geocoder {
  async geocode(): Promise<LatLng | null> {
    return null;
  }
}
