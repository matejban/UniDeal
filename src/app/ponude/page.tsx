import OfferCard from "@/components/OfferCard";
import { OFFER_CATEGORIES } from "@/domain/Offer";
import { offerService, partnerService } from "@/services";

export default async function OffersPage({
  searchParams,
}: {
  searchParams: Promise<{ kategorija?: string; grad?: string }>;
}) {
  const { kategorija, grad } = await searchParams;
  const cities = await partnerService.getCities();
  const results = await offerService.search({ category: kategorija, city: grad });

  return (
    <div>
      <h1 className="text-2xl font-bold">Ponude</h1>

      <form className="mt-4 flex flex-wrap gap-3">
        <select name="kategorija" defaultValue={kategorija ?? ""} className="rounded border border-gray-300 bg-white px-3 py-2">
          <option value="">Sve kategorije</option>
          {OFFER_CATEGORIES.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
        <select name="grad" defaultValue={grad ?? ""} className="rounded border border-gray-300 bg-white px-3 py-2">
          <option value="">Svi gradovi</option>
          {cities.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
        <button className="rounded bg-blue-700 px-4 py-2 text-white hover:bg-blue-800">Filtriraj</button>
      </form>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {results.map((l) => (
          <OfferCard key={l.offer.id} listing={l} />
        ))}
      </div>
      {results.length === 0 && <p className="mt-6 text-gray-600">Nema ponuda za odabrane filtre.</p>}
    </div>
  );
}
