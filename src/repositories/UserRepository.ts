import type { User, UserRole } from "@/domain/User";

export type UserFilter = { email?: string; role?: UserRole };

export interface UserRepository {
  findAll(filter?: UserFilter): Promise<User[]>;
  setActive(id: string, active: boolean): Promise<void>;
}
