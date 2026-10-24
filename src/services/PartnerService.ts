import type { Partner } from "@/domain/Partner";
import type { OfferRepository } from "@/repositories/OfferRepository";
import type { PartnerRepository } from "@/repositories/PartnerRepository";
import type { OfferListing } from "@/services/OfferService";

export class PartnerService {
  constructor(
    private readonly partners: PartnerRepository,
    private readonly offers: OfferRepository,
  ) {}

  async getAll(): Promise<Partner[]> {
    return this.partners.findAll();
  }

  async getCities(): Promise<string[]> {
    return [...new Set((await this.partners.findAll()).map((p) => p.city))];
  }

  async getProfile(id: string): Promise<{ partner: Partner; listings: OfferListing[] } | undefined> {
    const partner = await this.partners.findById(id);
    if (!partner) return undefined;
    const offers = (await this.offers.findByPartner(id)).filter((o) => o.isActive());
    return { partner, listings: offers.map((offer) => ({ offer, partner })) };
  }
}
