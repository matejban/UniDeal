import { describe, expect, it } from "vitest";
import { type DiscountType, Offer, type OfferStatus } from "./Offer";

function offer(changes: { title?: string; discountType?: DiscountType; discountValue?: number; validUntil?: string; status?: OfferStatus } = {}) {
  return new Offer(
    "o1",
    "p1",
    changes.title ?? "Kava + kroasan",
    "Uz svaku kavu kroasan gratis",
    "Hrana",
    changes.discountType ?? "postotak",
    changes.discountValue ?? 20,
    changes.validUntil ?? "2026-12-31",
    "",
    changes.status ?? "nacrt",
    "neograniceno",
    "hrana",
    null,
  );
}

describe("Offer.canBeActivated", () => {
  it("ponuda s popunjenim poljima i budućim rokom može se objaviti", () => {
    expect(offer().canBeActivated("2026-11-09")).toBe(true);
  });

  it("ponuda kojoj rok ističe danas još se može objaviti", () => {
    expect(offer({ validUntil: "2026-11-09" }).canBeActivated("2026-11-09")).toBe(true);
  });

  it("ponuda s rokom u prošlosti ne može se objaviti", () => {
    expect(offer({ validUntil: "2026-11-08" }).canBeActivated("2026-11-09")).toBe(false);
  });

  it("ponuda bez naziva ne može se objaviti", () => {
    expect(offer({ title: "  " }).canBeActivated("2026-11-09")).toBe(false);
  });
});

describe("Offer.canBeEdited", () => {
  it("istekla ponuda ne može se uređivati", () => {
    expect(offer({ status: "istekla" }).canBeEdited()).toBe(false);
    expect(offer({ status: "aktivna" }).canBeEdited()).toBe(true);
  });
});

describe("Offer.discountLabel", () => {
  it("postotak", () => {
    expect(offer({ discountValue: 20 }).discountLabel).toBe("−20 %");
  });

  it("iznos s dvije decimale i decimalnim zarezom", () => {
    expect(offer({ discountType: "iznos", discountValue: 5 }).discountLabel).toBe("−5,00 €");
    expect(offer({ discountType: "iznos", discountValue: 2.5 }).discountLabel).toBe("−2,50 €");
  });
});
