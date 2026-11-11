import { isSubscriptionPlan, type SubscriptionPrice } from "../domain/Subscription";
import type { User } from "@/domain/User";
import type { PartnerRepository } from "@/repositories/PartnerRepository";
import type { SubscriptionRepository } from "@/repositories/SubscriptionRepository";
import type { PaymentGateway } from "@/services/PaymentGateway";

// Razlog zbog kojeg plaćanje nije pokrenuto; koristi se u ?greska=... na stranici pretplate.
export type CheckoutFailure = "plan" | "profil" | "odbijen" | "aktivna" | "cijena" | "placanje";

export type CheckoutResult = { ok: true; url: string } | { ok: false; reason: CheckoutFailure };

export type CheckoutUrls = { successUrl: string; cancelUrl: string };

export class SubscriptionService {
  constructor(
    private readonly subscriptions: SubscriptionRepository,
    private readonly partners: PartnerRepository,
    private readonly payments: PaymentGateway,
  ) {}

  getPrices(): Promise<SubscriptionPrice[]> {
    return this.subscriptions.findPrices();
  }

  // Pokretanje plaćanja pretplate (F-008). Ništa ne upisuje u pretplatu: status postavlja tek webhook (#34),
  // jer partner može zatvoriti preglednik prije povratka s naplate.
  async startCheckout(user: User, plan: unknown, urls: CheckoutUrls): Promise<CheckoutResult> {
    // plan dolazi iz obrasca, pa se ne smije prihvatiti kao zadan
    if (!isSubscriptionPlan(plan)) {
      return { ok: false, reason: "plan" };
    }

    // plaća se za vlastiti profil, a traži se po prijavljenom korisniku, ne po ID-u iz obrasca
    const partner = await this.partners.findByOwner(user.id);
    if (!partner) {
      return { ok: false, reason: "profil" };
    }
    if (partner.approvalStatus === "odbijen") {
      return { ok: false, reason: "odbijen" };
    }

    // ne naplaćuje se dvaput dok postojeća pretplata još vrijedi
    const current = await this.subscriptions.findByPartner(partner.id);
    if (current?.isActive()) {
      return { ok: false, reason: "aktivna" };
    }

    const price = await this.subscriptions.findPrice(plan);
    if (!price || !price.isPayable()) {
      return { ok: false, reason: "cijena" };
    }

    try {
      const url = await this.payments.createCheckout({
        priceId: price.stripePriceId as string,
        partnerId: partner.id,
        customerEmail: user.email,
        successUrl: urls.successUrl,
        cancelUrl: urls.cancelUrl,
      });
      return { ok: true, url };
    } catch (e) {
      console.error("Stripe Checkout nije pokrenut:", e);
      return { ok: false, reason: "placanje" };
    }
  }
}
