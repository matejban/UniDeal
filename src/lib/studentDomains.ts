import { createClient } from "@/lib/supabase/server";

// Je li adresa s domene hrvatskog visokog učilišta (AS-01). Pravilo je u SQL funkciji
// student_institution, koju koristi i okidač koji stvara profil studenta.
export async function isAllowedStudentEmail(email: string): Promise<boolean> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("student_institution", { email });
  if (error) console.error("Provjera studentske domene nije uspjela:", error.message);
  return typeof data === "string";
}
