import type { Offer } from "@/domain/Offer";

export interface OfferRepository {
  // Javno vidljive ponude, neovisno o tome tko je prijavljen.
  findAll(): Promise<Offer[]>;
  findById(id: string): Promise<Offer | undefined>;
  // Sve ponude partnera koje prijavljeni korisnik smije vidjeti; vlasnik vidi i nacrte.
  findByPartner(partnerId: string): Promise<Offer[]>;
}
