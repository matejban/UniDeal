import { User } from "@/domain/User";
import { createClient } from "@/lib/supabase/server";

// Jedino mjesto gdje stranice doznaju tko je prijavljen.
export async function getCurrentUser(): Promise<User | null> {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  if (!data?.claims) return null;

  // Profil stvara okidač handle_new_user pri prvoj prijavi (supabase/migrations).
  const { data: profile } = await supabase
    .from("profiles")
    .select("role, student_status, institution")
    .eq("id", data.claims.sub)
    .maybeSingle();

  return new User(
    data.claims.sub,
    data.claims.email ?? "",
    profile?.role ?? null,
    profile?.student_status ?? null,
    profile?.institution ?? null,
  );
}
