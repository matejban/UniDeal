import { User } from "@/domain/User";
import { createClient } from "@/lib/supabase/server";

// Jedino mjesto gdje stranice doznaju tko je prijavljen.
// Kada se uvedu profili (uloga, status studenta), ovdje se dohvaćaju i dodaju u User.
export async function getCurrentUser(): Promise<User | null> {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  if (!data?.claims) return null;
  return new User(data.claims.sub, data.claims.email ?? "");
}
