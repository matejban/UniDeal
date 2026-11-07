import Image from "next/image";
import { notFound } from "next/navigation";
import OfferCard from "@/components/OfferCard";
import { getCurrentUser } from "@/lib/auth";
import { partnerService } from "@/services";

export default async function PartnerProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let profile = await partnerService.getProfile(id);

  // Profil koji nije javan vidi samo njegov vlasnik, kao pregled (F-010). Svi ostali dobivaju 404.
  let isPreview = false;
  if (!profile) {
    const user = await getCurrentUser();
    if (user && user.role === "partner") {
      profile = await partnerService.getOwnerPreview(id, user.id);
      isPreview = true;
    }
  }
  if (!profile) {
    notFound();
  }
  const { partner, listings } = profile;

  return (
    <div>
      {isPreview && (
        <p className="mb-6 rounded bg-yellow-100 p-3 text-sm text-yellow-800">
          Ovo je pregled tvog profila. Javno je vidljiv tek kad ga administrator odobri i dok imaš aktivnu pretplatu.
        </p>
      )}
      <div className="flex items-center gap-4">
        {partner.logoUrl && (
          <Image
            src={partner.logoUrl}
            alt={`Logo: ${partner.name}`}
            width={80}
            height={80}
            className="h-20 w-20 rounded border border-gray-200 bg-white object-contain"
          />
        )}
        <div>
          <h1 className="text-2xl font-bold">{partner.name}</h1>
          <p className="mt-1 text-gray-600">{partner.category}</p>
        </div>
      </div>
      <p className="mt-4 max-w-2xl">{partner.description}</p>
      <dl className="mt-4 space-y-1 text-sm">
        <div><dt className="inline font-semibold">Adresa: </dt><dd className="inline">{partner.address}</dd></div>
        <div><dt className="inline font-semibold">Telefon: </dt><dd className="inline">{partner.phone}</dd></div>
        <div><dt className="inline font-semibold">Radno vrijeme: </dt><dd className="inline">{partner.hours}</dd></div>
      </dl>
      <h2 className="mb-4 mt-8 text-xl font-semibold">Aktivne ponude</h2>
      {listings.length === 0 && <p className="text-gray-600">Još nema aktivnih ponuda.</p>}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {listings.map((l) => (
          <OfferCard key={l.offer.id} listing={l} />
        ))}
      </div>
    </div>
  );
}
