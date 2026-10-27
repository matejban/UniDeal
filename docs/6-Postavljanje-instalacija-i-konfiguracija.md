# 6. Postavljanje, instalacija i konfiguracija

**Cilj:** Detaljno dokumentirati topologiju izvođenja, postupak lokalne instalacije i konfiguracije iz izvornog koda te način javnog postavljanja i administracije programa. [README](../README.md) navodi javnu adresu i sažeti postupak lokalnog pokretanja; ova stranica donosi potpun inženjerski postupak koji osigurava točnu ponovljivost na drugom računalu.

Zamijenite oglednu topologiju, naredbe i postavke onima koje vaš tim stvarno koristi (u primjeru se koristi Render; dokumentirajte platformu odabranu za vaš projekt).

---

## 6.1 Prikaz razmještaja

**Cilj:** Prikazati okruženja izvođenja, raspodijeljene dijelove programa, spremište podataka i relevantne vanjske usluge. Njihovu komunikaciju i mrežne protokole prikažite jednim UML dijagramom razmještaja. Dok dijagram komponenata iz Poglavlja 4 prikazuje logičke odgovornosti, dijagram razmještaja pokazuje gdje se izvršni artefakti fizički ili virtualno izvode.

**Dijagram razmještaja:**

![UML dijagram razmještaja sustava UniDeal](./assets/diagrams/6-1-unideal-DD.svg)

**Slika 6.1. UML dijagram razmještaja sustava UniDeal**

**PlantUML izvor:** [6-1-unideal-DD.puml](./puml/6-1-unideal-DD.puml)  
**Javno dostupna aplikacija:** <https://www.unideal.site> (vidi [README](../README.md#deployment))

* **Korisnički uređaj:** preglednik prima HTML i statičke datoteke s Vercela. Prijava se dijelom odvija u pregledniku: Google gumb dobiva ID token od Google Identity Servicesa i šalje ga Supabase Authu, a Microsoft prijava preusmjerava preglednik preko Supabase Autha na Microsoft Entra ID.
* **Vercel:** jedna Next.js aplikacija; statičke datoteke poslužuje CDN, a stranice, Server Actions, `/auth/callback` i `src/proxy.ts` izvode se kao Vercel Functions (Node.js 24, regija `iad1`). Aplikacija nema zasebni API poslužitelj.
* **Supabase:** aplikacija razgovara s Supabaseom samo preko HTTPS-a (Auth i REST API) i samo javnim ključem; što tko smije čitati i mijenjati određuju RLS pravila u bazi (vidi 4.6). Postgres nije izravno dostupan aplikaciji.
* **Vanjske usluge:** Microsoft Entra ID (prijava studenata), Google Identity Services (prijava partnera) i Resend, preko kojega Supabase Auth šalje e-mail za potvrdu adrese.

*Pravila izrade prikaza:*
* Označite stvarne čvorove na kojima se program izvodi (korisnički uređaj, poslužitelj, baza podataka) i protokole među njima.
* Bazu podataka ili vanjskog pružatelja usluga uključite samo ako ih postavljeni program stvarno koristi.
* Razvojno računalo nije javni poslužitelj; prikažite isključivo produkcijsko okruženje.
* Ako se planirana arhitektura tijekom implementacije promijenila, ovdje prikažite stvarni razmještaj i odgovarajuće ažurirajte opis arhitekture.

<details>
<summary><strong>Primjer: Javno postavljanje programa za prijave i obavijesti </strong></summary>

**Primjer — CrisisMap:**
Predloženi klijentski dio gradi se kao statičko web-mjesto. Poslužiteljska web-usluga obrađuje prijave i asinkrono šalje obavijesti unutar **iste postavljene poslužiteljske aplikacije**. PostgreSQL sprema podatke prijava, pružatelj kartografskih usluga isporučuje kartografske pločice pregledniku, a Firebase Cloud Messaging prima zahtjeve za slanje upozorenja iz poslužiteljskog dijela. Primjer pretpostavlja da obavijesti pripadaju opsegu tog konkretnog projekta.

