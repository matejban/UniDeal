import "server-only";
import type { LatLng } from "../lib/geo";
import type { Geocoder } from "./Geocoder";

const GEOCODING_URL = "https://maps.googleapis.com/maps/api/geocode/json";

type GeocodingResponse = {
  status: string;
  error_message?: string;
  results?: { geometry: { location: LatLng; location_type: string } }[];
};

// Odgovor Google Geocoding API-ja pretvara u koordinate. ZERO_RESULTS znači da adresa nije pronađena;
// APPROXIMATE je samo grad ili područje, pa ga također smatramo nepronađenim da oznaka ne završi u središtu grada.
// Ostali statusi (npr. REQUEST_DENIED zbog krivog ključa) su greške.
export function parseGeocodingResponse(body: GeocodingResponse): LatLng | null {
  if (body.status === "ZERO_RESULTS") {
    return null;
  }
  if (body.status !== "OK") {
    throw new Error(`Geokodiranje nije uspjelo: ${body.status}${body.error_message ? ` (${body.error_message})` : ""}`);
  }
  const first = body.results?.[0];
  if (!first || first.geometry.location_type === "APPROXIMATE") {
    return null;
  }
  return { lat: first.geometry.location.lat, lng: first.geometry.location.lng };
}

// Google Geocoding API (F-013, C-02). Ključ je tajan i nema prefiks NEXT_PUBLIC_, pa se poziva samo s poslužitelja (NF-04).
export class GoogleGeocoder implements Geocoder {
  constructor(private readonly apiKey: string) {}

  async geocode(address: string, city: string): Promise<LatLng | null> {
    const params = new URLSearchParams({
      address: `${address}, ${city}`,
      components: "country:HR",
      language: "hr",
      key: this.apiKey,
    });
    const response = await fetch(`${GEOCODING_URL}?${params}`, { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`Geokodiranje nije uspjelo: HTTP ${response.status}`);
    }
    return parseGeocodingResponse(await response.json());
  }
}
