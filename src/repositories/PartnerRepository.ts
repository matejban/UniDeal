import type { Partner } from "@/domain/Partner";

export interface PartnerRepository {
  findAll(): Promise<Partner[]>;
  findById(id: string): Promise<Partner | undefined>;
}
