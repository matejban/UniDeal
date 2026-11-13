export type LatLng = { lat: number; lng: number };

// Središte Hrvatske; karta se tu otvara dok nema lokacije korisnika ni odabranog grada.
export const CROATIA_CENTER: LatLng = { lat: 44.8, lng: 16.0 };

export type Bounds = { north: number; south: number; east: number; west: number };

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
