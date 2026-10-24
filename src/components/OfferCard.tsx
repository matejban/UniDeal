import Link from "next/link";
import type { OfferListing } from "@/services/OfferService";

export default function OfferCard({ listing: { offer, partner } }: { listing: OfferListing }) {
  return (
    <Link
      href={`/ponude/${offer.id}`}
      className="block rounded-lg border border-gray-200 bg-white p-4 hover:border-blue-500"
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold">{offer.title}</h3>
        <span className="rounded bg-blue-100 px-2 py-0.5 text-sm font-semibold text-blue-700">
          {offer.discountLabel}
        </span>
      </div>
      <p className="mt-1 text-sm text-gray-600">
        {partner.name} · {partner.city}
      </p>
      <p className="mt-2 text-xs text-gray-500">
        {offer.category} · vrijedi do {offer.validUntil}
      </p>
    </Link>
  );
}
