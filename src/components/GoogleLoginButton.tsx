"use client";

import { createClient } from "@/lib/supabase/client";

export default function GoogleLoginButton({ next }: { next: string }) {
  async function signIn() {
    const redirectTo = new URL("/auth/callback", window.location.origin);
    redirectTo.searchParams.set("next", next);
    await createClient().auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: redirectTo.toString() },
    });
  }

  return (
    <button
      onClick={signIn}
      className="mt-6 w-full rounded border border-gray-300 px-4 py-2 hover:border-blue-700"
    >
      Prijava Google računom
    </button>
  );
}
