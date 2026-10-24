import type { Offer } from "@/domain/Offer";

export interface OfferRepository {
  findAll(): Promise<Offer[]>;
  findById(id: string): Promise<Offer | undefined>;
  findByPartner(partnerId: string): Promise<Offer[]>;
}
