// Provjera OIB-a: 11 znamenki, a zadnja je kontrolna po ISO 7064 MOD 11,10 (F-006).
// Bez ovisnosti, da je jedinični test može učitati izravno (tests/unit).
export function isValidOib(oib: string): boolean {
  if (!/^[0-9]{11}$/.test(oib)) return false;
  let a = 10;
  for (let i = 0; i < 10; i++) {
    a = (a + Number(oib[i])) % 10;
    if (a === 0) a = 10;
    a = (a * 2) % 11;
  }
  const check = 11 - a === 10 ? 0 : 11 - a;
  return check === Number(oib[10]);
}
