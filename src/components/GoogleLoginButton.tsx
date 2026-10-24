"use client";

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
export default function GoogleLoginButton({ next }: { next: string }) {
  const buttonRef = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);

  async function initGoogle() {
    const { nonce, hashedNonce } = await generateNonce();

    google.accounts.id.initialize({
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
      nonce: hashedNonce,
      use_fedcm_for_button: true,
      callback: async ({ credential }) => {
        const { error } = await createClient().auth.signInWithIdToken({
          provider: "google",
          token: credential,
          nonce,
        });
        if (error) {
          console.error("Prijava nije uspjela:", error.message);
          setFailed(true);
          return;
        }
        // Preusmjeravanje samo unutar aplikacije; puno učitavanje osvježava navigaciju.
        const target = new URL(next, window.location.origin);
        window.location.assign(target.origin === window.location.origin ? target : "/");
      },
    });

    google.accounts.id.renderButton(buttonRef.current!, {
      type: "standard",
      theme: "outline",
      size: "large",
      text: "signin_with",
      locale: "hr",
    });
  }

  return (
    <>
      <Script src="https://accounts.google.com/gsi/client" onReady={() => void initGoogle()} />
      <div ref={buttonRef} className="mt-6 flex justify-center" />
      {failed && <p className="mt-4 text-sm text-red-600">Prijava nije uspjela. Pokušaj ponovno.</p>}
    </>
  );
}
