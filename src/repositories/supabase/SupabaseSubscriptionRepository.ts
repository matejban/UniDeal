import {
  Subscription,
  SubscriptionPrice,
  isSubscriptionPlan,
  subscriptionPlans,
  type SubscriptionPlan,
  type SubscriptionStatus,
} from "@/domain/Subscription";
import { createClient } from "@/lib/supabase/server";
import type { SubscriptionRepository } from "@/repositories/SubscriptionRepository";

type PriceRow = { plan: string; amount_eur: number; stripe_price_id: string | null };
type SubscriptionRow = { partner_id: string; plan: string; status: string; valid_until: string };

function toPrice(row: PriceRow): SubscriptionPrice {
  return new SubscriptionPrice(row.plan as SubscriptionPlan, Number(row.amount_eur), row.stripe_price_id);
}

export class SupabaseSubscriptionRepository implements SubscriptionRepository {
  async findPrices(): Promise<SubscriptionPrice[]> {
    const supabase = await createClient();
    const { data, error } = await supabase.from("subscription_prices").select("plan, amount_eur, stripe_price_id");
    if (error) throw new Error(`Učitavanje cijena pretplate nije uspjelo: ${error.message}`);

    // Redoslijed je uvijek mjesečna pa godišnja, a nepoznati planovi u bazi se zanemaruju.
    return (data as PriceRow[])
      .filter((row) => isSubscriptionPlan(row.plan))
      .map(toPrice)
      .sort((a, b) => subscriptionPlans.indexOf(a.plan) - subscriptionPlans.indexOf(b.plan));
  }

  async findPrice(plan: SubscriptionPlan): Promise<SubscriptionPrice | undefined> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("subscription_prices")
      .select("plan, amount_eur, stripe_price_id")
      .eq("plan", plan)
      .maybeSingle();
    if (error) throw new Error(`Učitavanje cijene pretplate nije uspjelo: ${error.message}`);
    return data ? toPrice(data as PriceRow) : undefined;
  }

  async findByPartner(partnerId: string): Promise<Subscription | undefined> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("subscriptions")
      .select("partner_id, plan, status, valid_until")
      .eq("partner_id", partnerId)
      .maybeSingle();
    if (error) throw new Error(`Učitavanje pretplate nije uspjelo: ${error.message}`);
    if (!data) return undefined;

    const row = data as SubscriptionRow;
    return new Subscription(
      row.partner_id,
      row.plan as SubscriptionPlan,
      row.status as SubscriptionStatus,
      new Date(row.valid_until),
    );
  }
}
