// Vraća putanju unutar aplikacije za preusmjeravanje nakon prijave; vanjske adrese postaju "/".
export function safeRedirectPath(next: string | undefined): string {
  const base = "http://localhost";
  const url = new URL(next ?? "/", base);
  return url.origin === base ? url.pathname + url.search + url.hash : "/";
}
