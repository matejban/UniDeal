import Link from "next/link";
import type { ApprovalStatus } from "@/domain/Partner";
import { requireRole } from "@/lib/auth";
import { offerService, partnerService } from "@/services";
import { deleteOffer } from "./ponude/actions";
import DeleteOfferButton from "./ponude/DeleteOfferButton";

// Status odobrenja profila (F-025). Dok se ne uvedu e-mail obavijesti, partner odluku vidi samo ovdje.
const approval: Record<ApprovalStatus, { text: string; className: string }> = {
  na_cekanju: {
    text: "Profil čeka odobrenje administratora. Do odobrenja profil i ponude nisu javno vidljivi.",
    className: "bg-yellow-100 text-yellow-800",
  },
  odobren: {
    text: "Profil je odobren. Javno je vidljiv dok imaš aktivnu pretplatu.",
    className: "bg-green-100 text-green-800",
  },
  odbijen: {
    text: "Profil je odbijen i nije javno vidljiv. Za više informacija javi se administratoru.",
    className: "bg-red-100 text-red-700",
  },
};

const messages: Record<string, string> = {
  spremljena: "Ponuda je spremljena.",
  obrisana: "Ponuda je obrisana.",
};

export default async function PartnerDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ poruka?: string }>;
}) {
  const { poruka } = await searchParams;
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

  const myOffers = await offerService.getPartnerOffers(partner.id);

  return (
    <div>
      <h1 className="text-2xl font-bold">Partnerska ploča</h1>
      <p className={`mt-4 rounded p-3 text-sm ${approval[partner.approvalStatus].className}`}>
        {approval[partner.approvalStatus].text}
      </p>
      <Link
        href="/partner/profil"
        className="mt-4 inline-block rounded border border-gray-300 bg-white px-4 py-2 text-sm hover:border-blue-700"
      >
        Uredi profil
      </Link>
      <p className="mt-2 text-gray-600">
        Pretplata: nije aktivna.{" "}
        <Link href="/partner/pretplata" className="text-blue-700 hover:underline">
          Plati pretplatu
        </Link>
      </p>

      <section className="mt-6 rounded-lg border border-gray-200 bg-white p-4">
        <h2 className="font-semibold">Potvrda kupona</h2>
        <div className="mt-3 flex gap-2">
          <input disabled placeholder="Kod s kupona" className="rounded border border-gray-300 px-3 py-2" />
          <button disabled className="rounded bg-blue-700 px-4 py-2 text-white opacity-50">Potvrdi</button>
        </div>
      </section>

      <section className="mt-6">
        <div className="mb-3 flex items-center justify-between gap-2">
          <h2 className="font-semibold">Moje ponude</h2>
          {partner.approvalStatus === "odobren" && (
            <Link
              href="/partner/ponude/nova"
              className="rounded bg-blue-700 px-4 py-2 text-sm text-white hover:bg-blue-800"
            >
              Nova ponuda
            </Link>
          )}
        </div>
        {partner.approvalStatus !== "odobren" && (
          <p className="mb-3 text-sm text-gray-600">Ponude možeš dodavati kad administrator odobri tvoj profil.</p>
        )}
        {poruka && messages[poruka] && (
          <p className="mb-3 rounded bg-green-50 p-3 text-sm text-green-800">{messages[poruka]}</p>
        )}
        <table className="w-full rounded-lg border border-gray-200 bg-white text-left text-sm">
          <thead className="border-b border-gray-200">
            <tr>
              <th className="p-3">Naziv</th>
              <th className="p-3">Status</th>
              <th className="p-3">Vrijedi do</th>
              <th className="p-3"><span className="sr-only">Radnje</span></th>
            </tr>
          </thead>
          <tbody>
            {myOffers.map((o) => (
              <tr key={o.id} className="border-b border-gray-100">
                <td className="p-3">{o.title}</td>
                <td className="p-3">{o.status}</td>
                <td className="p-3">{o.validUntil}</td>
                <td className="p-3">
                  <div className="flex items-center justify-end gap-3">
                    <Link
                      href={`/partner/ponude/${o.id}/uredi`}
                      className="rounded px-2 py-1 text-blue-700 hover:bg-blue-50"
                    >
                      Uredi
                    </Link>
                    <DeleteOfferButton action={deleteOffer.bind(null, o.id)} title={o.title} icon />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
