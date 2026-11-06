import { generateCouponCode, type Coupon } from "@/domain/Coupon";
import type { User } from "@/domain/User";
import type { CouponRepository } from "@/repositories/CouponRepository";
import type { OfferRepository } from "@/repositories/OfferRepository";

// rezultat generiranja: kupon ili razlog zašto ga nema
export type IssueResult =
  | { ok: true; coupon: Coupon }
  | { ok: false; reason: "nepotvrden" | "ponuda" };

export class CouponService {
  constructor(
    private readonly coupons: CouponRepository,
    private readonly offers: OfferRepository,
  ) {}

  // generiranje kupona (F-020, F-004)
  async issue(user: User, offerId: string): Promise<IssueResult> {
    // samo potvrđeni student
    if (!user.isVerifiedStudent()) {
      return { ok: false, reason: "nepotvrden" };
    }

    // ponuda mora postojati i biti aktivna
    const offer = await this.offers.findById(offerId);
    if (!offer || !offer.isActive()) {
      return { ok: false, reason: "ponuda" };
    }

    // TODO #29: jednom po studentu

    // ako se kod slučajno ponovi, probaj s novim (najviše 3 puta)
    for (let i = 0; i < 3; i++) {
      const coupon = await this.coupons.create(offerId, user.id, generateCouponCode());
      if (coupon) {
        return { ok: true, coupon: coupon };
      }
    }
    throw new Error("Generiranje jedinstvenog koda nije uspjelo.");
  }

  async getCoupon(id: string): Promise<Coupon | undefined> {
    return this.coupons.findById(id);
  }
}