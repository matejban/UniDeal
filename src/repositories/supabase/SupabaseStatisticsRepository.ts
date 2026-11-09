import { createClient } from "@/lib/supabase/server";
import type { StatisticsRepository, StatisticsRow } from "@/repositories/StatisticsRepository";

type StatisticsResult = {
  students: number;
  partners: number;
  active_offers: number;
  redeemed_coupons: number;
  by_category: StatisticsRow[];
  by_city: StatisticsRow[];
};

// Ovlast administratora i ispravnost razdoblja provjerava baza (platform_statistics).
export class SupabaseStatisticsRepository implements StatisticsRepository {
  async getStatistics(from: string, to: string) {
    const supabase = await createClient();
    const { data, error } = await supabase.rpc("platform_statistics", { date_from: from, date_to: to });
    if (error) throw new Error(`Učitavanje statistike nije uspjelo: ${error.message}`);

    const result = data as unknown as StatisticsResult;
    return {
      students: result.students,
      partners: result.partners,
      activeOffers: result.active_offers,
      redeemedCoupons: result.redeemed_coupons,
      byCategory: result.by_category,
      byCity: result.by_city,
    };
  }
}
