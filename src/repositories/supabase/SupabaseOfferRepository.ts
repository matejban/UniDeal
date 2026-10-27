import { Offer, type DiscountType, type OfferStatus } from "@/domain/Offer";
import type { Tables } from "@/lib/supabase/database.types";
import { createClient } from "@/lib/supabase/server";
import type { OfferRepository } from "@/repositories/OfferRepository";

const COLUMNS = "id, partner_id, title, description, discount_type, discount_value, valid_until, conditions, status, categories(name)";

// Netipizirani klijent ugrađenu kategoriju (veza više-prema-jedan) vidi kao niz, a PostgREST vraća objekt,
// pa se redovi pretvaraju u ovaj tip.
type OfferRow = Pick<
  Tables<"offers">,
  "id" | "partner_id" | "title" | "description" | "discount_type" | "discount_value" | "valid_until" | "conditions" | "status"
> & { categories: { name: string } | null };

function toOffer(r: OfferRow) {
  return new Offer(
    r.id,
    r.partner_id,
    r.title,
    r.description,
    r.categories?.name ?? "",
    r.discount_type as DiscountType,
    r.discount_value,
    r.valid_until,
    r.conditions ?? "",
    r.status as OfferStatus,
  );
}

// Klijent se stvara u svakoj metodi jer treba kolačiće trenutačnog zahtjeva. Što tko vidi određuje RLS.
export class SupabaseOfferRepository implements OfferRepository {
  async findAll() {
    const supabase = await createClient();
    const { data, error } = await supabase.from("public_offers").select(COLUMNS).order("created_at", { ascending: false });
    if (error) throw new Error(`Učitavanje ponuda nije uspjelo: ${error.message}`);
    return (data as unknown as OfferRow[]).map(toOffer);
  }

  async findById(id: string) {
    const supabase = await createClient();
    const { data, error } = await supabase.from("offers").select(COLUMNS).eq("id", id).maybeSingle();
    // 22P02: id nije ispravan UUID, pa takva ponuda ne postoji.
    if (error?.code === "22P02") return undefined;
    if (error) throw new Error(`Učitavanje ponude nije uspjelo: ${error.message}`);
    return data ? toOffer(data as unknown as OfferRow) : undefined;
  }

  async findByPartner(partnerId: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("offers")
      .select(COLUMNS)
      .eq("partner_id", partnerId)
      .order("created_at", { ascending: false });
    if (error?.code === "22P02") return [];
    if (error) throw new Error(`Učitavanje ponuda partnera nije uspjelo: ${error.message}`);
    return (data as unknown as OfferRow[]).map(toOffer);
  }
}
