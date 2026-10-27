"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { userService } from "@/services";

// Uređivanje i deaktivacija vlastitog računa (F-005). Baza dopušta promjenu samo vlastitog imena.

export async function updateProfile(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) redirect("/prijava");

  const fullName = String(formData.get("fullName") ?? "").trim();
  if (fullName.length < 1 || fullName.length > 100) redirect("/profil?greska=ime");
  try {
    await userService.updateName(user.id, fullName);
  } catch (e) {
    console.error("Spremanje profila nije uspjelo:", e);
    redirect("/profil?greska=1");
  }
  revalidatePath("/profil");
  redirect("/profil?poruka=spremljeno");
}

export async function deactivateAccount(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) redirect("/prijava");

  if (formData.get("potvrda") !== "da") redirect("/profil?greska=potvrda");
  try {
    await userService.deactivateOwnAccount();
  } catch (e) {
    console.error("Deaktivacija računa nije uspjela:", e);
    redirect("/profil?greska=1");
  }
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/prijava?greska=deaktiviran");
}