![UML dijagram razmještaja sustava CrisisMap](./assets/diagrams/6-1-crisismap-DD.svg)

**Slika 6.1. UML dijagram razmještaja sustava CrisisMap**

**PlantUML izvor:** [izvor](./puml/6-1-crisismap-DD.puml)
**Analiza razmještaja:**
* **Korisnički uređaj:** Web-preglednik izvršava klijentski kod nakon preuzimanja statičkih datoteka.
* **Poslužiteljski čvor:** Poslužiteljski API i pozadinski zadaci nalaze se unutar jedne usluge (jednog izvršnog procesa).
* **Baza podataka:** Veza s bazom uspostavlja se isključivo iz poslužiteljskog dijela putem interne mreže, a nikada izravno iz klijentskog preglednika.
* **Vanjske usluge:** Pružatelj kartografskih usluga i pružatelj obavijesti nalaze se izvan infrastrukture koju postavlja tim.
</details>

---

## 6.2 Lokalna instalacija i konfiguracija

**Cilj:** Omogućiti novom članu tima ili ocjenjivaču da iz čiste radne kopije repozitorija instalira i lokalno pokrene cijeli programski sustav, uključujući bazu podataka i početne podatke.

Lokalno se pokreće samo Next.js aplikacija. Lokalne baze nema: aplikacija se spaja na zajednički Supabase projekt u oblaku, isti koji koristi i javna inačica.

1. **Preduvjeti i preuzimanje izvornog koda:** Node.js 20.9 ili noviji (zahtjev Next.js 16) i npm. Sve naredbe pokreću se iz korijena repozitorija.

   ```bash
   git clone https://github.com/matejban/UniDeal.git
   cd UniDeal
   npm ci
   ```

2. **Konfiguracijske varijable:** kopirajte [`.env.example`](../.env.example) u `.env.local` (Git ga ne prati) i upišite vrijednosti:

   | Varijabla | Uloga | Odakle |
   | --- | --- | --- |
   | `NEXT_PUBLIC_SUPABASE_URL` | adresa Supabase projekta | Supabase → Project Settings → API |
   | `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | javni (publishable) ključ za Supabase Auth i REST API | Supabase → Project Settings → API Keys |
   | `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | Client ID za gumb „Prijava Googleom” | Google Cloud → Google Auth Platform → Clients → UniDeal |

   Sve tri vrijednosti su javne (vidljive pregledniku), pa ih član tima može dobiti iz Vercela (Project → Settings → Environment Variables) ili od voditelja. Za lokalno pokretanje nisu potrebne tajne vrijednosti. Tajni ključevi (Microsoft client secret, SMTP lozinka) upisani su samo u Supabaseu i nikad se ne stavljaju u repozitorij ni u `.env` datoteke.

3. **Baza podataka i migracije:** shema je u verzioniranim SQL migracijama u [`supabase/migrations`](../supabase/migrations), a izvode se redom po vremenskoj oznaci u nazivu. Na zajedničkom projektu su već primijenjene, pa ih pri lokalnom pokretanju ne treba ponovno izvoditi. Promjena sheme uvijek je nova migracija (nova datoteka), nikad izmjena postojeće; primjenjuje se ručno u Supabase SQL Editoru prije spajanja koda koji je treba. Demo partneri i ponude u [`supabase/seed.sql`](../supabase/seed.sql) učitani su jednom; skripta koristi `on conflict do nothing`, pa ponovno izvođenje ne stvara duplikate. RLS pravila provjerava [`supabase/tests/rls.sql`](../supabase/tests/rls.sql): skripta se izvodi u SQL Editoru, sve poništava na kraju i javlja grešku s nazivima testova koji ne prolaze.

