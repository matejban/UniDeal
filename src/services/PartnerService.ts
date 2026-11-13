import { after } from "next/server";
import { checkImage } from "../domain/Image";
import { type ApprovalDecision, Partner, type PendingPartner } from "../domain/Partner";
import { centerOf, isInCroatia, type LatLng } from "../lib/geo";
import { deleteImage, uploadImage } from "../lib/storage";
import type { Category, CategoryRepository } from "@/repositories/CategoryRepository";
import type { OfferRepository } from "@/repositories/OfferRepository";
import {
  DuplicatePartnerError,
  type NewPartner,
  type PartnerProfile,
  type PartnerRepository,
} from "../repositories/PartnerRepository";
import type { Geocoder } from "@/services/Geocoder";
import type { NotificationService } from "@/services/NotificationService";
import type { OfferListing } from "@/services/OfferService";

// Koordinate ne unosi partner, nego ih računa geokodiranje (F-013).
export type PartnerRegistration = Omit<NewPartner, "ownerId" | "lat" | "lng">;
// Poruka uz svako neispravno polje; "form" je greška koja ne pripada nijednom polju.
export type RegistrationErrors = Partial<Record<keyof PartnerRegistration | "form", string>>;
export type ProfileErrors = Partial<Record<keyof PartnerProfile | "form", string>>;

export type MapPartner = LatLng & { id: string; name: string; category: string; address: string; city: string };
export type MapCity = LatLng & { name: string };

export class PartnerService {
  constructor(
    private readonly partners: PartnerRepository,
    private readonly offers: OfferRepository,
    private readonly categories: CategoryRepository,
    private readonly notifications: NotificationService,
    private readonly geocoder: Geocoder,
  ) {}

  // Koordinate adrese (F-013). Greška geokodiranja (npr. krivi ključ) ne smije spriječiti spremanje profila,
  // pa se zapiše u log, a partner lokaciju može označiti ručno.
  private async locate(address: string, city: string): Promise<LatLng | null> {
    try {
      return await this.geocoder.geocode(address, city);
    } catch (e) {
      console.error("Geokodiranje adrese nije uspjelo:", e);
      return null;
    }
  }

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

  // Podaci za kartu partnera (F-018): javni partneri s koordinatama i središte svakog grada.
  // Obični objekti, jer ih stranica predaje klijentskoj komponenti karte.
  async getMapData(): Promise<{ partners: MapPartner[]; cities: MapCity[] }> {
    const partners: MapPartner[] = [];
    for (const p of await this.partners.findAll()) {
      if (p.lat !== null && p.lng !== null) {
        partners.push({ id: p.id, name: p.name, category: p.category, address: p.address, city: p.city, lat: p.lat, lng: p.lng });
      }
    }

    const cities: MapCity[] = [];
    for (const name of [...new Set(partners.map((p) => p.city))].sort()) {
      const center = centerOf(partners.filter((p) => p.city === name));
      if (center) {
        cities.push({ name, ...center });
      }
    }
    return { partners, cities };
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

    // Nepronađena adresa ne sprječava registraciju; partner lokaciju označava na profilu (F-013).
    const location = await this.locate(data.address, data.city);

    try {
      await this.partners.create({
        ownerId: ownerId,
        name: data.name,
        oib: data.oib,
        categoryId: data.categoryId,
        address: data.address,
        city: data.city,
        phone: data.phone,
        lat: location?.lat ?? null,
        lng: location?.lng ?? null,
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

    const before = await this.partners.findByOwner(ownerId);
    await this.partners.update(partnerId, ownerId, data);

    // Geokodira se samo nova adresa ili profil koji još nema lokaciju (F-013). Ako nova adresa nije
    // pronađena, stara se lokacija briše, jer bi oznaka na karti inače bila na staroj adresi.
    const addressChanged = !before || before.address !== data.address || before.city !== data.city;
    const hasLocation = before !== undefined && before.lat !== null && before.lng !== null;
    if (addressChanged || !hasLocation) {
      await this.partners.setLocation(partnerId, ownerId, await this.locate(data.address, data.city));
    }
    return {};
  }

  // Ručno označena lokacija (F-013), kad geokodiranje ne pronađe adresu. Vraća poruku o grešci
  // ili prazan tekst ako je lokacija spremljena.
  async setLocation(partnerId: string, ownerId: string, location: LatLng): Promise<string> {
    if (!isInCroatia(location)) {
      return "Označi lokaciju u Hrvatskoj.";
    }
    await this.partners.setLocation(partnerId, ownerId, location);
    return "";
  }

  // Novi logo partnera (#13). Vraća poruku o grešci ili prazan tekst ako je logo spremljen.
  async updateLogo(partnerId: string, ownerId: string, file: File): Promise<string> {
    const error = checkImage(file);
    if (error !== "") {
      return error;
    }
    const oldLogoUrl = (await this.partners.findByOwner(ownerId))?.logoUrl ?? null;
    const logoUrl = await uploadImage("partner-logos", partnerId, file);
    await this.partners.setLogo(partnerId, ownerId, logoUrl);
    // novi logo je spremljen, pa stari više ne treba
    if (oldLogoUrl) {
      await deleteImage("partner-logos", oldLogoUrl);
    }
    return "";
  }
}
