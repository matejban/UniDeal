import { redirect } from "next/navigation";
import GoogleLoginButton from "@/components/GoogleLoginButton";
import MicrosoftLoginButton from "@/components/MicrosoftLoginButton";
import { getCurrentUser } from "@/lib/auth";
import { safeRedirectPath } from "@/lib/redirect";
import { signInWithEmail, signUpWithEmail } from "./actions";

const errors: Record<string, string> = {
  "1": "Prijava nije uspjela. Pokušaj ponovno.",
  domena: "Prijava Microsoft računom dostupna je samo studentima hrvatskih visokih učilišta.",
  lozinka: "Pogrešan e-mail ili lozinka, ili adresa još nije potvrđena.",
  registracija: "Registracija nije uspjela. Lozinka mora imati barem 6 znakova, a adresa ne smije već biti registrirana.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; greska?: string; poruka?: string }>;
}) {
  const { next: rawNext, greska, poruka } = await searchParams;
  const next = safeRedirectPath(rawNext);

  // Prijavljeni korisnik nema što raditi na ovoj stranici.
  if (await getCurrentUser()) redirect(next);

  return (
    <div className="mx-auto max-w-sm space-y-6">
      <h1 className="text-center text-2xl font-bold">Prijava</h1>
      {greska && errors[greska] && <p className="rounded bg-red-50 p-3 text-sm text-red-700">{errors[greska]}</p>}
      {poruka === "potvrdeno" && (
        <p className="rounded bg-green-50 p-3 text-sm text-green-800">Adresa je potvrđena. Sada se možeš prijaviti.</p>
      )}
      {poruka === "potvrda" && (
        <p className="rounded bg-green-50 p-3 text-sm text-green-800">
          Poslali smo ti e-mail s poveznicom za potvrdu adrese. Nakon potvrde se možeš prijaviti.
        </p>
      )}

      <section className="rounded-lg border border-gray-200 bg-white p-6 text-center">
        <h2 className="text-lg font-semibold">Student</h2>
        <p className="mt-1 text-sm text-gray-600">Prijavi se računom svog fakulteta ili veleučilišta (npr. @fer.hr).</p>
        <MicrosoftLoginButton next={next} />
      </section>

      <section className="rounded-lg border border-gray-200 bg-white p-6 text-center">
        <h2 className="text-lg font-semibold">Partner</h2>
        <GoogleLoginButton next={next} />
        <p className="mt-4 text-sm text-gray-500">ili e-mailom i lozinkom</p>
        <form className="mt-2 space-y-2 text-left">
          <input type="hidden" name="next" value={next} />
          <input
            name="email"
            type="email"
            required
            placeholder="E-mail"
            className="w-full rounded border border-gray-300 px-3 py-2"
          />
          <input
            name="password"
            type="password"
            required
            minLength={6}
            placeholder="Lozinka"
            className="w-full rounded border border-gray-300 px-3 py-2"
          />
          <div className="flex gap-2">
            <button formAction={signInWithEmail} className="flex-1 rounded bg-blue-700 px-4 py-2 text-white hover:bg-blue-800">
              Prijava
            </button>
            <button formAction={signUpWithEmail} className="flex-1 rounded border border-gray-300 px-4 py-2 hover:border-blue-700">
              Registracija
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
