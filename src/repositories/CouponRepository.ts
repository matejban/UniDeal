import type { Coupon } from "@/domain/Coupon";

export interface CouponRepository {
  // sprema novi kupon; vraća null ako taj kod već postoji
  create(offerId: string, studentId: string, code: string): Promise<Coupon | null>;
  findById(id: string): Promise<Coupon | undefined>;
  // svi kuponi jednog studenta za jednu ponudu (F-021)
  findByStudentAndOffer(studentId: string, offerId: string): Promise<Coupon[]>;
}