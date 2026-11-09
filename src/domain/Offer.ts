export type OfferStatus = "nacrt" | "aktivna" | "istekla";
export type DiscountType = "postotak" | "iznos";
export type UsageLimit = "jednom_po_studentu" | "neograniceno";

export const OFFER_CATEGORIES = ["Hrana", "Zdravlje i sport", "Obrazovanje", "Zabava"];

export function today(): string {
  return new Date().toISOString().slice(0, 10);
}

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
    readonly usageLimit: UsageLimit,
    readonly categoryId: string,
    readonly photoUrl: string | null,
  ) {}

  // Studentima se prikazuju samo aktivne ponude kojima rok nije prošao (F-012).
  isActive() {
    return this.status === "aktivna" && this.validUntil >= today();
  }
  // ponuda se smije iskoristiti samo jednom po studentu (F-021)
  isOncePerStudent(): boolean {
    return this.usageLimit === "jednom_po_studentu";
  }

  // za objavu sve mora biti popunjeno i rok ne smije biti prošao (F-011)
  canBeActivated(now: string = today()): boolean {
    return (
      this.title.trim() !== "" &&
      this.description.trim() !== "" &&
      this.categoryId !== "" &&
      this.discountValue > 0 &&
      this.validUntil >= now
    );
  }

  canBeEdited(): boolean {
    return this.status !== "istekla";
  }

  // npr. −20 % ili −5,00 € (NF-11)
  get discountLabel() {
    if (this.discountType === "postotak") {
      return `−${this.discountValue.toLocaleString("hr-HR")} %`;
    }
    const value = this.discountValue.toLocaleString("hr-HR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    return `−${value} €`;
  }
}
