import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { safeRedirectPath } from "@/lib/redirect";
import { completeWelcome } from "./actions";

const errors: Record<string, string> = {
  "1": "Spremanje nije uspjelo. Pokušaj ponovno.",
  ime: "Ime mora imati između 1 i 100 znakova.",
  uvjeti: "Za nastavak prihvati uvjete korištenja.",
};

// Nakon svake prijave korisnik dolazi ovamo; tko je već prihvatio uvjete, odmah ide dalje.
export default async function WelcomePage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; greska?: string }>;
}) {
  const { next: rawNext, greska } = await searchParams;
  const next = safeRedirectPath(rawNext);
  const user = await getCurrentUser();
  if (!user) redirect(`/prijava?next=${encodeURIComponent(next)}`);
  if (user.hasAcceptedTerms()) redirect(next);

  return (
    <div className="mx-auto max-w-md space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dobro došao u UniDeal</h1>
        <p className="mt-1 text-sm text-gray-600">Prije nastavka upiši svoje ime i prihvati uvjete korištenja.</p>
      </div>
      {greska && errors[greska] && <p className="rounded bg-red-50 p-3 text-sm text-red-700">{errors[greska]}</p>}

      <form action={completeWelcome} className="space-y-4 rounded-lg border border-gray-200 bg-white p-6">
        <input type="hidden" name="next" value={next} />
        <div className="space-y-2">
          <label htmlFor="fullName" className="block text-sm font-semibold">
            {user.role === "partner" ? "Ime i prezime osobe za kontakt" : "Ime i prezime"}
          </label>
          <input
            id="fullName"
            name="fullName"
            required
            maxLength={100}
            defaultValue={user.fullName ?? ""}
            className="w-full rounded border border-gray-300 px-3 py-2"
          />
        </div>
        <label className="flex items-start gap-2 text-sm">
          <input type="checkbox" name="uvjeti" value="da" required className="mt-1" />
          <span>
            Pročitao sam i prihvaćam{" "}
            <Link href="/uvjeti" target="_blank" className="text-blue-700 underline">
              uvjete korištenja
            </Link>
            .
          </span>
        </label>
        <button className="w-full rounded bg-blue-700 px-4 py-2 text-white hover:bg-blue-800">Nastavi</button>
      </form>
    </div>
  );
}
