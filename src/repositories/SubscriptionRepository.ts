import type { Subscription, SubscriptionPlan, SubscriptionPrice } from "@/domain/Subscription";

export interface SubscriptionRepository {
  // Cijene oba plana, onako kako su spremljene u bazi (#32).
  findPrices(): Promise<SubscriptionPrice[]>;
  findPrice(plan: SubscriptionPlan): Promise<SubscriptionPrice | undefined>;
  // Pretplata partnera, ako je ikad plaćena. Partner čita samo svoju.
  findByPartner(partnerId: string): Promise<Subscription | undefined>;
}
