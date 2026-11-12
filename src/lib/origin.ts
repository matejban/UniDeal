// Adresa na kojoj aplikacija trenutno radi (npr. https://www.unideal.site, preview adresa ili http://localhost:3000).
// Stripe nakon plaćanja vraća partnera na nju, pa ne smije biti zapisana u kodu: isti kod radi lokalno, na previewu i u produkciji.
export function originFromHeaders(get: (name: string) => string | null): string {
  const origin = get("origin");
  if (origin) {
    return origin;
  }

  const host = get("x-forwarded-host") ?? get("host") ?? "localhost:3000";
  const isLocal = host.startsWith("localhost") || host.startsWith("127.0.0.1");
  const protocol = get("x-forwarded-proto") ?? (isLocal ? "http" : "https");
  return `${protocol}://${host}`;
}
