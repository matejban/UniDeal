import { describe, expect, it } from "vitest";
import { Subscription, SubscriptionPrice, isSubscriptionPlan } from "./Subscription";

describe("isSubscriptionPlan", () => {
  it("prihvaća samo mjesečni i godišnji plan", () => {
    expect(isSubscriptionPlan("mjesecna")).toBe(true);
    expect(isSubscriptionPlan("godisnja")).toBe(true);
    expect(isSubscriptionPlan("besplatna")).toBe(false);
    expect(isSubscriptionPlan("")).toBe(false);
    expect(isSubscriptionPlan(undefined)).toBe(false);
  });
});

describe("SubscriptionPrice.isPayable", () => {
  it("plaćanje je moguće samo kad postoji ID Stripeove cijene", () => {
    expect(new SubscriptionPrice("mjesecna", 9.99, "price_123").isPayable()).toBe(true);
    expect(new SubscriptionPrice("mjesecna", 9.99, null).isPayable()).toBe(false);
    expect(new SubscriptionPrice("godisnja", 99, "").isPayable()).toBe(false);
  });
});

describe("Subscription.isActive", () => {
  const now = new Date("2026-11-10T12:00:00Z");

  it("aktivna pretplata s rokom u budućnosti je aktivna", () => {
    expect(new Subscription("p1", "mjesecna", "aktivna", new Date("2026-12-10T12:00:00Z")).isActive(now)).toBe(true);
  });

  it("aktivna pretplata kojoj je rok prošao nije aktivna", () => {
    expect(new Subscription("p1", "mjesecna", "aktivna", new Date("2026-11-01T12:00:00Z")).isActive(now)).toBe(false);
  });

  it("istekla i otkazana pretplata nisu aktivne, čak ni s rokom u budućnosti", () => {
    const future = new Date("2027-01-01T00:00:00Z");
    expect(new Subscription("p1", "godisnja", "istekla", future).isActive(now)).toBe(false);
    expect(new Subscription("p1", "godisnja", "otkazana", future).isActive(now)).toBe(false);
  });
});
