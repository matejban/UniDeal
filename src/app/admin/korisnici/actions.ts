"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireRole } from "@/lib/auth";
import { userService } from "@/services";

// Deaktivacija i aktivacija računa (F-026). Baza ponovno provjerava ulogu i zabranjuje deaktivaciju vlastitog računa.
export async function setUserActive(formData: FormData) {
  const admin = await requireRole("admin");
  const userId = String(formData.get("userId"));
  const active = formData.get("active") === "true";

  if (userId === admin.id) redirect("/admin/korisnici?greska=vlastiti");
  try {
    if (active) await userService.activate(userId);
    else await userService.deactivate(userId);
  } catch (e) {
    console.error("Promjena aktivnosti računa nije uspjela:", e);
    redirect("/admin/korisnici?greska=1");
  }
  revalidatePath("/admin/korisnici");
}
