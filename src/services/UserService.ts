import type { User } from "@/domain/User";
import type { UserFilter, UserRepository } from "@/repositories/UserRepository";

export class UserService {
  constructor(private readonly users: UserRepository) {}

  async list(filter: UserFilter = {}): Promise<User[]> {
    return this.users.findAll(filter);
  }

  // Deaktivirani korisnik se ne može prijaviti (F-026).
  async deactivate(userId: string): Promise<void> {
    await this.users.setActive(userId, false);
  }

  async activate(userId: string): Promise<void> {
    await this.users.setActive(userId, true);
  }

  // Uređivanje i deaktivacija vlastitog računa (F-005). Ponovno ga može aktivirati samo administrator.
  async updateName(userId: string, fullName: string): Promise<void> {
    await this.users.updateName(userId, fullName);
  }

  async deactivateOwnAccount(): Promise<void> {
    await this.users.deactivateSelf();
  }

  // Uvjeti korištenja prihvaćaju se pri prvoj prijavi (F-032).
  async acceptTerms(): Promise<void> {
    await this.users.acceptTerms();
  }
}
