import GoogleLoginButton from "@/components/GoogleLoginButton";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; greska?: string }>;
}) {
  const { next, greska } = await searchParams;

  return (
    <div className="mx-auto max-w-sm rounded-lg border border-gray-200 bg-white p-6 text-center">
      <h1 className="text-2xl font-bold">Prijava</h1>
      <p className="mt-2 text-sm text-gray-600">
        Prijavi se Google računom. Nakon prve prijave odabireš ulogu: student ili partner.
      </p>
      {greska && <p className="mt-4 text-sm text-red-600">Prijava nije uspjela. Pokušaj ponovno.</p>}
      <GoogleLoginButton next={next ?? "/"} />
    </div>
  );
}
