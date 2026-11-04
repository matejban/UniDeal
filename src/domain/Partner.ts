import { isValidOib } from "@/domain/oib";

export type ApprovalStatus = "na_cekanju" | "odobren" | "odbijen";

export class Partner {
  constructor(
    readonly id: string,
    readonly name: string,
    readonly category: string,
    readonly city: string,
    readonly address: string,
    readonly phone: string,
    readonly hours: string,
    readonly description: string,
    readonly oib: string,
    readonly approvalStatus: ApprovalStatus,
    // Prazno samo za demonstracijske partnere bez korisničkog računa.
    readonly ownerId: string | null,
  ) {}

  static isValidOib(oib: string) {
    return isValidOib(oib);
  }

  // Novi profil čeka da ga administrator odobri (F-006, #37).
  isPending() {
    return this.approvalStatus === "na_cekanju";
  }
}
