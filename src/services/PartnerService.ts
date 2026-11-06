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

  // Registracija partnera (F-006). Vraća greške po poljima; prazan objekt znači da je profil spremljen
  // i da čeka odobrenje administratora.
  async register(ownerId: string, data: PartnerRegistration): Promise<RegistrationErrors> {
    const errors: RegistrationErrors = {};

    if (data.name === "") {
      errors.name = "Upiši naziv poslovnog subjekta.";
    }
    if (data.oib === "") {
      errors.oib = "Upiši OIB.";
    } else if (!Partner.isValidOib(data.oib)) {
      errors.oib = "OIB mora imati 11 znamenki i ispravnu kontrolnu znamenku.";
    }
    if (data.address === "") {
      errors.address = "Upiši adresu.";
    }
    if (data.city === "") {
      errors.city = "Upiši grad.";
    }
    if (data.phone === "") {
      errors.phone = "Upiši kontakt telefon.";
    }

    // Kategorija mora postojati u bazi.
    const categories = await this.categories.findAll();
    let categoryExists = false;
    for (const category of categories) {
      if (category.id === data.categoryId) {
        categoryExists = true;
      }
    }
    if (!categoryExists) {
      errors.categoryId = "Odaberi kategoriju djelatnosti.";
    }

    if (Object.keys(errors).length > 0) {
      return errors;
    }

    try {
      await this.partners.create({
        ownerId: ownerId,
        name: data.name,
        oib: data.oib,
        categoryId: data.categoryId,
        address: data.address,
        city: data.city,
        phone: data.phone,
      });
    } catch (e) {
      // Baza javlja da OIB ili vlasnik već postoje; ostale greške idu dalje.
      if (e instanceof DuplicatePartnerError) {
        if (e.field === "oib") {
          return { oib: "Partner s tim OIB-om već je registriran." };
        }
        return { form: "Već imaš profil partnera." };
      }
      throw e;
    }

    return {};
  }
}
