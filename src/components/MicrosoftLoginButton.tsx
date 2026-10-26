"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

// Prijava studentskim Microsoft računom. Supabase preusmjerava na Microsoft, a odande na
// /auth/callback, gdje se provjerava je li adresa s domene hrvatskog visokog učilišta.
// `next` je već provjerena putanja unutar aplikacije (safeRedirectPath).
export default function MicrosoftLoginButton({ next }: { next: string }) {
  const [failed, setFailed] = useState(false);

  async function signIn() {
    const redirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`;
    const { error } = await createClient().auth.signInWithOAuth({
      provider: "azure",
      options: { scopes: "email", redirectTo },
    });
    if (error) {
      console.error("Prijava nije uspjela:", error.message);
      setFailed(true);
    }
  }

  return (
    <>
      <button
        onClick={() => void signIn()}
        className="mt-4 w-full rounded border border-gray-300 bg-white px-4 py-2 font-medium hover:border-blue-700"
      >
        Prijava studentskim Microsoft računom
      </button>
      {failed && <p className="mt-2 text-sm text-red-600">Prijava nije uspjela. Pokušaj ponovno.</p>}
    </>
  );
}
