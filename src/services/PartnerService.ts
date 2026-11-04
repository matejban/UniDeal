import { Partner } from "@/domain/Partner";
import type { Category, CategoryRepository } from "@/repositories/CategoryRepository";
import type { OfferRepository } from "@/repositories/OfferRepository";
import { DuplicatePartnerError, type NewPartner, type PartnerRepository } from "@/repositories/PartnerRepository";
import type { OfferListing } from "@/services/OfferService";

export type PartnerRegistration = Omit<NewPartner, "ownerId">;
// Poruka uz svako neispravno polje; "form" je greška koja ne pripada nijednom polju.
export type RegistrationErrors = Partial<Record<keyof PartnerRegistration | "form", string>>;

export class PartnerService {
  constructor(
    private readonly partners: PartnerRepository,
    private readonly offers: OfferRepository,
    private readonly categories: CategoryRepository,
  ) {}

  async getAll(): Promise<Partner[]> {
    return this.partners.findAll();
  }

  async getByOwner(ownerId: string): Promise<Partner | undefined> {
    return this.partners.findByOwner(ownerId);
  }

  async getCategories(): Promise<Category[]> {
    return this.categories.findAll();
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

  // Registracija partnera (F-006). Bez grešaka vraća prazan objekt, a profil čeka odobrenje administratora.
  async register(ownerId: string, data: PartnerRegistration): Promise<RegistrationErrors> {
    const errors: RegistrationErrors = {};
    if (!data.name) errors.name = "Upiši naziv poslovnog subjekta.";
    if (!data.oib) errors.oib = "Upiši OIB.";
    else if (!Partner.isValidOib(data.oib)) errors.oib = "OIB mora imati 11 znamenki i ispravnu kontrolnu znamenku.";
    if (!data.address) errors.address = "Upiši adresu.";
    if (!data.city) errors.city = "Upiši grad.";
    if (!data.phone) errors.phone = "Upiši kontakt telefon.";
    const categories = await this.categories.findAll();
    if (!categories.some((c) => c.id === data.categoryId)) errors.categoryId = "Odaberi kategoriju djelatnosti.";
    if (Object.keys(errors).length > 0) return errors;

    try {
      await this.partners.create({ ownerId, ...data });
    } catch (e) {
      if (!(e instanceof DuplicatePartnerError)) throw e;
      if (e.field === "oib") return { oib: "Partner s tim OIB-om već je registriran." };
      return { form: "Već imaš profil partnera." };
    }
    return {};
  }
}
