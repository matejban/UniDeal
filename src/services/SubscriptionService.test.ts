import { beforeEach, describe, expect, it } from "vitest";
import { Partner } from "../domain/Partner";
import { Subscription, SubscriptionPrice, type SubscriptionPlan } from "../domain/Subscription";
import { User } from "../domain/User";
import type { PartnerRepository } from "@/repositories/PartnerRepository";
import type { SubscriptionRepository } from "@/repositories/SubscriptionRepository";
import type { CheckoutRequest, PaymentGateway } from "./PaymentGateway";
import { SubscriptionService } from "./SubscriptionService";

const urls = { successUrl: "https://x.test/partner/pretplata?uspjeh=1", cancelUrl: "https://x.test/partner/pretplata?otkazano=1" };

const user = new User("u1", "partner@example.com", "partner", null, null);

function partner(approval: Partner["approvalStatus"] = "odobren") {
  return new Partner("p1", "Kafić", "Hrana", "Zagreb", "Unska 3", "01 111", "", "", approval, "12345678903", "u1", null);
}

class FakeSubscriptions implements SubscriptionRepository {
  prices: SubscriptionPrice[] = [
    new SubscriptionPrice("mjesecna", 9.99, "price_mjesecna"),
    new SubscriptionPrice("godisnja", 99, "price_godisnja"),
  ];
  current: Subscription | undefined;

  async findPrices() {
    return this.prices;
  }
  async findPrice(plan: SubscriptionPlan) {
    return this.prices.find((p) => p.plan === plan);
  }
  async findByPartner() {
    return this.current;
  }
}

class FakeGateway implements PaymentGateway {
  requests: CheckoutRequest[] = [];
  fail = false;

  async createCheckout(request: CheckoutRequest) {
    if (this.fail) throw new Error("Stripe nedostupan");
    this.requests.push(request);
    return "https://checkout.stripe.test/sesija";
  }
}

describe("SubscriptionService.startCheckout", () => {
  let subscriptions: FakeSubscriptions;
  let gateway: FakeGateway;
  let found: Partner | undefined;
  let service: SubscriptionService;

  beforeEach(() => {
    subscriptions = new FakeSubscriptions();
    gateway = new FakeGateway();
    found = partner();
    const partners = { findByOwner: async () => found } as unknown as PartnerRepository;
    service = new SubscriptionService(subscriptions, partners, gateway);
  });

  it("pokreće plaćanje s ID-em cijene iz baze i ID-em partnera", async () => {
    const result = await service.startCheckout(user, "godisnja", urls);

    expect(result).toEqual({ ok: true, url: "https://checkout.stripe.test/sesija" });
    expect(gateway.requests).toEqual([
      { priceId: "price_godisnja", partnerId: "p1", customerEmail: "partner@example.com", ...urls },
    ]);
  });

  it("odbija nepoznat plan i ne zove Stripe", async () => {
    expect(await service.startCheckout(user, "besplatna", urls)).toEqual({ ok: false, reason: "plan" });
    expect(await service.startCheckout(user, undefined, urls)).toEqual({ ok: false, reason: "plan" });
    expect(gateway.requests).toHaveLength(0);
  });

  it("odbija korisnika bez profila partnera", async () => {
    found = undefined;
    expect(await service.startCheckout(user, "mjesecna", urls)).toEqual({ ok: false, reason: "profil" });
    expect(gateway.requests).toHaveLength(0);
  });

  it("odbija partnera čiji je profil odbijen, a dopušta onoga koji čeka odobrenje", async () => {
    found = partner("odbijen");
    expect(await service.startCheckout(user, "mjesecna", urls)).toEqual({ ok: false, reason: "odbijen" });

    found = partner("na_cekanju");
    expect((await service.startCheckout(user, "mjesecna", urls)).ok).toBe(true);
  });

  it("ne naplaćuje dvaput dok pretplata još vrijedi", async () => {
    subscriptions.current = new Subscription("p1", "mjesecna", "aktivna", new Date("2999-01-01T00:00:00Z"));
    expect(await service.startCheckout(user, "mjesecna", urls)).toEqual({ ok: false, reason: "aktivna" });
    expect(gateway.requests).toHaveLength(0);
  });

  it("dopušta novo plaćanje kad je pretplata istekla ili otkazana", async () => {
    subscriptions.current = new Subscription("p1", "mjesecna", "istekla", new Date("2000-01-01T00:00:00Z"));
    expect((await service.startCheckout(user, "mjesecna", urls)).ok).toBe(true);

    subscriptions.current = new Subscription("p1", "mjesecna", "otkazana", new Date("2999-01-01T00:00:00Z"));
    expect((await service.startCheckout(user, "mjesecna", urls)).ok).toBe(true);
  });

  it("odbija plan čija cijena nije napravljena u Stripeu", async () => {
    subscriptions.prices = [new SubscriptionPrice("mjesecna", 9.99, null)];
    expect(await service.startCheckout(user, "mjesecna", urls)).toEqual({ ok: false, reason: "cijena" });
    expect(await service.startCheckout(user, "godisnja", urls)).toEqual({ ok: false, reason: "cijena" });
    expect(gateway.requests).toHaveLength(0);
  });

  it("javlja grešku plaćanja kad Stripe ne radi", async () => {
    gateway.fail = true;
    expect(await service.startCheckout(user, "mjesecna", urls)).toEqual({ ok: false, reason: "placanje" });
  });
});
