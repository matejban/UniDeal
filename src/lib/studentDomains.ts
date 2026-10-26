import { createClient } from "@/lib/supabase/server";

// Domena adrese i sve nadređene domene, npr. "ime@student.fer.hr" → ["student.fer.hr", "fer.hr"].
export function candidateDomains(email: string): string[] {
  const labels = email.toLowerCase().split("@")[1]?.split(".") ?? [];
  return labels.slice(0, -1).map((_, i) => labels.slice(i).join("."));
}

// Je li adresa s domene hrvatskog visokog učilišta iz tablice allowed_student_domains (AS-01).
export async function isAllowedStudentEmail(email: string): Promise<boolean> {
  const domains = candidateDomains(email);
  if (domains.length === 0) return false;

  const supabase = await createClient();
  const { data, error } = await supabase.from("allowed_student_domains").select("domain").in("domain", domains).limit(1);
  if (error) console.error("Provjera studentske domene nije uspjela:", error.message);
  return (data?.length ?? 0) > 0;
}
