export default function StudentPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold">Moj profil</h1>
      <p className="mt-2 text-gray-600">Status studenta: nije potvrđen (potvrda studentskom e-mail adresom)</p>
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
