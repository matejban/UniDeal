import Link from "next/link";
import { partnerService } from "@/services";

export default async function MapPage() {
  const partners = await partnerService.getAll();

  return (
    <div>
      <h1 className="text-2xl font-bold">Karta partnera</h1>
      <div className="mt-4 flex h-80 items-center justify-center rounded-lg border border-dashed border-gray-300 bg-white text-gray-500">
        Ovdje dolazi Google Maps karta
      </div>
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
