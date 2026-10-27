import type { Partner } from "@/domain/Partner";

export interface PartnerRepository {
  // Javno vidljivi partneri: odobreni, s aktivnom pretplatom (F-007).
  findAll(): Promise<Partner[]>;
  findById(id: string): Promise<Partner | undefined>;
  // Profil partnera prijavljenog korisnika, i dok još nije javan.
  findByOwner(ownerId: string): Promise<Partner | undefined>;
}
