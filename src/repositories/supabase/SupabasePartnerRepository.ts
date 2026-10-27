import { Partner } from "@/domain/Partner";
import type { Tables } from "@/lib/supabase/database.types";
import { createClient } from "@/lib/supabase/server";
import type { PartnerRepository } from "@/repositories/PartnerRepository";

const COLUMNS = "id, name, city, address, phone, hours, description, categories(name)";

// Ugrađena kategorija je objekt, iako je netipizirani klijent vidi kao niz (vidi SupabaseOfferRepository).
type PartnerRow = Pick<Tables<"partners">, "id" | "name" | "city" | "address" | "phone" | "hours" | "description"> & {
  categories: { name: string } | null;
};

function toPartner(r: PartnerRow) {
  return new Partner(r.id, r.name, r.categories?.name ?? "", r.city, r.address, r.phone, r.hours ?? "", r.description ?? "");
}

// Klijent se stvara u svakoj metodi jer treba kolačiće trenutačnog zahtjeva.
// Javni popis čita se iz pogleda public_partners, pa vlasnik ni administrator u njemu ne vide neodobrene partnere.
export class SupabasePartnerRepository implements PartnerRepository {
  async findAll() {
    const supabase = await createClient();
    const { data, error } = await supabase.from("public_partners").select(COLUMNS).order("name");
    if (error) throw new Error(`Učitavanje partnera nije uspjelo: ${error.message}`);
    return (data as unknown as PartnerRow[]).map(toPartner);
  }

  async findById(id: string) {
    const supabase = await createClient();
    const { data, error } = await supabase.from("public_partners").select(COLUMNS).eq("id", id).maybeSingle();
    // 22P02: id nije ispravan UUID, pa takav partner ne postoji.
    if (error?.code === "22P02") return undefined;
    if (error) throw new Error(`Učitavanje partnera nije uspjelo: ${error.message}`);
    return data ? toPartner(data as unknown as PartnerRow) : undefined;
  }

  async findByOwner(ownerId: string) {
    const supabase = await createClient();
    const { data, error } = await supabase.from("partners").select(COLUMNS).eq("owner_id", ownerId).maybeSingle();
    if (error) throw new Error(`Učitavanje profila partnera nije uspjelo: ${error.message}`);
    return data ? toPartner(data as unknown as PartnerRow) : undefined;
  }
}
