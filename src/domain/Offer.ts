export type OfferStatus = "nacrt" | "aktivna" | "istekla";

export const OFFER_CATEGORIES = ["Hrana", "Zdravlje i sport", "Obrazovanje", "Zabava"];

export class Offer {
  constructor(
    readonly id: string,
    readonly partnerId: string,
    readonly title: string,
    readonly description: string,
    readonly category: string,
    readonly discount: string,
    readonly validUntil: string,
    readonly conditions: string,
    readonly status: OfferStatus,
  ) {}

  // Studentima se prikazuju samo aktivne ponude; nacrti i istekle ponude ostaju skrivene.
  isActive() {
    return this.status === "aktivna";
  }

  get discountLabel() {
    return `−${this.discount}`;
  }
}
