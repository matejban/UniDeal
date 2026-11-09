import { Offer, type DiscountType, type OfferStatus, type UsageLimit } from "@/domain/Offer";
import type { Tables } from "@/lib/supabase/database.types";
import { createClient } from "@/lib/supabase/server";
import type { OfferInput, OfferRepository } from "@/repositories/OfferRepository";


const COLUMNS =
  "id, partner_id, title, description, discount_type, discount_value, valid_until, conditions, status, usage_limit, category_id, photo_url, categories(name)";

// Netipizirani klijent ugrađenu kategoriju (veza više-prema-jedan) vidi kao niz, a PostgREST vraća objekt,
// pa se redovi pretvaraju u ovaj tip.
type OfferRow = Pick<
  Tables<"offers">,
  | "id"
  | "partner_id"
  | "title"
  | "description"
  | "discount_type"
  | "discount_value"
  | "valid_until"
  | "conditions"
  | "status"
  | "usage_limit"
  | "category_id"
  | "photo_url"
> & { categories: { name: string } | null };

function toRow(data: OfferInput) {
  return {
    title: data.title,
    description: data.description,
    category_id: data.categoryId,
    discount_type: data.discountType,
    discount_value: data.discountValue,
    valid_until: data.validUntil,
    conditions: data.conditions === "" ? null : data.conditions,
    usage_limit: data.usageLimit,
  };
}

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
    r.usage_limit as UsageLimit,
    r.category_id,
    r.photo_url,
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

  async create(partnerId: string, data: OfferInput) {
    const supabase = await createClient();
    const { data: row, error } = await supabase
      .from("offers")
      .insert({ ...toRow(data), partner_id: partnerId })
      .select("id")
      .single();
    if (error) throw new Error(`Spremanje ponude nije uspjelo: ${error.message}`);
    return row.id;
  }

  async update(id: string, data: OfferInput) {
    const supabase = await createClient();
    const { data: rows, error } = await supabase.from("offers").update(toRow(data)).eq("id", id).select("id");
    if (error) throw new Error(`Spremanje ponude nije uspjelo: ${error.message}`);
    // RLS ne javlja grešku kad red nije promijenjen, nego samo ne vrati ništa.
    if (rows.length === 0) throw new Error("Spremanje ponude nije uspjelo: ponuda nije promijenjena");
  }

  async setPhoto(id: string, photoUrl: string) {
    const supabase = await createClient();
    const { data: rows, error } = await supabase.from("offers").update({ photo_url: photoUrl }).eq("id", id).select("id");
    if (error) throw new Error(`Spremanje fotografije nije uspjelo: ${error.message}`);
    if (rows.length === 0) throw new Error("Spremanje fotografije nije uspjelo: ponuda nije promijenjena");
  }

  async delete(id: string) {
    const supabase = await createClient();
    const { data: rows, error } = await supabase.from("offers").delete().eq("id", id).select("id");
    if (error) throw new Error(`Brisanje ponude nije uspjelo: ${error.message}`);
    if (rows.length === 0) throw new Error("Brisanje ponude nije uspjelo: ponuda nije obrisana");
  }
}