4. **Pokretanje i provjera:**

   ```bash
   npm run dev
   ```

   Aplikacija je dostupna na <http://localhost:3000>. Otvorite <http://localhost:3000/ponude>: prikazuju se tri demo ponude („Kava + kroasan”, „Mjesečna članarina”, „Popust na udžbenike”) s partnerima i kategorijama, čime je potvrđeno da aplikacija čita bazu preko Supabasea. Ako se umjesto toga pojavi greška, poruka „Učitavanje ponuda nije uspjelo” u terminalu znači da su `NEXT_PUBLIC_SUPABASE_*` vrijednosti pogrešne ili da Supabase nije dostupan.

   Za prijavu na lokalnoj adresi `http://localhost:3000` mora biti dopuštena u Supabaseu (Authentication → URL Configuration → Redirect URLs), a za Google i među *Authorized JavaScript origins* klijenta u Google Cloudu. Greške prijave vide se u Supabaseu (Logs → Auth).

<details>
<summary><strong>Primjer: Instalacija programa s lokalnom PostgreSQL bazom (CrisisMap)</strong></summary>

Ovaj nastavni primjer koristi klijentski dio temeljen na radnom okviru React/Vite (`frontend/`), poslužiteljski dio temeljen na Node.js okruženju (`backend/`) i PostgreSQL bazu podataka.

#### 1. Inicijalizacija baze podataka

U terminalu stvorite razvojnu bazu podataka i pokrenite početnu SQL skriptu iz korijena repozitorija:

```bash
createdb crisismap_dev
psql -d crisismap_dev -f backend/db/001_create_schema.sql
psql -d crisismap_dev -c '\dt'
```

Verzionirana SQL datoteka u ovom primjeru stvara tablice u **novoj** bazi podataka; provjera `\dt` treba ih prikazati. Konfigurirajte lokalni PostgreSQL račun koji može koristiti tu shemu; ako je riječ o zasebnom računu, zabilježite naredbe za njegovo stvaranje i dodjelu prava. Node.js poslužiteljski dio čita `DATABASE_URL`: lokalno ga postavite tako da se putem PostgreSQL URL-a povezuje na `crisismap_dev`, a potrebne pristupne podatke čuvajte u lokalnoj postavci koja se ne uključuje u repozitorij. Nemojte objaviti puni URL veze ako sadrži lozinku. Ako druga aplikacija koristi automatske migracije, pokrenite je prema uputama i provjerite jesu li migracije provedene umjesto zasebnog izvršavanja skripte početne sheme. Ako ogledne prijave zahtijevaju početne podatke, navedite stvarnu naredbu tog projekta i objasnite kada se treba koristiti.

#### 2. Konfiguracija i pokretanje poslužiteljskog dijela (backend)

U prvom terminalu postavite ovisnosti, pripremite varijable okruženja i pokrenite poslužitelj:

```bash
cd backend
npm ci
cp .env.example .env
# Uredite .env datoteku: postavite DATABASE_URL=postgresql://localhost:5432/crisismap_dev
npm start
```

*Poslužiteljski API pokreće se i sluša na:* `http://localhost:8080`

#### 3. Pokretanje klijentskog dijela (frontend)

U drugom terminalu instalirajte ovisnosti klijenta i pokrenite razvojni poslužitelj:

```bash
cd frontend
npm ci
VITE_API_BASE_URL=http://localhost:8080 npm run dev
```

*Klijentska aplikacija dostupna je u pregledniku na:* `http://localhost:5173`

#### 4. Provjera rada sustava

Otvorite adresu klijenta koju ispiše Vite, podnesite probnu prijavu s odabranom lokacijom, provjerite prikazuje li se potvrda s novim identifikatorom prijave i ponovno je dohvatite. Samo učitavanje početne stranice klijenta bez slanja i dohvata podataka ne dokazuje ispravnost rada poslužiteljskog dijela i baze podataka.

