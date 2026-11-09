// Jedino mjesto gdje se biraju implementacije repozitorija.
import { SupabaseCategoryRepository } from "@/repositories/supabase/SupabaseCategoryRepository";
import { SupabaseOfferRepository } from "@/repositories/supabase/SupabaseOfferRepository";
import { SupabasePartnerRepository } from "@/repositories/supabase/SupabasePartnerRepository";
import { SupabaseStatisticsRepository } from "@/repositories/supabase/SupabaseStatisticsRepository";
import { SupabaseUserRepository } from "@/repositories/supabase/SupabaseUserRepository";
import { CategoryService } from "@/services/CategoryService";
import { OfferService } from "@/services/OfferService";
import { PartnerService } from "@/services/PartnerService";
import { StatisticsService } from "@/services/StatisticsService";
import { UserService } from "@/services/UserService";
import { SupabaseCouponRepository } from "@/repositories/supabase/SupabaseCouponRepository";
import { CouponService } from "@/services/CouponService";
import {
  ConsoleNotificationService,
  ResendNotificationService,
  type NotificationService,
} from "@/services/NotificationService";

const offerRepository = new SupabaseOfferRepository();
const partnerRepository = new SupabasePartnerRepository();
const categoryRepository = new SupabaseCategoryRepository();

// E-mail ide preko Resenda kad postoji ključ; bez njega (lokalni razvoj) ispisuje se u konzolu (#14).
let notificationService: NotificationService;
if (process.env.RESEND_API_KEY) {
  notificationService = new ResendNotificationService(process.env.RESEND_API_KEY);
} else {
  notificationService = new ConsoleNotificationService();
}
export { notificationService };

export const offerService = new OfferService(offerRepository, partnerRepository, categoryRepository);
export const partnerService = new PartnerService(
  partnerRepository,
  offerRepository,
  categoryRepository,
  notificationService,
);

export const categoryService = new CategoryService(categoryRepository);

export const userService = new UserService(new SupabaseUserRepository());

export const couponService = new CouponService(new SupabaseCouponRepository(), offerRepository);

export const statisticsService = new StatisticsService(new SupabaseStatisticsRepository());
