export default function LoginPage() {
  return (
    <div className="mx-auto max-w-sm rounded-lg border border-gray-200 bg-white p-6 text-center">
      <h1 className="text-2xl font-bold">Prijava</h1>
      <p className="mt-2 text-sm text-gray-600">
        Prijavi se Google računom. Nakon prve prijave odabireš ulogu: student ili partner.
      </p>
      <button disabled className="mt-6 w-full rounded border border-gray-300 px-4 py-2 opacity-50">
        Prijava Google računom (uskoro)
      </button>
    </div>
  );
}
