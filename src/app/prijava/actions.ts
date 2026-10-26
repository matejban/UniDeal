"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { safeRedirectPath } from "@/lib/redirect";
import { createClient } from "@/lib/supabase/server";

// Prijava i registracija partnera e-mailom i lozinkom.

export async function signInWithEmail(formData: FormData) {
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: String(formData.get("email")),
    password: String(formData.get("password")),
  });
  if (error) redirect("/prijava?greska=lozinka");
  redirect(safeRedirectPath(String(formData.get("next") ?? "/")));
}

export async function signUpWithEmail(formData: FormData) {
  const supabase = await createClient();
  const origin = (await headers()).get("origin") ?? "";
  const { error } = await supabase.auth.signUp({
    email: String(formData.get("email")),
    password: String(formData.get("password")),
    // Predložak e-maila za potvrdu vodi na {{ .RedirectTo }}/auth/confirm (vidi /auth/confirm).
    options: { emailRedirectTo: origin },
  });
  if (error) {
    console.error("Registracija nije uspjela:", error.message);
    redirect("/prijava?greska=registracija");
  }
  redirect("/prijava?poruka=potvrda");
}
