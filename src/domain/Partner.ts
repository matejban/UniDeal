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
    readonly oib: string,
    // Prazno samo za demonstracijske partnere bez korisničkog računa.
    readonly ownerId: string | null,
  ) {}

  // Provjera OIB-a (F-006): 11 znamenki, a zadnja je kontrolna po ISO 7064 MOD 11,10.
  static isValidOib(oib: string): boolean {
    if (!/^[0-9]{11}$/.test(oib)) {
      return false;
    }

    let a = 10;
    for (let i = 0; i < 10; i++) {
      a = (a + Number(oib[i])) % 10;
      if (a === 0) {
        a = 10;
      }
      a = (a * 2) % 11;
    }

    let kontrolna = 11 - a;
    if (kontrolna === 10) {
      kontrolna = 0;
    }
    return kontrolna === Number(oib[10]);
  }
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
