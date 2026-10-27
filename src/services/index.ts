// Jedino mjesto gdje se biraju implementacije repozitorija.
import { SupabaseOfferRepository } from "@/repositories/supabase/SupabaseOfferRepository";
import { SupabasePartnerRepository } from "@/repositories/supabase/SupabasePartnerRepository";
import { SupabaseUserRepository } from "@/repositories/supabase/SupabaseUserRepository";
import { OfferService } from "@/services/OfferService";
import { PartnerService } from "@/services/PartnerService";
import { UserService } from "@/services/UserService";

const offerRepository = new SupabaseOfferRepository();
const partnerRepository = new SupabasePartnerRepository();

export const offerService = new OfferService(offerRepository, partnerRepository);
export const partnerService = new PartnerService(partnerRepository, offerRepository);

export const userService = new UserService(new SupabaseUserRepository());
