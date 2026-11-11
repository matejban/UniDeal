import Link from "next/link";
import { planLabels, type SubscriptionPlan } from "@/domain/Subscription";
import { requireRole } from "@/lib/auth";
import { partnerService, subscriptionService } from "@/services";
import { startCheckout } from "./actions";

// poruke za ?greska=... u adresi
const errors: Record<string, string> = {
  plan: "Odabran je nepoznat plan pretplate.",
  profil: "Pretplatu možeš platiti tek nakon što registriraš poslovni subjekt.",
  odbijen: "Profil je odbijen pa pretplata nije moguća. Za više informacija javi se administratoru.",
  aktivna: "Pretplata je već aktivna.",
  cijena: "Plaćanje ovog plana trenutačno nije dostupno.",
  placanje: "Plaćanje nije moguće pokrenuti. Pokušaj ponovno kasnije.",
};

const period: Record<SubscriptionPlan, string> = { mjesecna: "mjesečno", godisnja: "godišnje" };

const euro = new Intl.NumberFormat("hr-HR", { style: "currency", currency: "EUR" });

// Partner bira plan i plaća pretplatu na Stripeovoj stranici (F-008). Podaci o kartici ne prolaze kroz našu aplikaciju (NF-05).
export default async function PartnerSubscriptionPage({
  searchParams,
}: {
  searchParams: Promise<{ uspjeh?: string; otkazano?: string; greska?: string }>;
}) {
  const { uspjeh, otkazano, greska } = await searchParams;
  const user = await requireRole("partner");
  const partner = await partnerService.getByOwner(user.id);

  if (!partner) {
    return (
      <div>
        <h1 className="text-2xl font-bold">Pretplata</h1>
        <p className="mt-2 text-gray-600">Pretplatu možeš platiti tek nakon što registriraš poslovni subjekt.</p>
        <Link
          href="/partner/registracija"
          className="mt-4 inline-block rounded bg-blue-700 px-4 py-2 text-white hover:bg-blue-800"
        >
          Registriraj poslovni subjekt
        </Link>
      </div>
    );
  }

  const prices = await subscriptionService.getPrices();

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-bold">Pretplata</h1>
      <p className="mt-2 text-gray-600">
        Profil i ponude javno su vidljivi dok je profil odobren i dok imaš aktivnu pretplatu. Plaćanje se odvija na
        Stripeovoj stranici; mi nikad ne vidimo podatke o tvojoj kartici.
      </p>
      <Link href="/partner" className="mt-2 inline-block text-sm text-blue-700 hover:underline">
        Natrag na partnersku ploču
      </Link>

      {uspjeh && (
        <p className="mt-6 rounded bg-green-50 p-3 text-sm text-green-800">
          Plaćanje se obrađuje. Pretplata će se aktivirati čim Stripe potvrdi uplatu.
        </p>
      )}
      {otkazano && (
        <p className="mt-6 rounded bg-yellow-50 p-3 text-sm text-yellow-800">
          Plaćanje je otkazano. Ništa nije naplaćeno i pretplata nije promijenjena.
        </p>
      )}
      {greska && errors[greska] && <p className="mt-6 rounded bg-red-50 p-3 text-sm text-red-700">{errors[greska]}</p>}

      {prices.length === 0 ? (
        <p className="mt-6 text-sm text-gray-600">Cijene pretplate još nisu postavljene.</p>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {prices.map((price) => (
            <form
              key={price.plan}
              action={startCheckout.bind(null, price.plan)}
              className="rounded-lg border border-gray-200 bg-white p-4"
            >
              <h2 className="font-semibold">{planLabels[price.plan]}</h2>
              <p className="mt-2 text-2xl font-bold">{euro.format(price.amountEur)}</p>
              <p className="text-sm text-gray-600">{period[price.plan]}</p>
              <button
                type="submit"
                disabled={!price.isPayable()}
                className="mt-4 w-full rounded bg-blue-700 px-4 py-2 text-white hover:bg-blue-800 disabled:opacity-50"
              >
                Plati
              </button>
              {!price.isPayable() && <p className="mt-2 text-xs text-gray-600">Plaćanje još nije dostupno.</p>}
            </form>
          ))}
        </div>
      )}
    </div>
  );
}
