// Vraća putanju unutar aplikacije za preusmjeravanje nakon prijave; vanjske adrese postaju "/".
export function safeRedirectPath(next: string | undefined): string {
  const base = "http://localhost";
  const url = new URL(next ?? "/", base);
  return url.origin === base ? url.pathname + url.search + url.hash : "/";
}

// Nakon prijave korisnik prolazi kroz /dobrodoslica, koja ga odmah šalje dalje ako je već prihvatio uvjete (F-032).
export function welcomePath(next: string): string {
  return `/dobrodoslica?next=${encodeURIComponent(next)}`;
}
