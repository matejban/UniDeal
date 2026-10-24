import Link from "next/link";
import { notFound } from "next/navigation";
import { getPartner, offers } from "@/lib/mock-data";

export default async function OfferPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const offer = offers.find((o) => o.id === id && o.status === "aktivna");
  if (!offer) notFound();
  const partner = getPartner(offer.partnerId);

  return (
    <div className="max-w-2xl rounded-lg border border-gray-200 bg-white p-6">
      <p className="text-sm text-gray-500">{offer.category}</p>
      <h1 className="mt-1 text-2xl font-bold">{offer.title}</h1>
      <p className="mt-1 text-2xl font-semibold text-blue-700">−{offer.discount}</p>
      <p className="mt-4">{offer.description}</p>
      <dl className="mt-4 space-y-1 text-sm">
        <div><dt className="inline font-semibold">Uvjeti: </dt><dd className="inline">{offer.conditions}</dd></div>
        <div><dt className="inline font-semibold">Vrijedi do: </dt><dd className="inline">{offer.validUntil}</dd></div>
        {partner && (
          <div>
            <dt className="inline font-semibold">Partner: </dt>
            <dd className="inline">
              <Link href={`/partneri/${partner.id}`} className="text-blue-700 hover:underline">{partner.name}</Link>
              , {partner.address}
            </dd>
          </div>
        )}
      </dl>
      <button disabled className="mt-6 rounded bg-blue-700 px-4 py-2 text-white opacity-50">
        Generiraj kupon (uskoro)
      </button>
    </div>
  );
}
