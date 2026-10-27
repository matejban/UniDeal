import type { User, UserRole } from "@/domain/User";

export type UserFilter = { email?: string; role?: UserRole };

export interface UserRepository {
  findAll(filter?: UserFilter): Promise<User[]>;
  setActive(id: string, active: boolean): Promise<void>;
  updateName(id: string, fullName: string): Promise<void>;
  // Deaktivira račun prijavljenog korisnika.
  deactivateSelf(): Promise<void>;
  // Bilježi da je prijavljeni korisnik prihvatio uvjete korištenja.
  acceptTerms(): Promise<void>;
}
