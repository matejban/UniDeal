import type { SupabaseClient } from "@supabase/supabase-js";
import { notFound, redirect } from "next/navigation";
import { User, type UserRole } from "@/domain/User";
import { createClient } from "@/lib/supabase/server";

// Jedino mjesto gdje stranice doznaju tko je prijavljen.
// Deaktivirani korisnik (F-026) smatra se neprijavljenim.
export async function getCurrentUser(): Promise<User | null> {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  if (!data?.claims) return null;

  // Profil stvara okidač handle_new_user pri prvoj prijavi (supabase/migrations).
  const { data: profile } = await supabase
    .from("profiles")
    .select("role, student_status, institution, full_name, is_active, terms_accepted_at")
    .eq("id", data.claims.sub)
    .maybeSingle();
  if (profile && !profile.is_active) return null;

  return new User(
    data.claims.sub,
    data.claims.email ?? "",
    profile?.role ?? null,
    profile?.student_status ?? null,
    profile?.institution ?? null,
    profile?.full_name ?? null,
    true,
    profile?.terms_accepted_at ? new Date(profile.terms_accepted_at) : null,
  );
}

// Je li račun deaktiviran. Poziva se odmah nakon prijave, klijentom koji je upravo dobio sesiju.
export async function isDeactivated(supabase: SupabaseClient, userId: string): Promise<boolean> {
  const { data: profile } = await supabase.from("profiles").select("is_active").eq("id", userId).maybeSingle();
  return profile?.is_active === false;
}

// Na početku stranica i Server Actiona za prijavljene korisnike. Neprijavljenog šalje na prijavu,
// a korisnika koji nije prihvatio uvjete korištenja na /dobrodoslica (F-032).
export async function requireUser(): Promise<User> {
  const user = await getCurrentUser();
  if (!user) redirect("/prijava");
  if (!user.hasAcceptedTerms()) redirect("/dobrodoslica");
  return user;
}

// Na početku svake zaštićene stranice i Server Actiona (NF-03). Korisniku druge uloge stranica ne postoji.
export async function requireRole(role: UserRole): Promise<User> {
  const user = await requireUser();
  if (user.role !== role) notFound();
  return user;
}