Ako se adresa poslužiteljskog dijela razlikuje od `http://localhost:8080`, koristite adresu koju aplikacija stvarno ispiše. Ako podnošenje ne uspije, pregledajte API zahtjev u pregledniku i zapis poslužiteljskog dijela; ako pokretanje ne uspije, provjerite postavke veze s bazom podataka i je li shema stvorena. Nemojte kopirati putanje ili naredbe iz ovog primjera ako se vaš repozitorij razlikuje.

**Analiza primjera:** Postupak ima jasan redoslijed: stvoriti bazu podataka, uspostaviti shemu i pristup, konfigurirati veze, pokrenuti oba procesa i provjeriti spremljenu prijavu. Naredbe i očekivani rezultati dovoljno su konkretni da se može dijagnosticirati nepotpuno postavljanje. Oni nadopunjuju kratki put iz README-a do pokrenute aplikacije umjesto da tvrde kako samo učitana web-stranica dokazuje uspješnu instalaciju.
</details>

---

## 6.3 Javno postavljanje i administracija

**Cilj:** Dokumentirati točne korake za ponovljivo postavljanje cjelovitog programskog sustava na produkcijsku infrastrukturu u oblaku, uključujući smještenu bazu podataka i veze među postavljenim dijelovima. Kada je jasnije, povežite konfiguraciju koja već postoji u Gitu umjesto njezina prepisivanja.

