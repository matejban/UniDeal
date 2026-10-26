import { NextResponse, type NextRequest } from "next/server";
import { safeRedirectPath } from "@/lib/redirect";
import { isAllowedStudentEmail } from "@/lib/studentDomains";
import { createClient } from "@/lib/supabase/server";

// Microsoft i poveznica iz e-maila za potvrdu registracije preusmjeravaju ovamo (preko Supabasea)
// s jednokratnim kodom koji se mijenja za sesiju.
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get("code");
  const next = safeRedirectPath(searchParams.get("next") ?? undefined);

  if (!code) {
    // Supabase šalje razlog neuspjeha u parametrima error i error_description.
    console.error("Prijava: povratak bez koda:", searchParams.get("error"), searchParams.get("error_description"));
    return NextResponse.redirect(new URL("/prijava?greska=1", origin));
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    // Potvrda e-maila otvorena u drugom pregledniku: adresa je potvrđena, ali sesije nema.
    if (searchParams.has("potvrda")) return NextResponse.redirect(new URL("/prijava?poruka=potvrdeno", origin));
    console.error("Prijava: zamjena koda nije uspjela:", error.message);
    return NextResponse.redirect(new URL("/prijava?greska=1", origin));
  }

  // Microsoftom se prijavljuju samo studenti hrvatskih visokih učilišta.
  const { user } = data;
  if (user.app_metadata.provider === "azure" && !(await isAllowedStudentEmail(user.email ?? ""))) {
    await supabase.auth.signOut();
    return NextResponse.redirect(new URL("/prijava?greska=domena", origin));
  }

  return NextResponse.redirect(new URL(next, origin));
}
