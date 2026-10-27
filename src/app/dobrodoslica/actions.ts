"use server";

import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { safeRedirectPath } from "@/lib/redirect";
import { userService } from "@/services";

// Dopuna imena i prihvaćanje uvjeta korištenja nakon prve prijave (F-002, F-032).
export async function completeWelcome(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) redirect("/prijava");

  const next = safeRedirectPath(String(formData.get("next") ?? "/"));
  const back = `/dobrodoslica?next=${encodeURIComponent(next)}`;
  const fullName = String(formData.get("fullName") ?? "").trim();
  if (fullName.length < 1 || fullName.length > 100) redirect(`${back}&greska=ime`);
  if (formData.get("uvjeti") !== "da") redirect(`${back}&greska=uvjeti`);
  try {
    await userService.updateName(user.id, fullName);
    await userService.acceptTerms();
  } catch (e) {
    console.error("Dovršetak prve prijave nije uspio:", e);
    redirect(`${back}&greska=1`);
  }
  redirect(next);
}
