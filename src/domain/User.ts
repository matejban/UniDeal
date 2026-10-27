export type UserRole = "student" | "partner" | "admin";
export type StudentStatus = "potvrden" | "nepotvrden";

// Prijavljeni korisnik. `id` je Supabase Auth ID korisnika (auth.users.id);
// uloga, status studenta i aktivnost računa dolaze iz tablice profiles.
export class User {
  constructor(
    readonly id: string,
    readonly email: string,
    readonly role: UserRole | null,
    readonly studentStatus: StudentStatus | null,
    readonly institution: string | null,
    readonly fullName: string | null = null,
    readonly isActive: boolean = true,
  ) {}

  // Kupone smije generirati samo potvrđeni student (F-004).
  isVerifiedStudent() {
    return this.role === "student" && this.studentStatus === "potvrden";
  }

  isAdmin() {
    return this.role === "admin";
  }
}
