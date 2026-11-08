import { Coupon, type CouponStatus } from "@/domain/Coupon";
import { createClient } from "@/lib/supabase/server";
import type { CouponRepository } from "@/repositories/CouponRepository";

// stupci kupona + rok ponude iz tablice offers
const COLUMNS = "id, offer_id, student_id, code, status, issued_at, offers(valid_until)";

// kako izgleda jedan red koji vrati baza
type CouponRow = {
  id: string;
  offer_id: string;
  student_id: string;
  code: string;
  status: string;
  issued_at: string;
  offers: { valid_until: string } | null;
};

// red iz baze -> objekt Coupon
function toCoupon(row: CouponRow): Coupon {
  return new Coupon(
    row.id,
    row.offer_id,
    row.student_id,
    row.code,
    row.status as CouponStatus,
    new Date(row.issued_at),
    row.offers?.valid_until ?? "",
  );
}

export class SupabaseCouponRepository implements CouponRepository {
  async create(offerId: string, studentId: string, code: string): Promise<Coupon | null> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("coupons")
      .insert({ offer_id: offerId, student_id: studentId, code: code })
      .select(COLUMNS)
      .single();

    // 23505 = taj kod već postoji u bazi
    if (error?.code === "23505") return null;
    if (error) throw new Error(`Spremanje kupona nije uspjelo: ${error.message}`);
    return toCoupon(data as unknown as CouponRow);
  }

  async findById(id: string): Promise<Coupon | undefined> {
    const supabase = await createClient();
    const { data, error } = await supabase.from("coupons").select(COLUMNS).eq("id", id).maybeSingle();

    // 22P02 = id nije ispravan UUID, pa takav kupon ne postoji
    if (error?.code === "22P02") return undefined;
    if (error) throw new Error(`Učitavanje kupona nije uspjelo: ${error.message}`);
    if (!data) return undefined;
    return toCoupon(data as unknown as CouponRow);
  }

  async findByStudentAndOffer(studentId: string, offerId: string): Promise<Coupon[]> {
    const supabase = await createClient();
    const { data, error } = await supabase.from("coupons").select(COLUMNS).eq("student_id", studentId).eq("offer_id", offerId);

    if (error) throw new Error(`Učitavanje kupona nije uspjelo: ${error.message}`);
    const rows = data as unknown as CouponRow[];
    return rows.map(toCoupon);
    
  }
}