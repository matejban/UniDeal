import { requireUser } from "@/lib/auth";
import { deactivateAccount, updateProfile } from "./actions";

const roles = { student: "Student", partner: "Partner", admin: "Administrator" };

const errors: Record<string, string> = {
  "1": "Spremanje nije uspjelo. Pokušaj ponovno.",
  ime: "Ime mora imati između 1 i 100 znakova.",
  potvrda: "Za deaktivaciju označi da razumiješ posljedice.",
};

export default async function ProfilePage({
  searchParams,
}: {
  searchParams: Promise<{ greska?: string; poruka?: string }>;
}) {
  const user = await requireUser();
  const { greska, poruka } = await searchParams;

  return (
    <div className="max-w-lg space-y-6">
      <h1 className="text-2xl font-bold">Moj račun</h1>
      {greska && errors[greska] && <p className="rounded bg-red-50 p-3 text-sm text-red-700">{errors[greska]}</p>}
      {poruka === "spremljeno" && <p className="rounded bg-green-50 p-3 text-sm text-green-800">Promjene su spremljene.</p>}

      <section className="rounded-lg border border-gray-200 bg-white p-6">
        <dl className="space-y-1 text-sm">
          <div><dt className="inline font-semibold">E-mail: </dt><dd className="inline">{user.email}</dd></div>
          <div><dt className="inline font-semibold">Uloga: </dt><dd className="inline">{user.role ? roles[user.role] : "—"}</dd></div>
          {user.institution && (
            <div><dt className="inline font-semibold">Učilište: </dt><dd className="inline">{user.institution}</dd></div>
          )}
        </dl>
        <form action={updateProfile} className="mt-4 space-y-2">
          <label htmlFor="fullName" className="block text-sm font-semibold">Ime i prezime</label>
          <input
            id="fullName"
            name="fullName"
            required
            maxLength={100}
            defaultValue={user.fullName ?? ""}
            className="w-full rounded border border-gray-300 px-3 py-2"
          />
          <button className="rounded bg-blue-700 px-4 py-2 text-white hover:bg-blue-800">Spremi</button>
        </form>
      </section>

      <section className="rounded-lg border border-red-200 bg-white p-6">
        <h2 className="font-semibold">Deaktivacija računa</h2>
        <p className="mt-1 text-sm text-gray-600">
          Nakon deaktivacije više se ne možeš prijaviti, a tvoje ponude i recenzije nisu javno vidljive. Račun ponovno može
          aktivirati samo administrator.
        </p>
        <form action={deactivateAccount} className="mt-3 space-y-2">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="potvrda" value="da" required />
            Razumijem i želim deaktivirati račun.
          </label>
          <button className="rounded border border-red-600 px-4 py-2 text-red-700 hover:bg-red-50">Deaktiviraj račun</button>
        </form>
      </section>
    </div>
  );
}
