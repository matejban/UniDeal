import { createClient } from "@/lib/supabase/server";
import type { CategoryRepository } from "@/repositories/CategoryRepository";

// Kategorije čitaju svi; uređuje ih administrator (F-027).
export class SupabaseCategoryRepository implements CategoryRepository {
  async findAll() {
    const supabase = await createClient();
    const { data, error } = await supabase.from("categories").select("id, name").order("name");
    if (error) throw new Error(`Učitavanje kategorija nije uspjelo: ${error.message}`);
    return data;
  }
}
