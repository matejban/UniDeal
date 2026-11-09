import { describe, expect, it } from "vitest";
import type { PlatformStatistics, StatisticsRepository } from "@/repositories/StatisticsRepository";
import { StatisticsService } from "./StatisticsService";

const STATISTICS: PlatformStatistics = {
  students: 5,
  partners: 3,
  activeOffers: 4,
  redeemedCoupons: 2,
  byCategory: [{ name: "Hrana", count: 2 }],
  byCity: [{ name: "Zagreb", count: 2 }],
};

class FakeStatisticsRepository implements StatisticsRepository {
  calls: [string, string][] = [];

  async getStatistics(from: string, to: string) {
    this.calls.push([from, to]);
    return STATISTICS;
  }
}

function setup() {
  const repo = new FakeStatisticsRepository();
  return { repo, service: new StatisticsService(repo, () => "2026-11-09") };
}

describe("StatisticsService.resolvePeriod", () => {
  const DEFAULT = { from: "2026-10-11", to: "2026-11-09" };

  it("bez datuma vrijedi zadnjih 30 dana, uključujući danas", () => {
    expect(setup().service.resolvePeriod(undefined, undefined)).toEqual({ period: DEFAULT, invalid: false });
  });

  it("prazni datumi iz obrasca znače zadano razdoblje", () => {
    expect(setup().service.resolvePeriod("", "")).toEqual({ period: DEFAULT, invalid: false });
  });

  it("prihvaća oba datuma", () => {
    expect(setup().service.resolvePeriod("2026-01-01", "2026-01-31")).toEqual({
      period: { from: "2026-01-01", to: "2026-01-31" },
      invalid: false,
    });
  });

  it("prihvaća razdoblje od jednog dana", () => {
    expect(setup().service.resolvePeriod("2026-03-05", "2026-03-05").invalid).toBe(false);
  });

  it("samo početak traje do danas", () => {
    expect(setup().service.resolvePeriod("2026-11-01", undefined)).toEqual({
      period: { from: "2026-11-01", to: "2026-11-09" },
      invalid: false,
    });
  });

  it("samo kraj uzima 30 dana unatrag", () => {
    expect(setup().service.resolvePeriod(undefined, "2026-03-31")).toEqual({
      period: { from: "2026-03-02", to: "2026-03-31" },
      invalid: false,
    });
  });

  it.each([
    ["početak nakon kraja", "2026-02-01", "2026-01-01"],
    ["nepostojeći datum", "2026-02-31", "2026-03-01"],
    ["pogrešan oblik", "01.02.2026.", "2026-03-01"],
    ["tekst", "abc", "def"],
    ["ponovljen parametar", ["2026-01-01", "2026-01-02"], "2026-03-01"],
    ["ponovljen kraj uz prazan početak", "", ["2026-01-01", "2026-01-02"]],
  ])("%s daje zadano razdoblje i oznaku greške", (_, from, to) => {
    expect(setup().service.resolvePeriod(from, to)).toEqual({ period: DEFAULT, invalid: true });
  });
});

describe("StatisticsService.getReport", () => {
  it("traži podatke za razdoblje i vraća ih uz razdoblje", async () => {
    const { repo, service } = setup();
    const period = { from: "2026-01-01", to: "2026-01-31" };

    expect(await service.getReport(period)).toEqual({ ...STATISTICS, period, revenueEur: null });
    expect(repo.calls).toEqual([["2026-01-01", "2026-01-31"]]);
  });

  it("prihod nije nula dok ne postoji izvor podataka", async () => {
    const report = await setup().service.getReport({ from: "2026-01-01", to: "2026-01-31" });
    expect(report.revenueEur).toBeNull();
  });
});
