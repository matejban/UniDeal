import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Google preusmjerava ovamo (preko Supabasea) s jednokratnim kodom koji se mijenja za sesiju.
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get("code");

  // Preusmjeravanje samo unutar aplikacije.
  const next = new URL(searchParams.get("next") ?? "/", origin);
  const target = next.origin === origin ? next : new URL("/", origin);

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(target);
    console.error("Prijava: zamjena koda nije uspjela:", error.message);
  } else {
    // Supabase šalje razlog neuspjeha u parametrima error i error_description.
    console.error("Prijava: povratak bez koda:", searchParams.get("error"), searchParams.get("error_description"));
  }

  return NextResponse.redirect(new URL("/prijava?greska=1", origin));
}
