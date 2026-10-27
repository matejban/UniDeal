"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { isDeactivated } from "@/lib/auth";
import { safeRedirectPath } from "@/lib/redirect";
import { createClient } from "@/lib/supabase/server";

// Prijava i registracija partnera e-mailom i lozinkom.

async function signUp(email: string, password: string) {
  const supabase = await createClient();
  const origin = (await headers()).get("origin") ?? "";
  return supabase.auth.signUp({
    email,
    password,
    // Poveznica iz e-maila za potvrdu vodi preko Supabasea na /auth/callback.
    options: { emailRedirectTo: `${origin}/auth/callback?potvrda=1` },
  });
}

export async function signInWithEmail(formData: FormData) {
  const email = String(formData.get("email"));
  const password = String(formData.get("password"));
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error?.code === "email_not_confirmed") redirect("/prijava?greska=nepotvrdeno");
  if (error) {
    // Supabase ne otkriva postoji li račun, pa se pokušava registracija s istim podacima.
    // Za već registriranu adresu vraća korisnika bez identiteta i ne šalje e-mail.
    const { data, error: signUpError } = await signUp(email, password);
    if (signUpError) {
      console.error("Registracija nakon neuspjele prijave nije uspjela:", signUpError.message);
      redirect("/prijava?greska=1");
    }
    if (!data.user?.identities?.length) redirect("/prijava?greska=lozinka");
    redirect("/prijava?poruka=novi");
  }
  if (await isDeactivated(supabase, data.user.id)) {
    await supabase.auth.signOut();
    redirect("/prijava?greska=deaktiviran");
  }
  redirect(safeRedirectPath(String(formData.get("next") ?? "/")));
}

export async function signUpWithEmail(formData: FormData) {
  const { error } = await signUp(String(formData.get("email")), String(formData.get("password")));
  if (error) {
    console.error("Registracija nije uspjela:", error.message);
    redirect("/prijava?greska=registracija");
  }
  redirect("/prijava?poruka=potvrda");
}
