export type UserRole = "student" | "partner" | "admin";
export type StudentStatus = "potvrden" | "nepotvrden";

// Prijavljeni korisnik. `id` je Supabase Auth ID korisnika (auth.users.id);
// uloga, status studenta, aktivnost računa i prihvaćanje uvjeta dolaze iz tablice profiles.
export class User {
  constructor(
    readonly id: string,
    readonly email: string,
    readonly role: UserRole | null,
    readonly studentStatus: StudentStatus | null,
    readonly institution: string | null,
    readonly fullName: string | null = null,
    readonly isActive: boolean = true,
    readonly termsAcceptedAt: Date | null = null,
  ) {}

  // Kupone smije generirati samo potvrđeni student (F-004).
  isVerifiedStudent() {
    return this.role === "student" && this.studentStatus === "potvrden";
  }

  // Bez prihvaćenih uvjeta korištenja korisnik ne može dalje od /dobrodoslica (F-032).
  hasAcceptedTerms() {
    return this.termsAcceptedAt !== null;
  }

  isAdmin() {
    return this.role === "admin";
  }
}
