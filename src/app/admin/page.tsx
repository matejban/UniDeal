import { offerService, partnerService } from "@/services";

export default async function AdminPage() {
  const [partners, activeOffers] = await Promise.all([partnerService.getAll(), offerService.search()]);
  const stats = [
    { label: "Partneri", value: partners.length },
    { label: "Aktivne ponude", value: activeOffers.length },
    { label: "Iskorišteni kuponi", value: 0 },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold">Administracija</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <div key={s.label} className="rounded-lg border border-gray-200 bg-white p-4">
            <p className="text-sm text-gray-500">{s.label}</p>
            <p className="mt-1 text-2xl font-bold">{s.value}</p>
          </div>
        ))}
      </div>

      <section className="mt-6 rounded-lg border border-gray-200 bg-white p-4">
        <h2 className="font-semibold">Partneri na čekanju odobrenja</h2>
        <p className="mt-2 text-sm text-gray-500">Nema partnera na čekanju.</p>
      </section>
    </div>
  );
}
