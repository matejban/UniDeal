"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireRole } from "@/lib/auth";
import { partnerService } from "@/services";

// Odobravanje i odbijanje profila partnera (F-025). Baza ponovno provjerava ulogu (set_partner_approval).
export async function decidePartner(formData: FormData) {
  await requireRole("admin");
  const partnerId = String(formData.get("partnerId"));
  const decision = formData.get("decision");

  if (decision !== "odobren" && decision !== "odbijen") redirect("/admin/partneri?greska=1");
  try {
    if (decision === "odobren") await partnerService.approve(partnerId);
    else await partnerService.reject(partnerId);
  } catch (e) {
    console.error("Odluka o partneru nije spremljena:", e);
    redirect("/admin/partneri?greska=1");
  }
  revalidatePath("/admin/partneri");
  revalidatePath("/admin");
}
