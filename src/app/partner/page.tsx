import { offers } from "@/lib/mock-data";

// Dok nema prijave, prikazuju se ponude jednog lažnog partnera.
const partnerId = "kafic-kampus";

export default function PartnerDashboardPage() {
  const myOffers = offers.filter((o) => o.partnerId === partnerId);

  return (
    <div>
      <h1 className="text-2xl font-bold">Partnerska ploča</h1>
      <p className="mt-2 text-gray-600">Pretplata: nije aktivna</p>

      <section className="mt-6 rounded-lg border border-gray-200 bg-white p-4">
        <h2 className="font-semibold">Potvrda kupona</h2>
        <div className="mt-3 flex gap-2">
          <input disabled placeholder="Kod s kupona" className="rounded border border-gray-300 px-3 py-2" />
          <button disabled className="rounded bg-blue-700 px-4 py-2 text-white opacity-50">Potvrdi</button>
        </div>
      </section>

      <section className="mt-6">
        <h2 className="mb-3 font-semibold">Moje ponude</h2>
        <table className="w-full rounded-lg border border-gray-200 bg-white text-left text-sm">
          <thead className="border-b border-gray-200">
            <tr><th className="p-3">Naziv</th><th className="p-3">Status</th><th className="p-3">Vrijedi do</th></tr>
          </thead>
          <tbody>
            {myOffers.map((o) => (
              <tr key={o.id} className="border-b border-gray-100">
                <td className="p-3">{o.title}</td>
                <td className="p-3">{o.status}</td>
                <td className="p-3">{o.validUntil}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
