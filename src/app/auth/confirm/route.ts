import type { EmailOtpType } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Poveznica iz e-maila za potvrdu registracije. Predložak „Confirm signup” u Supabaseu mora
// voditi na {{ .RedirectTo }}/auth/confirm?token_hash={{ .TokenHash }}&type=email
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;

  if (tokenHash && type) {
    const supabase = await createClient();
    const { error } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash });
    if (!error) return NextResponse.redirect(new URL("/", origin));
    console.error("Potvrda e-maila nije uspjela:", error.message);
  }

  return NextResponse.redirect(new URL("/prijava?greska=potvrda", origin));
}
