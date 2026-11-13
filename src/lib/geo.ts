export type LatLng = { lat: number; lng: number };

// Središte Hrvatske; karta se tu otvara dok nema lokacije korisnika ni odabranog grada.
export const CROATIA_CENTER: LatLng = { lat: 44.8, lng: 16.0 };

// Približne granice Hrvatske; ručno označena lokacija partnera mora biti unutar njih.
const CROATIA_BOUNDS = { north: 46.6, south: 42.3, east: 19.5, west: 13.4 };

export function isInCroatia(point: LatLng): boolean {
  return (
    Number.isFinite(point.lat) &&
    Number.isFinite(point.lng) &&
    point.lat >= CROATIA_BOUNDS.south &&
    point.lat <= CROATIA_BOUNDS.north &&
    point.lng >= CROATIA_BOUNDS.west &&
    point.lng <= CROATIA_BOUNDS.east
  );
}

export type Bounds ={ north: number; south: number; east: number; west: number };

// Najmanji pravokutnik koji obuhvaća sve točke; karta se otvara tako da se vide svi partneri.
// Vraća null za prazan popis.
export function boundsOf(points: LatLng[]): Bounds | null {
  if (points.length === 0) {
    return null;
  }
  const bounds = { north: points[0].lat, south: points[0].lat, east: points[0].lng, west: points[0].lng };
  for (const p of points) {
    bounds.north = Math.max(bounds.north, p.lat);
    bounds.south = Math.min(bounds.south, p.lat);
    bounds.east = Math.max(bounds.east, p.lng);
    bounds.west = Math.min(bounds.west, p.lng);
  }
  return bounds;
}

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
