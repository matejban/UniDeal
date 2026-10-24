// Prijavljeni korisnik. `id` je Supabase Auth ID korisnika (auth.users.id).
// Uloga i status studenta dodaju se ovdje kada nastane tablica profila.
export class User {
  constructor(
    readonly id: string,
    readonly email: string,
  ) {}
}
