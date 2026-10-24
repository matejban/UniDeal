import OfferCard from "@/components/OfferCard";
import { activeOffers, categories, getPartner, partners } from "@/lib/mock-data";

export default async function OffersPage({
  searchParams,
}: {
  searchParams: Promise<{ kategorija?: string; grad?: string }>;
}) {
  const { kategorija, grad } = await searchParams;
  const cities = [...new Set(partners.map((p) => p.city))];
  const results = activeOffers.filter(
    (o) =>
      (!kategorija || o.category === kategorija) &&
      (!grad || getPartner(o.partnerId)?.city === grad),
  );

  return (
    <div>
      <h1 className="text-2xl font-bold">Ponude</h1>

      <form className="mt-4 flex flex-wrap gap-3">
        <select name="kategorija" defaultValue={kategorija ?? ""} className="rounded border border-gray-300 bg-white px-3 py-2">
          <option value="">Sve kategorije</option>
          {categories.map((c) => (
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
        {results.map((o) => (
          <OfferCard key={o.id} offer={o} />
        ))}
      </div>
      {results.length === 0 && <p className="mt-6 text-gray-600">Nema ponuda za odabrane filtre.</p>}
    </div>
  );
}
