import Link from "next/link";
import { requireRole } from "@/lib/auth";
import { offerService, partnerService } from "@/services";

export default async function PartnerDashboardPage() {
  const user = await requireRole("partner");
  const partner = await partnerService.getByOwner(user.id);

  if (!partner) {
    return (
      <div>
        <h1 className="text-2xl font-bold">Partnerska ploča</h1>
        <p className="mt-2 text-gray-600">Još nemaš profil partnera.</p>
        <Link
          href="/partner/registracija"
          className="mt-4 inline-block rounded bg-blue-700 px-4 py-2 text-white hover:bg-blue-800"
        >
          Registriraj poslovni subjekt
        </Link>
      </div>
    );
  }

  if (partner.approvalStatus !== "odobren") {
    return (
      <div>
        <h1 className="text-2xl font-bold">Partnerska ploča</h1>
        {partner.isPending() ? (
          <p className="mt-4 rounded bg-yellow-50 p-3 text-sm text-yellow-800">Profil čeka odobrenje administratora.</p>
        ) : (
          <p className="mt-4 rounded bg-red-50 p-3 text-sm text-red-700">Administrator je odbio profil partnera.</p>
        )}
      </div>
    );
  }

  const myOffers = await offerService.getPartnerOffers(partner.id);

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
