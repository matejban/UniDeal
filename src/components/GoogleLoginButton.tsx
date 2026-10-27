"use client";

import { useRouter } from "next/navigation";
import Script from "next/script";
import { useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";

// Nasumični nonce: Google dobiva njegov SHA-256 sažetak, Supabase izvornik.
async function generateNonce() {
  const nonce = btoa(String.fromCharCode(...crypto.getRandomValues(new Uint8Array(32))));
  const hash = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(nonce));
  const hashedNonce = Array.from(new Uint8Array(hash), (b) => b.toString(16).padStart(2, "0")).join("");
  return { nonce, hashedNonce };
}

// Googleov gumb (Google Identity Services) na samoj stranici, pa Google prikazuje adresu
// aplikacije umjesto Supabaseove. Dobiveni ID token Supabase pretvara u sesiju.
// `next` je već provjerena putanja unutar aplikacije (safeRedirectPath).
export default function GoogleLoginButton({ next }: { next: string }) {
  const router = useRouter();
  const buttonRef = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);

  async function initGoogle() {
    const { nonce, hashedNonce } = await generateNonce();

    google.accounts.id.initialize({
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
      nonce: hashedNonce,
      use_fedcm_for_button: true,
      callback: async ({ credential }) => {
        const supabase = createClient();
        const { data, error } = await supabase.auth.signInWithIdToken({
          provider: "google",
          token: credential,
          nonce,
        });
        if (error) {
          console.error("Prijava nije uspjela:", error.message);
          setFailed(true);
          return;
        }
        // Račun koji je deaktiviran (F-005, F-026) ne može se prijaviti, kao ni kod prijave e-mailom i Microsoftom.
        const { data: profile } = await supabase.from("profiles").select("is_active").eq("id", data.user.id).maybeSingle();
        if (profile?.is_active === false) {
          await supabase.auth.signOut();
          router.replace("/prijava?greska=deaktiviran");
          return;
        }
        // Puno učitavanje da navigacija prikaže prijavljenog korisnika.
        window.location.assign(next);
      },
    });

    google.accounts.id.renderButton(buttonRef.current!, {
      type: "standard",
      theme: "outline",
      size: "large",
      text: "signin_with",
      locale: "hr",
      width: 280,
    });
  }

  return (
    <>
      <Script src="https://accounts.google.com/gsi/client" onReady={() => void initGoogle()} />
      {/* Stalna visina: Google pri učitavanju nakratko prikazuje privremeni i pravi gumb jedan ispod drugog. */}
      <div ref={buttonRef} className="mt-6 flex h-11 justify-center overflow-hidden" />
      {failed && <p className="mt-4 text-sm text-red-600">Prijava nije uspjela. Pokušaj ponovno.</p>}
    </>
  );
}
