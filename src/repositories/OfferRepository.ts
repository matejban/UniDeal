import type { DiscountType, Offer, UsageLimit } from "@/domain/Offer";

export type OfferInput = {
  title: string;
  description: string;
  categoryId: string;
  discountType: DiscountType;
  discountValue: number;
  validUntil: string;
  conditions: string;
  usageLimit: UsageLimit;
};

export interface OfferRepository {
  // Javno vidljive ponude, neovisno o tome tko je prijavljen.
  findAll(): Promise<Offer[]>;
  findById(id: string): Promise<Offer | undefined>;
  // Sve ponude partnera koje prijavljeni korisnik smije vidjeti; vlasnik vidi i nacrte.
  findByPartner(partnerId: string): Promise<Offer[]>;
  // nova ponuda je uvijek nacrt, vraća id
  create(partnerId: string, data: OfferInput): Promise<string>;
  update(id: string, data: OfferInput): Promise<void>;
  setPhoto(id: string, photoUrl: string): Promise<void>;
  delete(id: string): Promise<void>;
}
