import { type ApprovalDecision, Partner, PendingPartner } from "@/domain/Partner";
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

// Vlasnik se dohvaća preko imenovanog stranog ključa jer partners i profiles povezuju i druge tablice (npr. favorites).
const PENDING_COLUMNS =
  "id, name, oib, city, address, phone, created_at, categories(name), profiles!partners_owner_id_fkey(email)";

type PendingRow = Pick<Tables<"partners">, "id" | "name" | "oib" | "city" | "address" | "phone" | "created_at"> & {
  categories: { name: string } | null;
  profiles: { email: string | null } | null;
};

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

  // Čita tablicu partners, a ne pogled public_partners, koji ne vraća neodobrene partnere.
  // RLS neodobrene partnere vraća samo administratoru (i vlasniku njegov vlastiti profil).
  async findPending() {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("partners")
      .select(PENDING_COLUMNS)
      .eq("approval_status", "na_cekanju")
      .order("created_at");
    if (error) throw new Error(`Učitavanje partnera na čekanju nije uspjelo: ${error.message}`);
    return (data as unknown as PendingRow[]).map(
      (r) =>
        new PendingPartner(
          r.id,
          r.name,
          r.oib,
          r.categories?.name ?? "",
          r.city,
          r.address,
          r.phone,
          r.profiles?.email ?? null,
          new Date(r.created_at),
        ),
    );
  }

  // Ovlast administratora i dopuštene statuse provjerava baza (set_partner_approval).
  async setApproval(id: string, decision: ApprovalDecision) {
    const supabase = await createClient();
    const { error } = await supabase.rpc("set_partner_approval", { target_id: id, new_status: decision });
    if (error) throw new Error(error.message);
  }
}
