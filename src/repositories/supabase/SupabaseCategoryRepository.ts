import { createClient } from "@/lib/supabase/server";
import {
  CategoryInUseError,
  type CategoryRepository,
  DuplicateCategoryError,
} from "@/repositories/CategoryRepository";

// Kategorije čitaju svi; uređuje ih administrator (F-027).
export class SupabaseCategoryRepository implements CategoryRepository {
  async findAll() {
    const supabase = await createClient();
    const { data, error } = await supabase.from("categories").select("id, name").order("name");
    if (error) throw new Error(`Učitavanje kategorija nije uspjelo: ${error.message}`);
    return data;
  }

  async findAllWithUsage() {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("categories")
      .select("id, name, offers(count), partners(count)")
      .order("name");
    if (error) throw new Error(`Učitavanje kategorija nije uspjelo: ${error.message}`);
    return data.map((c) => ({
      id: c.id,
      name: c.name,
      offerCount: c.offers[0]?.count ?? 0,
      partnerCount: c.partners[0]?.count ?? 0,
    }));
  }

  async create(name: string) {
    const supabase = await createClient();
    const { data, error } = await supabase.from("categories").insert({ name }).select("id, name").single();
    // 23505: naziv već postoji.
    if (error?.code === "23505") throw new DuplicateCategoryError();
    if (error) throw new Error(`Spremanje kategorije nije uspjelo: ${error.message}`);
    return data;
  }

  async rename(id: string, name: string) {
    const supabase = await createClient();
    const { data, error } = await supabase.from("categories").update({ name }).eq("id", id).select("id");
    if (error?.code === "23505") throw new DuplicateCategoryError();
    if (error) throw new Error(`Preimenovanje kategorije nije uspjelo: ${error.message}`);
    // RLS ne javlja grešku kad red nije promijenjen, nego samo ne vrati ništa.
    if (data.length === 0) throw new Error("Preimenovanje kategorije nije uspjelo: kategorija nije promijenjena");
  }

  async delete(id: string) {
    const supabase = await createClient();
    const { data, error } = await supabase.from("categories").delete().eq("id", id).select("id");
    // 23503: kategoriju još koristi neka ponuda ili partner.
    if (error?.code === "23503") throw new CategoryInUseError();
    if (error) throw new Error(`Brisanje kategorije nije uspjelo: ${error.message}`);
    if (data.length === 0) throw new Error("Brisanje kategorije nije uspjelo: kategorija nije obrisana");
  }
}
