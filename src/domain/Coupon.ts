export type CouponStatus = "izdan" | "iskoristen" | "istekao";

// znakovi za kod, bez 0, O, 1 i I da se ne pobrkaju
const CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

// nasumični kod od 10 znakova (NF-07)
export function generateCouponCode(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(10));
  let code = "";
  for (let i = 0; i < bytes.length; i++) {
    code += CODE_CHARS[bytes[i] % CODE_CHARS.length];
  }
  return code;
}

export class Coupon {
  constructor(
    readonly id: string,
    readonly offerId: string,
    readonly studentId: string,
    readonly code: string,
    readonly status: CouponStatus,
    readonly issuedAt: Date,
    readonly validUntil: string,
  ) {}

  // kupon vrijedi ako je izdan i ponuda još nije istekla
  isValid(): boolean {
    const today = new Date().toISOString().slice(0, 10);
    return this.status === "izdan" && this.validUntil >= today;
  }
}