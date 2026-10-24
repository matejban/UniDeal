import { notFound } from "next/navigation";
import OfferCard from "@/components/OfferCard";
import { partnerService } from "@/services";

export default async function PartnerProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const profile = await partnerService.getProfile(id);
  if (!profile) notFound();
  const { partner, listings } = profile;

  return (
    <div>
      <h1 className="text-2xl font-bold">{partner.name}</h1>
      <p className="mt-1 text-gray-600">{partner.category}</p>
      <p className="mt-4 max-w-2xl">{partner.description}</p>
      <dl className="mt-4 space-y-1 text-sm">
        <div><dt className="inline font-semibold">Adresa: </dt><dd className="inline">{partner.address}</dd></div>
        <div><dt className="inline font-semibold">Telefon: </dt><dd className="inline">{partner.phone}</dd></div>
        <div><dt className="inline font-semibold">Radno vrijeme: </dt><dd className="inline">{partner.hours}</dd></div>
      </dl>
      <h2 className="mb-4 mt-8 text-xl font-semibold">Aktivne ponude</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {listings.map((l) => (
          <OfferCard key={l.offer.id} listing={l} />
        ))}
      </div>
    </div>
  );
}
