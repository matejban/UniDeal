export type StatisticsRow = { name: string; count: number };

export type PlatformStatistics = {
  students: number;
  partners: number;
  activeOffers: number;
  redeemedCoupons: number;
  byCategory: StatisticsRow[];
  byCity: StatisticsRow[];
};

export interface StatisticsRepository {
  // Datumi su u obliku GGGG-MM-DD, a razdoblje uključuje oba.
  getStatistics(from: string, to: string): Promise<PlatformStatistics>;
}