| **Postavljeni podsustav** | **Infrastruktura i izvor koda** | **Naredbe izgradnje i pokretanja** | **Konfiguracija i varijable okruženja** |
| --- | --- | --- | --- |
| **Klijentski i poslužiteljski dio** (Next.js) | Vercel, projekt `unideal`; repozitorij `matejban/UniDeal`, korijenski direktorij. Grana `master` ide u produkciju, ostale grane dobivaju preview. | Vercel prepoznaje Next.js i sam izvodi `npm install` i `next build`; stranice se izvode kao Vercel Functions (Node.js 24, regija `iad1`), a statičke datoteke s CDN-a. | `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `NEXT_PUBLIC_GOOGLE_CLIENT_ID`: javne, postavljene za Production, Preview i Development. Tajnih varijabli aplikacija zasad nema. |
| **Baza podataka i autentifikacija** | Supabase (upravljani Postgres i Auth), regija `eu-west-1` | Migracije iz `supabase/migrations` primjenjuju se ručno u SQL Editoru prije spajanja koda koji ih treba; postavljanje aplikacije ne mijenja shemu. | Pristupni podaci baze ostaju u Supabaseu. Aplikacija koristi samo javni ključ, a pristup podacima ograničava RLS. |
| **E-pošta** | Resend, domena pošiljatelja `unideal.site` (DKIM i SPF zapisi u Vercel DNS-u) | — | SMTP podaci (`smtp.resend.com`, port 465, korisnik `resend`, lozinka je Resend API ključ) upisani su samo u Supabase → Authentication → Emails → SMTP Settings. |
| **Domena** | `unideal.site`, registrirana i s DNS-om na Vercelu; `www.unideal.site` je glavna adresa, a `unideal.site` preusmjerava na nju (308). | — | — |
| **Pružatelji identiteta** | Microsoft Entra ID (registracija aplikacije za račune organizacija), Google Cloud (OAuth klijent) | — | Microsoft client secret upisan je samo u Supabase → Authentication → Sign In / Providers → Azure. |

**CI i CD:** Kontinuirana integracija (engl. *continuous integration*, CI) automatizira izgradnju i provjere pri integriranju promjena. Kratica CD može označavati dva različita postupka. **Kontinuirana isporuka** (engl. *continuous delivery*) održava provjerenu inačicu spremnom za postavljanje, ali postavljanje u produkciju može zahtijevati ručnu odluku. **Kontinuirano postavljanje** (engl. *continuous deployment*) automatski postavlja uspješno provjerenu promjenu u produkciju. Navedite postupak koji projekt stvarno koristi; nemojte koristiti oznaku CI/CD samo zato što alat podržava automatizaciju.
U tablici i opisu navedite **nazive i svrhu** varijabli, gdje ovlašteni održavatelj dobiva njihove vrijednosti i kojoj se usluzi svaka postavlja. Razlikujte konfiguraciju vidljivu pregledniku od tajnih podataka poslužiteljskog dijela.

**CI i CD u ovom projektu:** Vercel automatski postavlja svaki push: grana `master` ide u produkciju, a ostale grane na preview adrese (zaštićene Vercel prijavom). Automatiziranih provjera prije postavljanja zasad nema (lint, build i testovi u GitHub Actionsu su zadatak #8), pa to nije kontinuirano postavljanje u smislu gornje definicije, nego automatsko postavljanje nakon pregleda pull requesta.

### Postupak postavljanja

1. **Supabase:** stvoriti projekt u regiji `eu-west-1` i redom primijeniti sve migracije iz `supabase/migrations` u SQL Editoru, zatim jednom izvesti `supabase/seed.sql`. U Authentication → Sign In / Providers uključiti Azure (Azure Tenant URL `https://login.microsoftonline.com/organizations`), Google i Email s potvrdom adrese. U Authentication → URL Configuration postaviti Site URL na `https://www.unideal.site` i dodati dopuštene adrese preusmjeravanja za produkciju, preview (`https://*-acme-5901.vercel.app/**`) i, po potrebi, `http://localhost:3000/**`.
2. **Pružatelji identiteta:** u Microsoft Entra ID registrirati aplikaciju za račune bilo koje organizacije s Redirect URI `https://<project-ref>.supabase.co/auth/v1/callback` i opcionalnom tvrdnjom `email`; Application ID i client secret upisati u Supabase. U Google Cloudu napraviti OAuth klijent (Web) s produkcijskom domenom među *Authorized JavaScript origins*; Client ID upisati u Supabase i u varijablu `NEXT_PUBLIC_GOOGLE_CLIENT_ID`.
3. **Vercel:** uvesti repozitorij (Next.js se prepoznaje sam), postaviti tri `NEXT_PUBLIC_*` varijable za sva okruženja i produkcijsku granu `master`. Dodati domene `unideal.site` i `www.unideal.site`.
4. **E-pošta:** u Resendu dodati domenu `unideal.site` i dopustiti mu da DNS zapise upiše u Vercel; nakon potvrde domene u Supabaseu uključiti custom SMTP s podacima iz tablice, uz pošiljatelja `noreply@unideal.site`.
5. **Provjera:** otvoriti <https://www.unideal.site/ponude> i provjeriti da se prikazuju demo ponude; prijaviti se studentskim Microsoft računom i na `/student` provjeriti status „potvrđen” i naziv učilišta; registrirati partnera e-mailom i provjeriti da stiže e-mail za potvrdu.

### Pristup i administracija

- **Nadzor rada i zapisi pogrešaka:** greške izgradnje vide se u Vercel → Deployments, a greške pri izvođenju u Vercel → Logs. Prijave i e-mailovi vide se u Supabase → Logs (Auth), upiti u Supabase → Logs (API i Postgres), a isporuka e-maila u Resend → Emails. Pristup imaju članovi tima dodani u Vercel, Supabase i Resend.
- **Upravljanje administratorskim ovlastima:** administrator ima sučelje na `/admin` i `/admin/korisnici` (pregled i deaktivacija računa). Ulogu nije moguće dobiti prijavom; član tima s pristupom Supabaseu dodjeljuje je u SQL Editoru naredbom `update public.profiles set role = 'admin' where email = '<adresa>';`, nakon što se korisnik barem jednom prijavio.
- **Postupak ažuriranja:** svaki član radi na svojoj grani (`ime/broj-područje`) i otvara pull request prema `master`; spajanjem Vercel postavlja novu inačicu u produkciju. Migraciju koju novi kod treba potrebno je primijeniti u Supabaseu prije spajanja. Prethodna inačica može se vratiti iz Vercel → Deployments (Instant Rollback); vraćanje ne poništava migracije.

