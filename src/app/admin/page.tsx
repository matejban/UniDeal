import Link from "next/link";
import { requireRole } from "@/lib/auth";
import type { StatisticsRow } from "@/repositories/StatisticsRepository";
import { partnerService, statisticsService } from "@/services";

function formatNumber(value: number): string {
  return value.toLocaleString("hr-HR");
}

// GGGG-MM-DD u hrvatski oblik (NF-11). Datum se ne pretvara u vrijeme, da se ne pomakne zbog vremenske zone.
function formatDate(date: string): string {
  const [year, month, day] = date.split("-").map(Number);
  return `${day}. ${month}. ${year}.`;
}

function BreakdownTable({ title, column, rows }: { title: string; column: string; rows: StatisticsRow[] }) {
  return (
    <section className="rounded-lg border border-gray-200 bg-white p-4">
      <h2 className="font-semibold">{title}</h2>
      {rows.length === 0 ? (
        <p className="mt-2 text-sm text-gray-500">Nema iskorištenih kupona u odabranom razdoblju.</p>
      ) : (
        <table className="mt-2 w-full text-left text-sm">
          <thead className="border-b border-gray-200 text-gray-500">
            <tr>
              <th className="py-2 font-medium">{column}</th>
              <th className="py-2 text-right font-medium">Iskorišteni kuponi</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.name} className="border-b border-gray-100 last:border-0">
                <td className="py-2">{row.name}</td>
                <td className="py-2 text-right">{formatNumber(row.count)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ od?: string | string[]; do?: string | string[] }>;
}) {
  await requireRole("admin");
  const params = await searchParams;
  const { period, invalid } = statisticsService.resolvePeriod(params.od, params.do);
  const [report, pending] = await Promise.all([statisticsService.getReport(period), partnerService.getPending()]);

  const untilEnd = `do ${formatDate(period.to)}`;
  const stats = [
    { label: "Studenti", value: formatNumber(report.students), note: untilEnd },
    { label: "Partneri", value: formatNumber(report.partners), note: untilEnd },
    { label: "Aktivne ponude", value: formatNumber(report.activeOffers), note: "trenutačno" },
    { label: "Iskorišteni kuponi", value: formatNumber(report.redeemedCoupons), note: "u odabranom razdoblju" },
    { label: "Prihod od pretplata", value: "—", note: "još nije dostupno" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold">Administracija</h1>

      <form className="mt-6 flex flex-wrap items-end gap-3 text-sm">
        <label className="flex flex-col gap-1">
          Od
          <input
            type="date"
            name="od"
            defaultValue={period.from}
            className="rounded border border-gray-300 px-3 py-1"
          />
        </label>
        <label className="flex flex-col gap-1">
          Do
          <input
            type="date"
            name="do"
            defaultValue={period.to}
            className="rounded border border-gray-300 px-3 py-1"
          />
        </label>
        <button className="rounded bg-blue-700 px-3 py-1 text-white hover:bg-blue-800">Prikaži</button>
      </form>
      {invalid && (
        <p className="mt-4 rounded bg-red-50 p-3 text-sm text-red-700">
          Razdoblje nije ispravno, pa je prikazano zadnjih 30 dana.
        </p>
      )}

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {stats.map((s) => (
          <div key={s.label} className="rounded-lg border border-gray-200 bg-white p-4">
            <p className="text-sm text-gray-500">{s.label}</p>
            <p className="mt-1 text-2xl font-bold">{s.value}</p>
            <p className="mt-1 text-xs text-gray-500">{s.note}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <BreakdownTable title="Iskorišteni kuponi po kategorijama" column="Kategorija" rows={report.byCategory} />
        <BreakdownTable title="Iskorišteni kuponi po gradovima" column="Grad" rows={report.byCity} />
      </div>

      <section className="mt-6 rounded-lg border border-gray-200 bg-white p-4">
        <h2 className="font-semibold">Partneri na čekanju odobrenja</h2>
        {pending.length === 0 ? (
          <p className="mt-2 text-sm text-gray-500">Nema partnera na čekanju.</p>
        ) : (
          <p className="mt-2 text-sm">
            Na čekanju: {pending.length}.{" "}
            <Link href="/admin/partneri" className="text-blue-700 hover:underline">
              Pregledaj i odluči
            </Link>
          </p>
        )}
      </section>
    </div>
  );
}
