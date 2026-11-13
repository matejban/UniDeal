import Link from "next/link";
import PartnerMap from "@/components/PartnerMap";
import { partnerService } from "@/services";

export default async function MapPage() {
  const partners = await partnerService.getAll();
  const mapData = await partnerService.getMapData();
  // Javni ključ ograničen na domenu aplikacije (C-02); bez njega stranica prikazuje samo popis (NF-10).
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  return (
    <div>
      <h1 className="text-2xl font-bold">Karta partnera</h1>
      {apiKey ? (
        <PartnerMap apiKey={apiKey} partners={mapData.partners} cities={mapData.cities} />
      ) : (
        <p className="mt-4 rounded-lg border border-gray-300 bg-white p-4 text-gray-600">
          Karta trenutačno nije dostupna. Partneri su navedeni ispod.
        </p>
      )}
      <ul className="mt-6 space-y-2">
        {partners.map((p) => (
          <li key={p.id}>
            <Link href={`/partneri/${p.id}`} className="text-blue-700 hover:underline">{p.name}</Link>
            <span className="text-gray-600"> · {p.address}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