Opisujte samo okruženja i automatizirane postupke koji stvarno postoje. Okruženje za pripremu, kontinuirana integracija (CI), kontinuirana isporuka ili kontinuirano postavljanje (CD), krajnja točka za provjeru stanja, sigurnosne kopije i druge operativne mogućnosti navode se samo ako ih tim stvarno koristi.
<details>
<summary><strong>Primjer konfiguriranja statičkog web-mjesta, poslužiteljskog dijela i baze podataka na Renderu</strong></summary>

**Primjer — CrisisMap:**

Jedno izvedivo postavljanje prethodno opisanog Node.js nastavnog primjera koristi sljedeće usluge Rendera. Lokalna PostgreSQL baza iz odjeljka 6.2 odvojena je od upravljane baze koja poslužuje javnu aplikaciju.

| **Postavljeni podsustav** | **Izvor i konfiguracija izgradnje / pokretanja** | **Potrebne varijable i mrežne veze** |
| --- | --- | --- |
| **Statičko web-mjesto** (klijent) | Mapa `frontend/`; grana `main`; izgradnja `npm ci && npm run build`; direktorij objave `dist/`. | `VITE_API_BASE_URL` postavljen na javni URL poslužiteljskog dijela. To je konfiguracija vidljiva pregledniku, a ne tajna vrijednost. |
| **Web-usluga** (poslužitelj) | Mapa `backend/`; Node.js okruženje; izgradnja `npm ci`; pokretanje `npm start`. | `DATABASE_URL` (**interni** URL Render baze), `PORT` (dodjeljuje platforma). Poslužitelj mora slušati `PORT` na `0.0.0.0`. Po potrebi konfigurirajte dopušteno ishodište klijenta (CORS). |
| **Upravljani PostgreSQL** | Baza stvorena u istoj Render regiji kao i web-usluga; početnu shemu primijenite na **novu** bazu prije posluživanja zahtjeva za prijave. | Podatke veze dohvatite iz nadzorne ploče baze i čuvajte ih privatnima. Kasnije migracije primjenjujte zasebno umjesto ponovnog izvođenja početne skripte. |
| **Pružatelj obavijesti** | Integraciju konfigurirajte u poslužiteljskom dijelu samo ako pripada odobrenom projektu i implementirana je. | Poslužiteljski pristupni podatak unesite kroz tajne postavke platforme; dokumentirajte njegov **naziv**, nikada vrijednost. |

#### Koraci izvođenja na Renderu

1. **Stvaranje baze podataka:** U nadzornoj ploči Rendera stvorite PostgreSQL bazu u regiji u kojoj će se izvoditi poslužiteljski dio. Interni URL baze čuvajte za poslužiteljski dio; nemojte ga unositi u dokumentaciju ni u postavke klijenta.
2. **Inicijalizacija produkcijske sheme:** Ako baza dopušta vanjsku vezu, iz pouzdanog terminala u korijenu repozitorija povežite se uputom za PSQL iz nadzorne ploče. U otvorenoj `psql` sesiji pokrenite:

   ```sql
   \i backend/db/001_create_schema.sql
   \dt
   ```

   *Napomena:* Naredbu za povezivanje koja sadrži pristupne podatke nikada ne kopirajte u repozitorij ni dokumentaciju. Ako su vanjske veze onemogućene, opišite stvarni ovlašteni mehanizam migracije svog tima. Početnu skriptu ne pokrećite ponovno pri svakom postavljanju.
