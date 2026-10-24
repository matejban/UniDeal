# Popis zadataka

Popis otvorenih zadataka za UniDeal, podijeljen prema područjima iz podjele rada. Opis aplikacije nalazi se u [1. Opseg projekta](1-Projekt.md), a tehnologije u [README-u](../README.md#tehnologije).

Kada zadatak završite, označite ga (`[x]`) i dodajte poveznicu na PR. Uz svako područje upišite ime odgovorne osobe.

**Redoslijed rada:** Područje 1 prvo postavlja shemu baze i prijavu; ostali dotad rade sučelje s lažnim podacima. Najrizičniji dijelovi su Stripe webhook (područje 6) i RLS pravila (područje 1), pa s njima treba početi rano. Svatko piše dokumentaciju za svoj dio, a osoba iz područja 1 je spaja u cjelinu.

## 0. Zajedničko (cijeli tim)

- [ ] Dodijeliti osobu svakom području i upisati imena u README (Članovi tima) i u ovaj popis
- [ ] Dogovoriti način rada: grane (npr. `main` + `dev`), pregled PR-ova, tjedni sastanak
- [ ] Odlučiti što je izvan opsega i upisati u [1.3 Granice projekta](1-Projekt.md#13-granice-projekta)
- [ ] Opisati postojeća rješenja u [1.4](1-Projekt.md#14-postojeći-pristupi-i-opravdanost-projekta) (s izvorima)
- [ ] Napisati funkcijske i nefunkcijske zahtjeve u [2. Analiza zahtjeva](2-Analiza-zahtjeva.md)
- [ ] Napisati obrasce uporabe i UML dijagram obrazaca uporabe u [3. Obrasci uporabe](3-Obrasci-uporabe.md)
- [ ] Ukloniti CrisisMap primjere iz `docs/puml/` i `docs/assets/diagrams/` kada budu zamijenjeni vlastitim dijagramima
- [ ] Voditi evidenciju sastanaka i plan rada u [A. Pregled aktivnosti grupe](A-Pregled-aktivnosti-grupe.md)
- [ ] Ispuniti izjavu o uporabi umjetne inteligencije u README-u

## 1. Temelji i autentifikacija — [Ime]

- [x] Postaviti Next.js (TypeScript) + Tailwind CSS projekt umjesto praznih `frontend/` i `backend/` direktorija iz predloška (osnovne stranice s lažnim podacima u `src/`)
- [ ] Izraditi Supabase projekt i povezati ga sa Supabase CLI-jem
- [ ] Shema baze i prve migracije (korisnici, partneri, kategorije, ponude, kuponi, recenzije, favoriti, pretplate)
- [ ] RLS pravila za uloge student, partner i administrator
- [ ] Supabase implementacije sučelja `OfferRepository` i `PartnerRepository` (`src/repositories/`) i njihovo uključivanje u `src/services/index.ts` umjesto lažnih repozitorija
- [ ] Prijava Google računom (Supabase Auth, OAuth 2.0)
- [ ] Odabir uloge i dopuna podataka nakon prve prijave
- [ ] Potvrda statusa studenta studentskom e-mail domenom (bez potvrde nema generiranja kupona)
- [ ] Uređivanje profila i deaktivacija vlastitog računa
- [x] Zajednički layout i navigacija
- [x] Postavljanje na Vercel i `.env.example` s popisom varijabli okruženja (bez stvarnih ključeva)
- [ ] CI: zamijeniti `echo` u `.github/workflows/ci.yml` stvarnim lintom, buildom i testovima
- [ ] Ažurirati README (Brzi početak, Postavljanje) i [6. Postavljanje](6-Postavljanje-instalacija-i-konfiguracija.md)

## 2. Partneri i obavijesti — [Ime]

- [ ] Registracija partnera: naziv, OIB, adresa, kontakt, kategorija djelatnosti
- [ ] Javni profil partnera: logo/fotografija, adresa, telefon, radno vrijeme, opis, aktivne ponude
- [ ] Profil vidljiv tek nakon odobrenja administratora i aktivne pretplate
- [ ] Upload logotipa i slika (Supabase Storage)
- [ ] E-mail obavijesti preko Resenda: partner odobren, nova ponuda, ponuda uskoro istječe
- [ ] Pretplata studenata na kategorije i partnere

## 3. Ponude — [Ime]

- [ ] Izrada, uređivanje i brisanje ponude: naziv, opis, kategorija, iznos ili postotak popusta, rok trajanja, uvjeti korištenja, fotografija
- [ ] Statusi nacrt, aktivna i istekla
- [ ] Automatski istek ponuda (pg_cron ili Edge Function) i skrivanje isteklih iz pretrage
- [ ] Kategorije ponuda (hrana, zdravlje i sport, obrazovanje, zabava…)
- [ ] Partnerski pregled vlastitih ponuda

## 4. Pretraga, karta i favoriti — [Ime]

- [ ] Popis ponuda s filtrima: kategorija, grad, visina popusta, rok trajanja
- [ ] Sortiranje prema blizini i ocjeni
- [ ] Google Maps karta s markerima partnera
- [ ] Geokodiranje adrese partnera u koordinate
- [ ] Ponude u blizini studenta
- [ ] Favoriti (ponude i partneri)

## 5. Kuponi, QR i recenzije — [Ime]

- [ ] Generiranje kupona s jedinstvenim kodom i QR kodom
- [ ] Partnerska potvrda kupona unosom koda ili skeniranjem QR koda
- [ ] Ograničenje korištenja (npr. jednom po studentu)
- [ ] Povijest kupona za studenta
- [ ] Ocjena (1–5) i recenzija samo nakon iskorištene ponude

## 6. Plaćanje i pretplate — [Ime]

- [ ] Stripe proizvodi za mjesečnu i godišnju pretplatu (test mode)
- [ ] Stripe Checkout za partnera
- [ ] Webhook koji ažurira status pretplate u bazi (početi rano)
- [ ] Skrivanje ponuda partnera bez aktivne pretplate
- [ ] Stranica s pretplatom partnera

## 7. Admin i izvještaji — [Ime]

- [ ] Admin panel: odobravanje partnera
- [ ] Upravljanje korisničkim računima, uključujući deaktivaciju
- [ ] Upravljanje kategorijama ponuda
- [ ] Moderacija: uklanjanje neprimjerenih ponuda i recenzija
- [ ] Određivanje cijene mjesečne i godišnje pretplate
- [ ] Statistika za administratora: studenti, partneri, aktivne ponude, iskorišteni kuponi po kategorijama i gradovima, prihod od pretplata
- [ ] Statistika za partnera: pregledi i iskorištenja po ponudi, prosječna ocjena
- [ ] Izvoz izvještaja u CSV i PDF
