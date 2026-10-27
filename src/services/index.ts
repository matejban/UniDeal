// Jedino mjesto gdje se biraju implementacije repozitorija.
// Kada se poveže Supabase, ovdje se lažni repozitoriji zamjenjuju Supabase repozitorijima.
import { MockOfferRepository } from "@/repositories/mock/MockOfferRepository";
import { MockPartnerRepository } from "@/repositories/mock/MockPartnerRepository";
import { SupabaseUserRepository } from "@/repositories/supabase/SupabaseUserRepository";
import { OfferService } from "@/services/OfferService";
import { PartnerService } from "@/services/PartnerService";
import { UserService } from "@/services/UserService";

const offerRepository = new MockOfferRepository();
const partnerRepository = new MockPartnerRepository();

export const offerService = new OfferService(offerRepository, partnerRepository);
export const partnerService = new PartnerService(partnerRepository, offerRepository);

export const userService = new UserService(new SupabaseUserRepository());
