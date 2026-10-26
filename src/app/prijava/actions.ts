"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { isDeactivated } from "@/lib/auth";
import { safeRedirectPath } from "@/lib/redirect";
import { createClient } from "@/lib/supabase/server";

// Prijava i registracija partnera e-mailom i lozinkom.

export async function signInWithEmail(formData: FormData) {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email: String(formData.get("email")),
    password: String(formData.get("password")),
  });
  if (error) redirect("/prijava?greska=lozinka");
  if (await isDeactivated(supabase, data.user.id)) {
    await supabase.auth.signOut();
    redirect("/prijava?greska=deaktiviran");
  }
  redirect(safeRedirectPath(String(formData.get("next") ?? "/")));
}

export async function signUpWithEmail(formData: FormData) {
  const supabase = await createClient();
  const origin = (await headers()).get("origin") ?? "";
  const { error } = await supabase.auth.signUp({
    email: String(formData.get("email")),
    password: String(formData.get("password")),
    // Poveznica iz e-maila za potvrdu vodi preko Supabasea na /auth/callback.
    options: { emailRedirectTo: `${origin}/auth/callback?potvrda=1` },
  });
  if (error) {
    console.error("Registracija nije uspjela:", error.message);
    redirect("/prijava?greska=registracija");
  }
  redirect("/prijava?poruka=potvrda");
}
