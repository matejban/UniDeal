export type OfferStatus = "nacrt" | "aktivna" | "istekla";
export type DiscountType = "postotak" | "iznos";

export const OFFER_CATEGORIES = ["Hrana", "Zdravlje i sport", "Obrazovanje", "Zabava"];

export class Offer {
  constructor(
    readonly id: string,
    readonly partnerId: string,
    readonly title: string,
    readonly description: string,
    readonly category: string,
    readonly discountType: DiscountType,
    readonly discountValue: number,
    readonly validUntil: string,
    readonly conditions: string,
    readonly status: OfferStatus,
  ) {}

  // Studentima se prikazuju samo aktivne ponude kojima rok nije prošao (F-012).
  isActive() {
    return this.status === "aktivna" && this.validUntil >= new Date().toISOString().slice(0, 10);
  }

  get discountLabel() {
    const value = this.discountValue.toLocaleString("hr-HR");
    return this.discountType === "postotak" ? `−${value} %` : `−${value} €`;
  }
}