3. **Pokretanje poslužiteljske web-usluge:** Povežite repozitorij, odaberite Node.js okruženje i odgovarajuću granu, postavite korijenski direktorij na `backend/`, naredbu izgradnje na `npm ci` i naredbu pokretanja na `npm start`. U privatne postavke okruženja dodajte `DATABASE_URL` s **internim** URL-om baze. Poslužitelj konfigurirajte da sluša na `0.0.0.0` i portu iz varijable `PORT`. Nakon uspješnog postavljanja zabilježite javnu adresu usluge (npr. `https://crisismap-api.onrender.com`).
4. **Izgradnja klijentskog web-mjesta:** Povežite repozitorij, odaberite `frontend/`, naredbu izgradnje `npm ci && npm run build` i mapu objave `dist/`. Prije izgradnje postavite `VITE_API_BASE_URL` na **javnu adresu poslužitelja**; ovdje nikada ne koristite privatni URL baze. Zabilježite generiranu javnu adresu web-mjesta.
5. **Povezivanje i verifikacija produkcijskog rada:** Ako poslužitelj ograničava ishodišta preglednika, dopustite javnu adresu statičkog web-mjesta i ponovno postavite poslužiteljski dio. Otvorite javnu adresu klijenta, podnesite prijavu i ponovno je dohvatite kako biste potvrdili trajno spremanje. Zabilježite javni URL web-mjesta u `README.md`.
6. **Održavanje:** Ako postavljanje ne uspije, pregledajte izlaz i zapise postavljanja usluge u Renderu. Za novu reviziju koristite konfigurirano automatsko postavljanje iz repozitorija ili ručnu radnju postavljanja iz nadzorne ploče. Pristupni podatak za obavijesti konfigurirajte samo u poslužiteljskom dijelu i samo ako je ta funkcionalnost stvarno implementirana. Automatsko pokretanje postavljanja nakon promjene u repozitoriju samo po sebi nemojte nazivati kontinuiranim postavljanjem (CD) ako projekt nema definiran automatizirani tijek provjera koji promjena mora uspješno proći prije postavljanja.

Tim zamjenjuje ogledne nazive direktorija, naredbe, mehanizam sheme i postavke vrijednostima koje rade u vlastitom repozitoriju. Ako obavijesti nisu dostupne, integraciju dokumentirajte iskreno; uspješno podnošenje prijave ne dokazuje uspješnu dostavu obavijesti.

Ako aplikacija uključuje moderatorsko sučelje, navedite njegovu putanju i objasnite kako se moderatorski račun dodjeljuje kroz aplikaciju ili odobreni postupak tima. Nemojte objaviti zadanu lozinku. Oporavak baze podataka opisujte samo ako je tim uspostavio uporabljiv postupak sigurnosnog kopiranja; nemojte implicirati da upravljani smještaj automatski jamči oporavak.

**Analiza primjera:** API i obrada obavijesti ostaju u jednom postavljanju poslužiteljskog dijela, kao na dijagramu. Postupak razlikuje Renderovu internu vezu s bazom od javnog URL-a poslužitelja koji koristi klijent te uspostavlja shemu prije obrade prijava. Izgradnja klijenta dobiva samo konfiguraciju vidljivu pregledniku; tajni podaci baze i pružatelja ostaju u poslužiteljskom dijelu. Render je samo jedan nastavni primjer pa druga platforma zahtijeva opis vlastitog postupka.
</details>

---

>**Završna provjera:** Upute za lokalno pokretanje omogućuju podizanje cjelokupnog sustava iz čiste kopije repozitorija bez neprenosivih lokalnih staza. Dijagram razmještaja prikazuje samo stvarno produkcijsko okruženje, njegove čvorove i protokole. Poveznica na javnu aplikaciju provjerena je, vodi na postavljenu verziju programa i jednaka je onoj u `README.md`. Administracijske upute opisuju samo mogućnosti koje tim stvarno pruža. Nijedna datoteka dokumentacije, konfiguracijski primjer niti zapis promjene ne sadrži stvarne pristupne podatke, privatne tokene ili lozinke.
