export type SubscriptionPlan = "mjesecna" | "godisnja";
export type SubscriptionStatus = "aktivna" | "istekla" | "otkazana";

export const subscriptionPlans: SubscriptionPlan[] = ["mjesecna", "godisnja"];

export const planLabels: Record<SubscriptionPlan, string> = {
  mjesecna: "Mjesečna pretplata",
  godisnja: "Godišnja pretplata",
};

// Vrijednost iz obrasca ili adrese nije pouzdana, pa se plan uvijek provjerava prije uporabe.
export function isSubscriptionPlan(value: unknown): value is SubscriptionPlan {
  return value === "mjesecna" || value === "godisnja";
}

// Cijena jednog plana. Iznos prikazujemo korisniku, a Stripe naplaćuje cijenu s ID-em stripePriceId (F-008).
export class SubscriptionPrice {
  constructor(
    readonly plan: SubscriptionPlan,
    readonly amountEur: number,
    // Prazno dok se cijena ne napravi u Stripeu i ne upiše u bazu (#32).
    readonly stripePriceId: string | null,
  ) {}

  // Plaćanje je moguće samo za plan čija je cijena napravljena u Stripeu.
  isPayable(): boolean {
    return this.stripePriceId !== null && this.stripePriceId !== "";
  }
}

// Pretplata partnera. Status upisuje samo Stripe webhook (#34), nikad povratak s naplate.
export class Subscription {
  constructor(
    readonly partnerId: string,
    readonly plan: SubscriptionPlan,
    readonly status: SubscriptionStatus,
    readonly validUntil: Date,
  ) {}

  // Aktivna je dok je status "aktivna" i rok nije prošao (F-007).
  isActive(now: Date = new Date()): boolean {
    return this.status === "aktivna" && this.validUntil.getTime() > now.getTime();
  }
}
