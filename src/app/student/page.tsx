import { getCurrentUser } from "@/lib/auth";

export default async function StudentPage() {
  // /student je dostupan samo prijavljenima (src/proxy.ts).
  const user = await getCurrentUser();

  if (!user?.isVerifiedStudent()) {
    return (
      <div>
        <h1 className="text-2xl font-bold">Moj profil</h1>
        <p className="mt-2 text-gray-600">
          Ova stranica je za studente. Prijavi se računom svog fakulteta ili veleučilišta (Microsoft).
        </p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">Moj profil</h1>
      <p className="mt-2 text-gray-600">
        Status studenta: potvrđen · {user.institution} ({user.email})
      </p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <section className="rounded-lg border border-gray-200 bg-white p-4">
          <h2 className="font-semibold">Moji kuponi</h2>
          <p className="mt-2 text-sm text-gray-500">Još nema generiranih kupona.</p>
        </section>
        <section className="rounded-lg border border-gray-200 bg-white p-4">
          <h2 className="font-semibold">Favoriti</h2>
          <p className="mt-2 text-sm text-gray-500">Još nema spremljenih ponuda ni partnera.</p>
        </section>
      </div>
    </div>
  );
}
