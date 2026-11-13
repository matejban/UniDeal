"use client";

import { AdvancedMarker, APIProvider, Map, Pin } from "@vis.gl/react-google-maps";
import { useActionState, useEffect, useState } from "react";
import type { LatLng } from "@/lib/geo";
import { saveLocation, type LocationState } from "./actions";

// Isti ogledni Map ID kao na karti partnera (src/components/PartnerMap.tsx).
const MAP_ID = "DEMO_MAP_ID";

// Partner klikom na kartu označava lokaciju kad geokodiranje ne pronađe adresu (F-013, #24),
// a može i ispraviti lokaciju koju je izračunao Google.
export default function LocationPicker({
  apiKey,
  location,
  initialCenter,
  initialZoom,
}: {
  apiKey: string;
  location: LatLng | null;
  initialCenter: LatLng;
  initialZoom: number;
}) {
  const [state, action, pending] = useActionState(saveLocation, { error: "", saved: false } as LocationState);
  const [picked, setPicked] = useState<LatLng | null>(location);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    // Google ovu funkciju poziva kad ključ nije ispravan ili nije dopušten za ovu domenu.
    window.gm_authFailure = () => setFailed(true);
  }, []);

  if (failed) {
    return <p className="text-sm text-gray-600">Karta se trenutačno ne može učitati, pa lokaciju sada nije moguće označiti.</p>;
  }

  return (
    <form action={action} className="space-y-3">
      <input type="hidden" name="lat" value={picked?.lat ?? ""} />
      <input type="hidden" name="lng" value={picked?.lng ?? ""} />

      <APIProvider apiKey={apiKey} language="hr" region="HR" onError={() => setFailed(true)}>
        <Map
          mapId={MAP_ID}
          defaultCenter={initialCenter}
          defaultZoom={initialZoom}
          gestureHandling="cooperative"
          clickableIcons={false}
          onClick={(e) => {
            if (e.detail.latLng) {
              setPicked(e.detail.latLng);
            }
          }}
          className="h-72 w-full overflow-hidden rounded border border-gray-300"
        >
          {picked && (
            <AdvancedMarker position={picked} title="Lokacija partnera">
              <Pin background="#1d4ed8" borderColor="#1e3a8a" glyphColor="#ffffff" />
            </AdvancedMarker>
          )}
        </Map>
      </APIProvider>

      <p className="text-xs text-gray-500">Klikni na kartu na mjesto ulaza u poslovni prostor.</p>
      {state.saved && <p className="rounded bg-green-50 p-3 text-sm text-green-800">Lokacija je spremljena.</p>}
      {state.error && <p className="text-sm text-red-700">{state.error}</p>}
      <button
        disabled={pending || !picked}
        className="rounded border border-gray-300 px-4 py-2 text-sm hover:border-blue-700 disabled:opacity-50"
      >
        {pending ? "Spremanje…" : "Spremi lokaciju"}
      </button>
    </form>
  );
}
