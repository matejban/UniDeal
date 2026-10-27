import { User } from "@/domain/User";
import { createClient } from "@/lib/supabase/server";
import type { UserFilter, UserRepository } from "@/repositories/UserRepository";

// Čita profile s pravima prijavljenog korisnika: RLS administratoru vraća sve profile, a ostalima samo vlastiti.
export class SupabaseUserRepository implements UserRepository {
  async findAll(filter: UserFilter = {}) {
    const supabase = await createClient();
    let query = supabase
      .from("profiles")
      .select("id, email, role, student_status, institution, full_name, is_active")
      .order("created_at", { ascending: false });
    if (filter.email) query = query.ilike("email", `%${filter.email.replace(/[\\%_]/g, "\\$&")}%`);
    if (filter.role) query = query.eq("role", filter.role);

    const { data, error } = await query;
    if (error) throw new Error(`Učitavanje korisnika nije uspjelo: ${error.message}`);
    return data.map(
      (p) =>
        new User(p.id, p.email ?? "", p.role, p.student_status, p.institution, p.full_name, p.is_active),
    );
  }

  // Ovlast i zabranu deaktivacije vlastitog računa provjerava baza (set_user_active).
  async setActive(id: string, active: boolean) {
    const supabase = await createClient();
    const { error } = await supabase.rpc("set_user_active", { target_id: id, active });
    if (error) throw new Error(error.message);
  }
}
