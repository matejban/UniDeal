import Link from "next/link";
import OfferCard from "@/components/OfferCard";
import { offerService } from "@/services";

export default async function Home() {
  const listings = await offerService.search();

  return (
    <div className="space-y-10">
      <section>
        <h1 className="text-3xl font-bold">Studentski popusti na jednom mjestu</h1>
        <p className="mt-3 max-w-2xl text-gray-600">
          Pretraži ponude partnera u svojem gradu, generiraj kupon s QR kodom i iskoristi popust.
          Za studente besplatno.
        </p>
        <div className="mt-5 flex gap-3">
          <Link href="/ponude" className="rounded bg-blue-700 px-4 py-2 text-white hover:bg-blue-800">
            Pregledaj ponude
          </Link>
          <Link href="/prijava" className="rounded border border-gray-300 px-4 py-2 hover:border-blue-700">
            Postani partner
          </Link>
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-xl font-semibold">Aktualne ponude</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {listings.map((l) => (
            <OfferCard key={l.offer.id} listing={l} />
          ))}
        </div>
      </section>
    </div>
  );
}
