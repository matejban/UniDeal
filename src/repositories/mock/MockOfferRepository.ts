import { Offer } from "@/domain/Offer";
import { offers } from "@/lib/mock-data";
import type { OfferRepository } from "@/repositories/OfferRepository";

export class MockOfferRepository implements OfferRepository {
  private readonly offers = offers.map(
    (o) =>
      new Offer(o.id, o.partnerId, o.title, o.description, o.category, o.discount, o.validUntil, o.conditions, o.status),
  );

  async findAll() {
    return this.offers;
  }

  async findById(id: string) {
    return this.offers.find((o) => o.id === id);
  }

  async findByPartner(partnerId: string) {
    return this.offers.filter((o) => o.partnerId === partnerId);
  }
}
