export type LatLng = { lat: number; lng: number };

// Središte Hrvatske; karta se tu otvara dok nema lokacije korisnika ni odabranog grada.
export const CROATIA_CENTER: LatLng = { lat: 44.8, lng: 16.0 };

// Prosjek koordinata; služi kao središte grada na karti bez dodatnog geokodiranja (F-018).
// Vraća null za prazan popis.
export function centerOf(points: LatLng[]): LatLng | null {
  if (points.length === 0) {
    return null;
  }
  let lat = 0;
  let lng = 0;
  for (const p of points) {
    lat += p.lat;
    lng += p.lng;
  }
  return { lat: lat / points.length, lng: lng / points.length };
}
