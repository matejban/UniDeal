import { requireRole } from "@/lib/auth";
import { partnerService } from "@/services";
import { decidePartner } from "./actions";

export default async function AdminPartnersPage({ searchParams }: { searchParams: Promise<{ greska?: string }> }) {
  await requireRole("admin");
  const { greska } = await searchParams;
  const pending = await partnerService.getPending();

  return (
    <div>
      <h1 className="text-2xl font-bold">Partneri na čekanju odobrenja</h1>
      {greska && (
        <p className="mt-4 rounded bg-red-50 p-3 text-sm text-red-700">Odluka nije spremljena. Pokušaj ponovno.</p>
      )}

      <div className="mt-6 overflow-x-auto rounded-lg border border-gray-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-gray-200 text-gray-500">
            <tr>
              <th className="px-4 py-2 font-medium">Naziv</th>
              <th className="px-4 py-2 font-medium">OIB</th>
              <th className="px-4 py-2 font-medium">Kategorija</th>
              <th className="px-4 py-2 font-medium">Adresa</th>
              <th className="px-4 py-2 font-medium">Kontakt</th>
              <th className="px-4 py-2 font-medium">Prijavljen</th>
              <th className="px-4 py-2" />
            </tr>
          </thead>
          <tbody>
            {pending.map((p) => (
              <tr key={p.id} className="border-b border-gray-100 last:border-0">
                <td className="px-4 py-2">{p.name}</td>
                <td className="px-4 py-2">{p.oib}</td>
                <td className="px-4 py-2">{p.category || "—"}</td>
                <td className="px-4 py-2">
                  {p.address}, {p.city}
                </td>
                <td className="px-4 py-2">
                  {p.ownerEmail ?? "—"}
                  <br />
                  {p.phone}
                </td>
                <td className="px-4 py-2">{p.createdAt.toLocaleDateString("hr-HR")}</td>
                <td className="px-4 py-2">
                  <form action={decidePartner} className="flex justify-end gap-2">
                    <input type="hidden" name="partnerId" value={p.id} />
                    <button
                      name="decision"
                      value="odobren"
                      className="rounded bg-blue-700 px-3 py-1 text-white hover:bg-blue-800"
                    >
                      Odobri
                    </button>
                    <button
                      name="decision"
                      value="odbijen"
                      className="rounded border border-gray-300 px-3 py-1 hover:border-red-700 hover:text-red-700"
                    >
                      Odbij
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {pending.length === 0 && <p className="p-4 text-sm text-gray-500">Nema partnera na čekanju.</p>}
      </div>
    </div>
  );
}
