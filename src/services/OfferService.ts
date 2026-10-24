import type { Offer } from "@/domain/Offer";
import type { Partner } from "@/domain/Partner";
import type { OfferRepository } from "@/repositories/OfferRepository";
import type { PartnerRepository } from "@/repositories/PartnerRepository";

export type OfferListing = { offer: Offer; partner: Partner };

export type OfferFilter = { category?: string; city?: string };

export class OfferService {
  constructor(
    private readonly offers: OfferRepository,
    private readonly partners: PartnerRepository,
  ) {}

  async search(filter: OfferFilter = {}): Promise<OfferListing[]> {
    const offers = (await this.offers.findAll()).filter(
      (o) => o.isActive() && (!filter.category || o.category === filter.category),
    );
    const listings = await this.withPartners(offers);
    return listings.filter((l) => !filter.city || l.partner.city === filter.city);
  }

  async getActiveOffer(id: string): Promise<OfferListing | undefined> {
    const offer = await this.offers.findById(id);
    if (!offer?.isActive()) return undefined;
    const [listing] = await this.withPartners([offer]);
    return listing;
  }

  // Partner vidi sve svoje ponude, uključujući nacrte i istekle.
  async getPartnerOffers(partnerId: string): Promise<Offer[]> {
    return this.offers.findByPartner(partnerId);
  }

  private async withPartners(offers: Offer[]): Promise<OfferListing[]> {
    const partners = await this.partners.findAll();
    return offers.flatMap((offer) => {
      const partner = partners.find((p) => p.id === offer.partnerId);
      return partner ? [{ offer, partner }] : [];
    });
  }
}
