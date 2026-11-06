import { describe, expect, it } from "vitest";
import { Coupon, generateCouponCode } from "./Coupon";

describe("generateCouponCode", () => {
  // NF-07: 10 000 kodova bez ponavljanja
  it("generira 10 000 različitih kodova", () => {
    const codes = new Set<string>();
    for (let i = 0; i < 10000; i++) {
      codes.add(generateCouponCode());
    }
    expect(codes.size).toBe(10000);
  });

  it("kod ima 10 znakova i nema 0, O, 1 ni I", () => {
    const code = generateCouponCode();
    expect(code.length).toBe(10);
    expect(code).not.toMatch(/[0O1I]/);
  });
});

describe("Coupon.isValid", () => {
  it("izdan kupon aktivne ponude vrijedi", () => {
    const coupon = new Coupon("1", "p1", "s1", "ABCDEFGHJK", "izdan", new Date(), "2999-12-31");
    expect(coupon.isValid()).toBe(true);
  });

  it("kupon istekle ponude ne vrijedi", () => {
    const coupon = new Coupon("1", "p1", "s1", "ABCDEFGHJK", "izdan", new Date(), "2000-01-01");
    expect(coupon.isValid()).toBe(false);
  });

  it("iskorišten kupon ne vrijedi", () => {
    const coupon = new Coupon("1", "p1", "s1", "ABCDEFGHJK", "iskoristen", new Date(), "2999-12-31");
    expect(coupon.isValid()).toBe(false);
  });
});