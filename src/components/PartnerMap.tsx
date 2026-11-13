"use client";

import { AdvancedMarker, APIProvider, InfoWindow, Map, Pin, useMap } from "@vis.gl/react-google-maps";
import Link from "next/link";
import { useEffect, useState } from "react";
import { CROATIA_CENTER, type LatLng } from "@/lib/geo";
import type { MapCity, MapPartner } from "@/services/PartnerService";

// AdvancedMarker traži Map ID; Googleov ogledni ID dovoljan je dok ne napravimo vlastiti stil karte.
const MAP_ID = "DEMO_MAP_ID";

type View = { center: LatLng; zoom: number };
type LocationStatus = "trazim" | "korisnik" | "odbijeno";

// Pomiče kartu kad se promijeni odabrani prikaz (lokacija korisnika ili grad).
function CameraController({ view }: { view: View | null }) {
  const map = useMap();
  useEffect(() => {
    if (map && view) {
      map.panTo(view.center);
      map.setZoom(view.zoom);
    }
  }, [map, view]);
  return null;
}

// Interaktivna karta partnera (F-018). Lokacija korisnika koristi se samo u pregledniku i nigdje se ne sprema (NF-06).
// Ako se karta ne učita, stranica i dalje prikazuje popis partnera (NF-10).
export default function PartnerMap({ apiKey, partners, cities }: { apiKey: string; partners: MapPartner[]; cities: MapCity[] }) {
  const [failed, setFailed] = useState(false);
  const [location, setLocation] = useState<LocationStatus>("trazim");
  const [userPosition, setUserPosition] = useState<LatLng | null>(null);
  const [view, setView] = useState<View | null>(null);
  const [city, setCity] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    // Google ovu funkciju poziva kad ključ nije ispravan ili nije dopušten za ovu domenu.
    window.gm_authFailure = () => setFailed(true);

    // Preglednik bez geolokacije samo ne pomiče kartu; izbor grada je uvijek dostupan.
    navigator.geolocation?.getCurrentPosition(
      (position) => {
        const here = { lat: position.coords.latitude, lng: position.coords.longitude };
        setUserPosition(here);
        setLocation("korisnik");
        setView({ center: here, zoom: 14 });
      },
      () => setLocation("odbijeno"),
      { timeout: 10000 },
    );
  }, []);

  function chooseCity(name: string) {
    setCity(name);
    const chosen = cities.find((c) => c.name === name);
    if (chosen) {
      setView({ center: { lat: chosen.lat, lng: chosen.lng }, zoom: 13 });
    }
  }

  if (failed) {
    return (
      <p className="mt-4 rounded-lg border border-gray-300 bg-white p-4 text-gray-600">
        Karta se trenutačno ne može učitati. Partneri su navedeni ispod.
      </p>
    );
  }

  const selected = partners.find((p) => p.id === selectedId);

  return (
    <div className="mt-4">
      <div className="flex flex-wrap items-center gap-3">
        <label htmlFor="grad" className="text-sm font-semibold">
          Grad
        </label>
        <select
          id="grad"
          value={city}
          onChange={(e) => chooseCity(e.target.value)}
          className="rounded border border-gray-300 bg-white px-2 py-1.5 text-sm"
        >
          <option value="">Odaberi grad</option>
          {cities.map((c) => (
            <option key={c.name} value={c.name}>
              {c.name}
            </option>
          ))}
        </select>
        {location === "odbijeno" && (
          <p className="text-sm text-gray-600">Lokacija nije dostupna, pa odaberi grad.</p>
        )}
      </div>

      <APIProvider apiKey={apiKey} language="hr" region="HR" onError={() => setFailed(true)}>
        <Map
          mapId={MAP_ID}
          defaultCenter={CROATIA_CENTER}
          defaultZoom={7}
          gestureHandling="cooperative"
          className="mt-3 h-96 w-full overflow-hidden rounded-lg border border-gray-300"
        >
          <CameraController view={view} />

          {partners.map((p) => (
            <AdvancedMarker key={p.id} position={p} title={p.name} onClick={() => setSelectedId(p.id)}>
              <Pin background="#1d4ed8" borderColor="#1e3a8a" glyphColor="#ffffff" />
            </AdvancedMarker>
          ))}

          {userPosition && (
            <AdvancedMarker position={userPosition} title="Tvoja lokacija">
              <div className="h-4 w-4 rounded-full border-2 border-white bg-sky-500 shadow" />
            </AdvancedMarker>
          )}

          {selected && (
            <InfoWindow position={selected} pixelOffset={[0, -40]} onCloseClick={() => setSelectedId(null)}>
              <div className="text-sm text-gray-900">
                <p className="font-semibold">{selected.name}</p>
                <p className="text-gray-600">
                  {selected.category} · {selected.address}
                </p>
                <Link href={`/partneri/${selected.id}`} className="mt-1 inline-block text-blue-700 hover:underline">
                  Otvori profil
                </Link>
              </div>
            </InfoWindow>
          )}
        </Map>
      </APIProvider>
    </div>
  );
}

declare global {
  interface Window {
    gm_authFailure?: () => void;
  }
}
