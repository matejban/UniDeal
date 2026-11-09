import type { PlatformStatistics, StatisticsRepository } from "@/repositories/StatisticsRepository";

export type StatisticsPeriod = { from: string; to: string };
// Prihod je null dok ne postoji izvor podataka (#34), da se ne prikaže lažna nula.
export type StatisticsReport = PlatformStatistics & { period: StatisticsPeriod; revenueEur: number | null };

const DEFAULT_DAYS = 30;

function isValidDate(value: unknown): value is string {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  // 2026-02-31 bi se inače pretvorio u 3. ožujka.
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

function addDays(date: string, days: number): string {
  const result = new Date(`${date}T00:00:00Z`);
  result.setUTCDate(result.getUTCDate() + days);
  return result.toISOString().slice(0, 10);
}

function todayInZagreb(): string {
  return new Date().toLocaleDateString("en-CA", { timeZone: "Europe/Zagreb" });
}

// Statistika platforme za administratora (F-030). Vraća obične objekte, jer iste podatke koristi i izvoz (#44).
export class StatisticsService {
  constructor(
    private readonly statistics: StatisticsRepository,
    private readonly today: () => string = todayInZagreb,
  ) {}

  // Razdoblje iz URL-a. Bez datuma vrijedi zadnjih 30 dana, a uz neispravan datum isto to uz oznaku greške.
  resolvePeriod(from: unknown, to: unknown): { period: StatisticsPeriod; invalid: boolean } {
    const end = this.today();
    const fallback = { from: addDays(end, 1 - DEFAULT_DAYS), to: end };
    if (!from && !to) return { period: fallback, invalid: false };

    const periodTo = to || end;
    if (!isValidDate(periodTo)) return { period: fallback, invalid: true };
    const periodFrom = from || addDays(periodTo, 1 - DEFAULT_DAYS);
    if (!isValidDate(periodFrom) || periodFrom > periodTo) return { period: fallback, invalid: true };
    return { period: { from: periodFrom, to: periodTo }, invalid: false };
  }

  async getReport(period: StatisticsPeriod): Promise<StatisticsReport> {
    const statistics = await this.statistics.getStatistics(period.from, period.to);
    return { ...statistics, period, revenueEur: null };
  }
}
