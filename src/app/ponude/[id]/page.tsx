import Link from "next/link";
import { notFound } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { offerService } from "@/services";
import { issueCoupon } from "./actions";

// poruke za ?greska=... u adresi
const errors: Record<string, string> = {
  "1": "Generiranje kupona nije uspjelo. Pokušaj ponovno.",
  nepotvrden: "Kupon može generirati samo student s potvrđenim statusom.",
  ponuda: "Ponuda je istekla ili više nije dostupna.",
};

export default async function OfferPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ greska?: string }>;
}) {
  const { id } = await params;
  const { greska } = await searchParams;
  const listing = await offerService.getActiveOffer(id);
  if (!listing) notFound();
  const { offer, partner } = listing;
  const user = await getCurrentUser();

  return (
    <div className="max-w-2xl rounded-lg border border-gray-200 bg-white p-6">
      <p className="text-sm text-gray-500">{offer.category}</p>
      <h1 className="mt-1 text-2xl font-bold">{offer.title}</h1>
      <p className="mt-1 text-2xl font-semibold text-blue-700">{offer.discountLabel}</p>
      <p className="mt-4">{offer.description}</p>
      <dl className="mt-4 space-y-1 text-sm">
        <div><dt className="inline font-semibold">Uvjeti: </dt><dd className="inline">{offer.conditions}</dd></div>
        <div><dt className="inline font-semibold">Vrijedi do: </dt><dd className="inline">{offer.validUntil}</dd></div>
        <div>
          <dt className="inline font-semibold">Partner: </dt>
          <dd className="inline">
            <Link href={`/partneri/${partner.id}`} className="text-blue-700 hover:underline">{partner.name}</Link>
            , {partner.address}
          </dd>
        </div>
      </dl>

      {greska && errors[greska] && (
        <p className="mt-6 rounded bg-red-50 p-3 text-sm text-red-700">{errors[greska]}</p>
      )}

      {/* neprijavljeni vidi prijavu, student gumb, ostali ništa */}
      {!user && (
        <Link
          href={`/prijava?next=/ponude/${offer.id}`}
          className="mt-6 inline-block rounded bg-blue-700 px-4 py-2 text-white hover:bg-blue-800"
        >
          Prijavi se za kupon
        </Link>
      )}
      {user && user.role === "student" && (
        <form action={issueCoupon.bind(null, offer.id)}>
          <button className="mt-6 rounded bg-blue-700 px-4 py-2 text-white hover:bg-blue-800">
            Generiraj kupon
          </button>
        </form>
      )}
    </div>
  );
}