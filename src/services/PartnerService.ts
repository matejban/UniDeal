import { after } from "next/server";
import { type ApprovalDecision, Partner, type PendingPartner } from "@/domain/Partner";
import type { Category, CategoryRepository } from "@/repositories/CategoryRepository";
import type { OfferRepository } from "@/repositories/OfferRepository";
import {
  DuplicatePartnerError,
  type NewPartner,
  type PartnerProfile,
  type PartnerRepository,
} from "@/repositories/PartnerRepository";
import type { NotificationService } from "@/services/NotificationService";
import type { OfferListing } from "@/services/OfferService";

export type PartnerRegistration = Omit<NewPartner, "ownerId">;
// Poruka uz svako neispravno polje; "form" je greška koja ne pripada nijednom polju.
export type RegistrationErrors = Partial<Record<keyof PartnerRegistration | "form", string>>;
export type ProfileErrors = Partial<Record<keyof PartnerProfile | "form", string>>;

export class PartnerService {
  constructor(
    private readonly partners: PartnerRepository,
    private readonly offers: OfferRepository,
    private readonly categories: CategoryRepository,
    private readonly notifications: NotificationService,
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

  // Odobravanje i odbijanje profila partnera (F-025).
  async getPending(): Promise<PendingPartner[]> {
    return this.partners.findPending();
  }

  async approve(partnerId: string): Promise<void> {
    await this.decide(partnerId, "odobren");
  }

  async reject(partnerId: string): Promise<void> {
    await this.decide(partnerId, "odbijen");
  }

  // Spremi odluku i partneru pošalji e-mail o njoj (F-025, #14).
  private async decide(partnerId: string, decision: ApprovalDecision): Promise<void> {
    // Ime i e-mail vlasnika uzimamo s popisa na čekanju prije nego se status promijeni.
    const pending = await this.partners.findPending();
    let partner: PendingPartner | undefined;
    for (const p of pending) {
      if (p.id === partnerId) {
        partner = p;
      }
    }

    await this.partners.setApproval(partnerId, decision);

    // Demonstracijski partneri nemaju vlasnika, pa ni e-mail.
    if (partner && partner.ownerEmail) {
      const email = partner.ownerEmail;
      const name = partner.name;
      // after() šalje e-mail nakon odgovora korisniku, pa admin ne čeka slanje (C-04).
      after(async () => {
        await this.notifications.sendPartnerDecision(email, name, decision);
      });
    }
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

  // Pregled vlastitog profila koji još nije javan (F-010): vlasnik vidi kako će profil izgledati.
  // Vraća undefined ako korisnik nije vlasnik tog profila, pa ostali i dalje dobivaju 404.
  async getOwnerPreview(id: string, ownerId: string): Promise<{ partner: Partner; listings: OfferListing[] } | undefined> {
    const partner = await this.partners.findByOwner(ownerId);
    if (!partner || partner.id !== id) {
      return undefined;
    }
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

  // Uređivanje javnog profila (F-010). Vraća greške po poljima; prazan objekt znači da je profil spremljen.
  async updateProfile(partnerId: string, ownerId: string, data: PartnerProfile): Promise<ProfileErrors> {
    const errors: ProfileErrors = {};

    if (data.name === "") {
      errors.name = "Upiši naziv poslovnog subjekta.";
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
    // Radno vrijeme i opis nisu obavezni, ali opis ne smije biti predug.
    if (data.description.length > 1000) {
      errors.description = "Opis može imati najviše 1000 znakova.";
    }

    if (Object.keys(errors).length > 0) {
      return errors;
    }

    await this.partners.update(partnerId, ownerId, data);
    return {};
  }
}
