# UniDeal

UniDeal je web platforma na kojoj studenti na jednom mjestu pronalaze i koriste popuste i pogodnosti partnera (trgovina, kafića, restorana, teretana, servisa i kulturnih ustanova).

**Projekt na kolegiju:** Ovu je aplikaciju razvio studentski tim u sklopu kolegija [Programsko inženjerstvo](https://www.fer.unizg.hr/predmet/proinz) na Fakultetu elektrotehnike i računarstva Sveučilišta u Zagrebu (FER).

## Opis aplikacije

Studentske ponude danas su razbacane po web-stranicama, društvenim mrežama i letcima, često su zastarjele, a partneri nemaju jednostavan način da dopru do studenata. UniDeal okuplja aktualne ponude na jednom mjestu: studenti ih besplatno pretražuju, vide na karti i koriste putem kupona s QR kodom, a partneri uz mjesečnu ili godišnju pretplatu objavljuju ponude i prate njihovu učinkovitost. Administrator odobrava partnere i moderira sadržaj platforme.

Aplikacija je u izradi. Označene funkcionalnosti već rade na javnoj adresi, a ostale su planirane. Stanje izrade prati se u [GitHub Issues](https://github.com/matejban/UniDeal/issues).

**Ključne funkcionalnosti**

- [x] Prijava studenata računom visokog učilišta (Microsoft), čime je potvrđen status studenta, a partnera Google računom ili e-mailom
- [x] Pretraga ponuda prema kategoriji i gradu te prikaz partnera na interaktivnoj karti; filtri po visini popusta i roku trajanja tek trebaju biti ostvareni
- [x] Digitalni kupon s jedinstvenim kodom i QR kodom; potvrdu kupona kod partnera tek treba ostvariti
- [ ] Ocjene i recenzije koje može ostaviti samo student koji je ponudu stvarno iskoristio
- [x] Plaćanje pretplate partnera (Stripe); automatsko aktiviranje pretplate nakon plaćanja tek treba ostvariti
- [ ] Statistika pregleda i iskorištenja ponuda za partnere

Za potpuni opseg, zahtjeve, oblikovanje i dokaze ispitivanja pogledajte [docs](docs/Home.md).

<a id="deployment"></a>
## Postavljanje (engl. deployment)

**Javno dostupna aplikacija:** <https://www.unideal.site>

**Isprobajte:** otvorite [Ponude](https://www.unideal.site/ponude), odaberite kategoriju ili grad i kliknite *Filtriraj*; otvorite ponudu, a s nje profil partnera s njegovim aktivnim ponudama.

**Demonstracija:** za pregled ponuda, partnera i karte korisnički račun nije potreban. Studentski dio (`/student`) otvara se prijavom studentskim Microsoft računom hrvatskog visokog učilišta (npr. `@fer.hr`), a partnerski (`/partner`) registracijom e-mailom i lozinkom ili Google računom. Administratorsku ulogu demonstratoru na zahtjev dodjeljuje tim u bazi, nakon njegove prve prijave; lozinke se ne dijele.

**Ograničenja:** partneri i ponude su izmišljeni demo podaci. Još nisu implementirani partnerska potvrda kupona, povijest kupona, recenzije, favoriti, e-mail obavijesti studentima, statistika za partnere, moderacija, izvoz izvještaja i automatsko aktiviranje pretplate nakon plaćanja (Stripe webhook); stanje po zadacima vidi se u [GitHub Issues](https://github.com/matejban/UniDeal/issues). Status studenta prepoznaje se po domeni Microsoft računa, pa se student ne razlikuje od djelatnika istog učilišta (AS-01 u [analizi zahtjeva](docs/2-Analiza-zahtjeva.md)); zato student pri korištenju kupona pokazuje studentsku iskaznicu (X-icu).

[Vodič za postavljanje i pokretanje](docs/6-Postavljanje-instalacija-i-konfiguracija.md) opisuje smještaj aplikacije (engl. hosting) koji tim koristi: aplikacija je na Vercelu, a baza, prijava i pohrana datoteka na Supabaseu.

<a id="quick-start"></a>
## Brzi početak / instalacija


**Preduvjeti:** Node.js 20.9 ili noviji i npm.

```bash
git clone https://github.com/matejban/UniDeal.git
cd UniDeal
npm ci
cp .env.example .env.local   # upišite vrijednosti (vidi Konfiguracija)
npm run dev
```

**Adresa:** http://localhost:3000

**Konfiguracija:** Kopirajte `.env.example` u `.env.local` i upišite URL i javni (publishable) ključ Supabase projekta te Google Client ID; potrebni su za prijavu. Prijava Microsoft računom i e-mailom podešava se samo u Supabaseu (Authentication → Sign In / Providers), bez varijabli okruženja. Ponude i partneri čitaju se iz baze; shema je u `supabase/migrations/`, a demo podaci u `supabase/seed.sql`.

**Provjera:** otvorite <http://localhost:3000/ponude>; trebaju se prikazati tri demo ponude iz baze (npr. „Kava + kroasan”). Za detaljno postavljanje pogledajte [poglavlje 6](docs/6-Postavljanje-instalacija-i-konfiguracija.md).

## Tehnologije

Tehnologije koje aplikacija koristi:

| Tehnologija ili alat | Uloga u ovom projektu | Razlog uporabe ili važno ograničenje |
| --- | --- | --- |
| Next.js (TypeScript) + Tailwind CSS | Korisničko sučelje i poslužiteljska logika aplikacije | Klijentski i poslužiteljski dio u jednom projektu koji se izravno postavlja na Vercel |
| Supabase Postgres | Pohrana korisnika, partnera, ponuda, kupona i recenzija | Promjene sheme vode se SQL migracijama u `supabase/migrations` |
| Supabase Auth (Microsoft Entra ID, Google OAuth 2.0, e-mail i lozinka) | Prijava studenata (Microsoft) i partnera (Google ili e-mail) | Status studenta potvrđuje se domenom studentskog Microsoft računa (tablica `allowed_student_domains`) |
| Row Level Security (RLS) | Ograničavanje pristupa podacima prema ulozi (student, partner, administrator) | Pravila se provode u bazi, pa ih treba ispitati za svaku ulogu |
| Supabase Storage | Pohrana logotipa partnera i slika ponuda | — |
| pg_cron (planirano) | Automatski istek ponuda | Istekle ponude moraju nestati iz pretrage bez ručne radnje |
| Stripe (test mode) | Naplata mjesečne i godišnje pretplate partnera | Status pretplate ažurira se putem webhooka; bez aktivne pretplate ponude nisu javne |
| Google Maps JavaScript API | Karta partnera i ponuda, geokodiranje adrese, ponude u blizini | Vanjska usluga s API ključem i ograničenjem korištenja |
| Resend | Slanje e-maila (SMTP za Supabase Auth, kasnije obavijesti) | Pošiljatelj `noreply@unideal.site`; domena je potvrđena DNS zapisima |
| Vercel | Javno postavljanje aplikacije i domena `unideal.site` | Push na `master` automatski se postavlja u produkciju |

<a id="team-members"></a>
## Članovi tima

| Član | Glavna uloga ili doprinos |
| --- | --- |
| [Matej Ban](https://github.com/matejban) | 1. Temelji i autentifikacija |
| [Fran Lovrić](https://github.com/franlovric) | 2. Partneri i obavijesti |
| [Krešimir Daković](https://github.com/kresimir-dakovic) | 3. Ponude |
| [Karlo Brkić](https://github.com/karlobrkic) | 4. Pretraga, karta i favoriti |
| [Elide Babić](https://github.com/elide-babic-fer) | 5. Kuponi, QR i recenzije |
| [Josip Čaljkušić](https://github.com/josip-caljkusic) | 6. Plaćanje i pretplate |
| [Fran Čeko](https://github.com/fran-ceko) | 7. Admin i izvještaji |

Zadaci po području vode se u [GitHub Issues](https://github.com/matejban/UniDeal/issues), s oznakom područja (npr. `podrucje-3-ponude`).

Uloge se tijekom projekta mogu mijenjati. Repozitorij i dogovoreni alat za praćenje zadataka (engl. task tracker) služe kao dodatni dokazi timskog rada.

## Doprinos projektu

Svaki zadatak ima svoj issue u [GitHub Issues](https://github.com/matejban/UniDeal/issues) s oznakom područja; nedostaci se prijavljuju na isti način. Rad na zadatku ide na zasebnoj grani nazvanoj po autoru i zadatku (npr. `fran/13-upload`, `elide/29-jednom-po-studentu`), a commitovi u poruci navode broj issuea ili ID zahtjeva. Promjena ulazi u granu `master` samo kroz pull request: drugi član tima pregleda kod, a CI (`.github/workflows/ci.yml`) mora proći lint, testove i izgradnju. Promjena sheme baze uvijek je nova migracija u `supabase/migrations/` (vidi [6. Postavljanje](docs/6-Postavljanje-instalacija-i-konfiguracija.md)).

<a id="license"></a>

**Status licence:** Ovom projektu nije dodijeljena licenca koja dopušta javnu ponovnu uporabu; sva prava pridržavaju autori (članovi tima navedeni gore). Datoteka [LICENSE](LICENSE) odnosi se na predložak dokumentacije iz repozitorija VladoSruk/programsko-inzenjerstvo, a ne na kod aplikacije.

Dokumentacijski predložak kolegija sadrži otvorene obrazovne sadržaje (engl. Open Educational Resources, OER) i licenciran je licencom Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International. Ta licenca ne određuje licencu aplikacije; licenca aplikacije navedena je u prethodnom retku.

Kod trećih strana, skupovi podataka, slike, ikone i drugi sadržaji zadržavaju vlastite licence i uvjete uporabe.

<a id="ai-usage"></a>
## Uporaba umjetne inteligencije [![AI Usage: Disclosed](https://img.shields.io/badge/AI%20Usage-Disclosed-blue.svg)](https://www.fer.unizg.hr/_download/repository/Policy%20on%20the%20appropriate%20use%20of%20artificial%20intelligence%20at%20the%20faculty%20of%20electrical%20engineering%20and%20computing%5B1%5D.pdf)

Ovaj projekt slijedi FER-ova [pravila o primjerenoj uporabi umjetne inteligencije](https://www.fer.unizg.hr/_download/repository/Policy%20on%20the%20appropriate%20use%20of%20artificial%20intelligence%20at%20the%20faculty%20of%20electrical%20engineering%20and%20computing%5B1%5D.pdf).

**Izjava:** Svi članovi tima koristili su alat umjetne inteligencije **Claude (Anthropic)**. Korišten je za:

- objašnjavanje postojećeg koda i tehnologija (Next.js, Supabase) te vođenje kroz implementaciju funkcionalnosti
- pomoć pri pisanju koda i pronalaženju grešaka
- pomoć pri ispravnom i potpunom popunjavanju dokumentacije, uključujući upozorenja na dijelove koji nedostaju i prijedloge teksta
- prepisivanje zadataka iz početne `.md` datoteke u GitHub Issues
- pisanje komentara na zajedničkim zadacima u GitHub Issues

Kod i tekst koje je predložio Claude član tima je pregledao, prilagodio i provjerio prije nego što je ušao u repozitorij: lintom i izgradnjom aplikacije, automatskim testovima (`npm test`) i ručnim testiranjem na https://www.unideal.site. Promjene ulaze u granu `master` kroz pull request koji pregleda voditelj tima. Svaki član može objasniti vlastiti doprinos.

<a id="code-of-conduct-and-support"></a>
## Kodeks ponašanja i podrška [![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-2.1-4baaaa.svg)](CODE_OF_CONDUCT.md)

Od članova tima očekuje se pridržavanje **Kodeksa ponašanja studenata** Fakulteta elektrotehnike i računarstva Sveučilišta u Zagrebu, pravila timskog rada na kolegiju i [Etičkog kodeksa IEEE-a](https://www.ieee.org/about/corporate/governance/p7-8.html). Pravila ponašanja u repozitoriju nalaze se u datoteci [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).

---

Struktura dokumentacije prilagođena je predlošku kolegija Programsko inženjerstvo FER-a autora [Vlade Sruka](https://www.fer.unizg.hr/vlado.sruk), licenciranom pod [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/). Aplikaciju i njezin sadržaj izradio je gore navedeni studentski tim.
