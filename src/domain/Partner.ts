export type ApprovalStatus = "na_cekanju" | "odobren" | "odbijen";
export type ApprovalDecision = Exclude<ApprovalStatus, "na_cekanju">;

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
    readonly approvalStatus: ApprovalStatus,
  ) {}
}

// Profil partnera koji čeka odluku administratora (F-025). OIB i e-mail vlasnika
// vidi samo administrator; e-mail je prazan za demonstracijske partnere bez računa.
export class PendingPartner {
  constructor(
    readonly id: string,
    readonly name: string,
    readonly oib: string,
    readonly category: string,
    readonly city: string,
    readonly address: string,
    readonly phone: string,
    readonly ownerEmail: string | null,
    readonly createdAt: Date,
  ) {}
}
