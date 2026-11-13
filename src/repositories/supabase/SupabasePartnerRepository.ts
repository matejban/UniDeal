import { type ApprovalDecision, type ApprovalStatus, Partner, PendingPartner } from "@/domain/Partner";
import type { LatLng } from "@/lib/geo";
import type { Tables } from "@/lib/supabase/database.types";
import { createClient } from "@/lib/supabase/server";
import {
  DuplicatePartnerError,
  type NewPartner,
  type PartnerProfile,
  type PartnerRepository,
} from "@/repositories/PartnerRepository";

const COLUMNS =
  "id, name, city, address, phone, hours, description, approval_status, oib, owner_id, logo_url, lat, lng, categories(name)";

// Ugrađena kategorija je objekt, iako je netipizirani klijent vidi kao niz (vidi SupabaseOfferRepository).
type PartnerRow = Pick<
  Tables<"partners">,
  | "id"
  | "name"
  | "city"
  | "address"
  | "phone"
  | "hours"
  | "description"
  | "approval_status"
  | "oib"
  | "owner_id"
  | "logo_url"
  | "lat"
  | "lng"
> & {
  categories: { name: string } | null;
};

function toPartner(r: PartnerRow) {
  return new Partner(
    r.id,
    r.name,
    r.categories?.name ?? "",
    r.city,
    r.address,
    r.phone,
    r.hours ?? "",
    r.description ?? "",
    r.approval_status as ApprovalStatus,
    r.oib,
    r.owner_id,
    r.logo_url,
    r.lat,
    r.lng,
  );
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

  // RLS dopušta unos samo korisniku s ulogom partner, za sebe i sa statusom na_cekanju (zadana vrijednost).
  async create(p: NewPartner) {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("partners")
      .insert({
        owner_id: p.ownerId,
        name: p.name,
        oib: p.oib,
        category_id: p.categoryId,
        address: p.address,
        city: p.city,
        phone: p.phone,
        lat: p.lat,
        lng: p.lng,
      })
      .select(COLUMNS)
      .single();
    // 23505: jedinstveni OIB ili vlasnik već postoje.
    if (error?.code === "23505") throw new DuplicatePartnerError(error.message.includes("oib") ? "oib" : "owner");
    if (error) throw new Error(`Spremanje profila partnera nije uspjelo: ${error.message}`);
    return toPartner(data as unknown as PartnerRow);
  }

  // Uvjet owner_id je dodatna provjera uz RLS, koji ionako dopušta izmjenu samo vlasniku.
  // Koordinate se ovdje ne mijenjaju; nakon promjene adrese računa ih geokodiranje (#24).
  async update(id: string, ownerId: string, profile: PartnerProfile) {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("partners")
      .update({
        name: profile.name,
        address: profile.address,
        city: profile.city,
        phone: profile.phone,
        hours: profile.hours,
        description: profile.description,
      })
      .eq("id", id)
      .eq("owner_id", ownerId)
      .select("id");
    if (error) {
      throw new Error(`Spremanje profila partnera nije uspjelo: ${error.message}`);
    }
    // Nijedan redak nije promijenjen: partner ne postoji ili nije njegov.
    if (data.length === 0) {
      throw new Error("Profil partnera nije pronađen.");
    }
  }

  // Sprema URL novog loga (#13). Kao i update, mijenja samo profil kojemu je ownerId vlasnik.
  async setLogo(id: string, ownerId: string, logoUrl: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("partners")
      .update({ logo_url: logoUrl })
      .eq("id", id)
      .eq("owner_id", ownerId)
      .select("id");
    if (error) {
      throw new Error(`Spremanje loga nije uspjelo: ${error.message}`);
    }
    if (data.length === 0) {
      throw new Error("Profil partnera nije pronađen.");
    }
  }

  // Koordinate adrese (F-013), isto samo za vlasnika profila. null briše staru lokaciju nakon promjene adrese.
  async setLocation(id: string, ownerId: string, location: LatLng | null) {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("partners")
      .update({ lat: location?.lat ?? null, lng: location?.lng ?? null })
      .eq("id", id)
      .eq("owner_id", ownerId)
      .select("id");
    if (error) {
      throw new Error(`Spremanje lokacije nije uspjelo: ${error.message}`);
    }
    if (data.length === 0) {
      throw new Error("Profil partnera nije pronađen.");
    }
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
