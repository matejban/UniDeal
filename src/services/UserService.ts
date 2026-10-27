import type { User } from "@/domain/User";
import type { UserFilter, UserRepository } from "@/repositories/UserRepository";

export class UserService {
  constructor(private readonly users: UserRepository) {}

  async list(filter: UserFilter = {}): Promise<User[]> {
    return this.users.findAll(filter);
  }

  // Deaktivirani korisnik se ne može prijaviti (F-026). Istu metodu može koristiti i deaktivacija vlastitog računa (F-005).
  async deactivate(userId: string): Promise<void> {
    await this.users.setActive(userId, false);
  }

  async activate(userId: string): Promise<void> {
    await this.users.setActive(userId, true);
  }
}
