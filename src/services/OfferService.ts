import { checkImage } from "../domain/Image";
import { type Offer, today } from "../domain/Offer";
import type { Partner } from "@/domain/Partner";
import { deleteImage, uploadImage } from "../lib/storage";
import type { Category, CategoryRepository } from "@/repositories/CategoryRepository";
import type { OfferInput, OfferRepository } from "@/repositories/OfferRepository";
import type { PartnerRepository } from "@/repositories/PartnerRepository";

export type OfferListing = { offer: Offer; partner: Partner };

export type OfferFilter = { category?: string; city?: string };

export type OfferErrors = Partial<Record<keyof OfferInput | "photo" | "form", string>>;

export class OfferService {
  constructor(
    private readonly offers: OfferRepository,
    private readonly partners: PartnerRepository,
    private readonly categories: CategoryRepository,
  ) {}

  async getCategories(): Promise<Category[]> {
    return this.categories.findAll();
  }

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

  // undefined ako je ponuda od drugog partnera
  async getOwnOffer(ownerId: string, offerId: string): Promise<Offer | undefined> {
    const partner = await this.partners.findByOwner(ownerId);
    if (!partner) {
      return undefined;
    }
    const offer = await this.offers.findById(offerId);
    if (!offer || offer.partnerId !== partner.id) {
      return undefined;
    }
    return offer;
  }

  // F-011, prazan objekt znači da je spremljeno
  async createOffer(ownerId: string, data: OfferInput, photo: File | null): Promise<OfferErrors> {
    const partner = await this.partners.findByOwner(ownerId);
    if (!partner) {
      return { form: "Još nemaš profil partnera." };
    }
    // samo ako ga je admin odobrio (F-025)
    if (partner.approvalStatus !== "odobren") {
      return { form: "Ponude možeš dodavati tek kad administrator odobri tvoj profil." };
    }

    const errors = await this.check(data, photo);
    if (Object.keys(errors).length > 0) {
      return errors;
    }

    const id = await this.offers.create(partner.id, data);
    if (photo) {
      await this.offers.setPhoto(id, await uploadImage("offer-photos", partner.id, photo));
    }
    return {};
  }

  async updateOffer(ownerId: string, offerId: string, data: OfferInput, photo: File | null): Promise<OfferErrors> {
    const offer = await this.getOwnOffer(ownerId, offerId);
    if (!offer) {
      return { form: "Ponuda ne postoji." };
    }
    if (!offer.canBeEdited()) {
      return { form: "Istekla ponuda više se ne može uređivati." };
    }

    const errors = await this.check(data, photo);
    if (Object.keys(errors).length > 0) {
      return errors;
    }

    await this.offers.update(offerId, data);
    if (photo) {
      await this.offers.setPhoto(offerId, await uploadImage("offer-photos", offer.partnerId, photo));
      // nova fotografija je spremljena, pa stara više ne treba
      if (offer.photoUrl) {
        await deleteImage("offer-photos", offer.photoUrl);
      }
    }
    return {};
  }

  async deleteOffer(ownerId: string, offerId: string): Promise<boolean> {
    const offer = await this.getOwnOffer(ownerId, offerId);
    if (!offer) {
      return false;
    }
    await this.offers.delete(offerId);
    if (offer.photoUrl) {
      await deleteImage("offer-photos", offer.photoUrl);
    }
    return true;
  }

  private async check(data: OfferInput, photo: File | null): Promise<OfferErrors> {
    const errors: OfferErrors = {};

    if (data.title === "") {
      errors.title = "Upiši naziv ponude.";
    } else if (data.title.length > 200) {
      errors.title = "Naziv može imati najviše 200 znakova.";
    }
    if (data.description === "") {
      errors.description = "Upiši opis ponude.";
    } else if (data.description.length > 2000) {
      errors.description = "Opis može imati najviše 2000 znakova.";
    }
    if (data.conditions.length > 1000) {
      errors.conditions = "Uvjeti mogu imati najviše 1000 znakova.";
    }

    const categories = await this.categories.findAll();
    if (!categories.some((c) => c.id === data.categoryId)) {
      errors.categoryId = "Odaberi kategoriju.";
    }

    if (data.discountType !== "postotak" && data.discountType !== "iznos") {
      errors.discountType = "Odaberi vrstu popusta.";
    } else if (!Number.isFinite(data.discountValue) || data.discountValue <= 0) {
      errors.discountValue = "Popust mora biti broj veći od nule.";
    } else if (data.discountType === "postotak" && data.discountValue > 100) {
      errors.discountValue = "Postotak popusta može biti najviše 100.";
    } else if (Number(data.discountValue.toFixed(2)) !== data.discountValue) {
      errors.discountValue = "Popust može imati najviše dvije decimale.";
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(data.validUntil)) {
      errors.validUntil = "Upiši rok trajanja.";
    } else if (data.validUntil < today()) {
      errors.validUntil = "Rok trajanja ne može biti u prošlosti.";
    }

    if (data.usageLimit !== "jednom_po_studentu" && data.usageLimit !== "neograniceno") {
      errors.usageLimit = "Odaberi ograničenje korištenja.";
    }

    if (photo) {
      const photoError = checkImage(photo);
      if (photoError !== "") {
        errors.photo = photoError;
      }
    }

    return errors;
  }

  private async withPartners(offers: Offer[]): Promise<OfferListing[]> {
    const partners = await this.partners.findAll();
    return offers.flatMap((offer) => {
      const partner = partners.find((p) => p.id === offer.partnerId);
      return partner ? [{ offer, partner }] : [];
    });
  }
}
