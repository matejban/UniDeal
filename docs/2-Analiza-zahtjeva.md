# 2. Analiza zahtjeva

**Cilj:** Iz odobrenog opsega projekta izvesti prepoznatljive, prioritetizirane i provjerljive zahtjeve. Zahtjevi se mogu mijenjati; pri završnoj predaji moraju odražavati dogovorenu aplikaciju.

## 2.1 Funkcijski zahtjevi

**Cilj:** Navesti što aplikacija mora omogućiti korisnicima, odakle pojedina mogućnost proizlazi i koji se opažljivi rezultat smatra prihvaćanjem.

### Registracija, prijava i profil

| ID | Opis | Prioritet | Izvor | Kriteriji prihvaćanja |
|---------------|---------------|---------------|---------------|---------------|
| F-001 | Sustav omogućuje prijavu studenata studentskim Microsoft računom (Microsoft Entra ID, OAuth 2.0), a partnera Google računom ili e-mailom i lozinkom. | Visok | Projektni zadatak, pogl. 2 i 6; odluka tima (vidi 2.5) | Student odabirom „Prijava studentskim Microsoft računom” i uspješnom autentifikacijom bude prijavljen; prijava Microsoft računom s domene koja nije na popisu hrvatskih visokih učilišta odbija se uz poruku. Partner se prijavljuje Googleom ili e-mailom i lozinkom; račun registriran e-mailom aktivan je tek nakon potvrde adrese poveznicom iz e-maila. Pri prvoj prijavi stvara se novi račun, a pri sljedećoj se prijavljuje postojeći. |
| F-002 | Uloga se određuje načinom prijave: korisnik prijavljen studentskim Microsoft računom je student, a korisnik prijavljen Googleom ili e-mailom partner. Nakon prve prijave korisnik dopunjuje osnovne podatke. Uloga administratora ne može se dobiti prijavom; dodjeljuje se ručno u bazi. | Visok | Projektni zadatak, pogl. 2; odluka tima (vidi 2.5) | Novi korisnik ne može koristiti mogućnosti za prijavljene korisnike dok ne dopuni osnovne podatke; uloga određuje koje mu se mogućnosti prikazuju. Nijedan način prijave ne daje ulogu administratora. |
| F-003 | Status studenta potvrđuje se prijavom studentskim Microsoft računom s domene hrvatskog visokog učilišta. | Visok | Projektni zadatak, pogl. 2; odluka tima (vidi 2.5) | Student prijavljen Microsoft računom s domene s popisa dopuštenih domena odmah ima status „potvrđen”. Prijava Microsoft računom s domene koja nije na popisu odbija se uz poruku. |
| F-004 | Korisnik koji nije potvrđeni student (neprijavljeni posjetitelj ili partner) može pregledavati ponude, ali ne može generirati kupone. | Visok | Projektni zadatak, pogl. 2 | Posjetitelj i partner vide ponude; pokušaj generiranja kupona vraća poruku da je potrebna prijava studentskim računom i kupon se ne stvara. |
| F-005 | Korisnik može uređivati svoj profil i deaktivirati vlastiti račun. | Srednji | Projektni zadatak, pogl. 2 | Izmijenjeni podaci vidljivi su nakon spremanja. Nakon deaktivacije korisnik se više ne može prijaviti, a njegove ponude ili recenzije nisu javno vidljive. |
| F-032 | Sustav prikazuje uvjete korištenja platforme koje korisnik prihvaća pri prvoj prijavi. Uvjeti navode da student pri korištenju kupona pokazuje studentsku iskaznicu (X-icu) i da partner smije odbiti popust ako je ne pokaže. | Srednji | Odluka tima (ublažavanje ograničenja uz AS-01) | Uvjeti korištenja dostupni su na zasebnoj stranici i iz podnožja svake stranice. Korisnik ne može nastaviti nakon prve prijave dok ih ne prihvati. Kupon (F-020) i zaslon za potvrdu kupona (F-014) prikazuju napomenu o pokazivanju X-ice. |

### Partner i ponude

| ID | Opis | Prioritet | Izvor | Kriteriji prihvaćanja |
|---------------|---------------|---------------|---------------|---------------|
| F-006 | Partner pri registraciji unosi podatke o poslovnom subjektu: naziv, OIB, adresu, kontakt i kategoriju djelatnosti. | Visok | Projektni zadatak, pogl. 2 | Profil se ne može spremiti bez obaveznih polja; OIB koji nema 11 znamenki ili ne prolazi kontrolnu znamenku se odbija. |
| F-007 | Profil partnera postaje javan tek nakon odobrenja administratora i aktivacije pretplate. | Visok | Projektni zadatak, pogl. 2 | Profil i ponude neodobrenog partnera ili partnera bez aktivne pretplate ne pojavljuju se u pretrazi ni na karti. |
| F-008 | Partner plaća mjesečnu ili godišnju pretplatu kreditnom karticom putem Stripea. | Visok | Projektni zadatak, pogl. 3 i 6 | Nakon uspješnog plaćanja u Stripeovu testnom načinu pretplata partnera ima status „aktivna” i datum isteka; neuspjelo plaćanje ne aktivira pretplatu. |
| F-009 | Kada pretplata istekne, ponude partnera prestaju biti javno vidljive. | Visok | Projektni zadatak, pogl. 3 | Dan nakon isteka pretplate ponude partnera ne pojavljuju se u pretrazi ni na karti; nakon obnove ponovno su vidljive. |
| F-010 | Partner uređuje javni profil: naziv, logo ili fotografiju, adresu, telefon, radno vrijeme, opis. Javni profil prikazuje i popis aktivnih ponuda partnera. | Srednji | Projektni zadatak, pogl. 3 | Promjene su vidljive na javnom profilu partnera odmah nakon spremanja; na profilu su navedene sve aktivne ponude partnera. |
| F-011 | Partner izrađuje, uređuje i briše ponude s nazivom, opisom, kategorijom, iznosom ili postotkom popusta, rokom trajanja, uvjetima korištenja i fotografijom. | Visok | Projektni zadatak, pogl. 3 | Partner može imati više ponuda; ponuda bez obaveznih polja ili s rokom u prošlosti ne može se aktivirati. Obrisana ponuda više se ne prikazuje. |
| F-012 | Ponuda ima status nacrt, aktivna ili istekla; istekle ponude sustav automatski skriva iz pretrage. | Visok | Projektni zadatak, pogl. 3 | Nacrt nije javno vidljiv. Ponuda kojoj je prošao rok trajanja automatski dobiva status „istekla” i ne prikazuje se u pretrazi. |
| F-013 | Sustav pretvara adresu partnera u koordinate i prikazuje lokaciju partnera na karti. | Visok | Projektni zadatak, pogl. 3 i 6 | Nakon spremanja adrese partner se prikazuje kao oznaka na karti na toj adresi. Ako adresa nije pronađena, partner dobiva poruku i lokaciju može ručno označiti. |
| F-014 | Partner potvrđuje korištenje popusta unosom koda s kupona ili skeniranjem QR koda. | Visok | Projektni zadatak, pogl. 3 | Valjan kupon nakon potvrde dobiva status „iskorišten” s vremenom iskorištenja; ponovna potvrda istog kupona ili kupona za ponudu drugog partnera se odbija. |
| F-015 | Partner ima pregled osnovne statistike: broj pregleda i iskorištenja po ponudi te prosječnu ocjenu. | Srednji | Projektni zadatak, pogl. 3 | Za svaku ponudu prikazan je broj pregleda i iskorištenih kupona; brojevi se povećavaju nakon novog pregleda ili iskorištenja. Prikazana prosječna ocjena jednaka je prosjeku ocjena iz recenzija partnera. |

### Pretraga i karta (bez prijave)

| ID | Opis | Prioritet | Izvor | Kriteriji prihvaćanja |
|---------------|---------------|---------------|---------------|---------------|
| F-016 | Korisnik, i bez prijave, pretražuje i filtrira ponude prema kategoriji, gradu, visini popusta i roku trajanja. | Visok | Projektni zadatak, pogl. 4; odluka tima o pregledu bez prijave | Primjenom filtara prikazuju se samo aktivne ponude koje zadovoljavaju sve odabrane uvjete. Popis ponuda dostupan je i neprijavljenom korisniku. |
| F-017 | Korisnik sortira ponude prema blizini ili prosječnoj ocjeni. | Srednji | Projektni zadatak, pogl. 4 | Popis je poredan od najbliže prema najudaljenijoj, odnosno od najviše prema najnižoj ocjeni. |
| F-018 | Sustav prikazuje partnere i ponude na interaktivnoj karti oko lokacije korisnika. | Visok | Projektni zadatak, pogl. 4 i 6 | Uz dopuštenje lokacije karta je centrirana na korisnika i prikazuje oznake partnera u okolici; odabirom oznake otvara se profil partnera. Bez dopuštenja korisnik ručno odabire grad. Karta je dostupna i neprijavljenom korisniku. |

### Student

| ID | Opis | Prioritet | Izvor | Kriteriji prihvaćanja |
|---------------|---------------|---------------|---------------|---------------|
| F-019 | Student sprema ponude i partnere u favorite. | Nizak | Projektni zadatak, pogl. 4 | Spremljena ponuda ili partner pojavljuje se na popisu favorita i može se ukloniti. |
| F-020 | Potvrđeni student za odabranu ponudu generira digitalni kupon s jedinstvenim kodom i QR kodom. Kupon vrijedi do isteka ponude. | Visok | Projektni zadatak, pogl. 4 | Za aktivnu ponudu prikazuje se kupon s kodom i QR kodom koji sadrži taj kod; za isteklu ponudu kupon se ne može generirati. Neiskorišten kupon nakon isteka ponude dobiva status „istekao” i ne može se potvrditi. |
| F-021 | Sustav poštuje ograničenje broja korištenja ponude (npr. jednom po studentu). | Visok | Projektni zadatak, pogl. 3 i 4 | Student koji je već iskoristio ponudu s ograničenjem „jednom po studentu” ne može za nju dobiti novi kupon i dobiva poruku o razlogu. |
| F-022 | Student ima pregled povijesti svojih kupona. | Srednji | Projektni zadatak, pogl. 4 | Popis prikazuje sve kupone studenta s ponudom, partnerom, datumom i statusom (izdan, iskorišten, istekao). |
| F-023 | Nakon iskorištenja ponude student može ocijeniti partnera ocjenom od 1 do 5 i napisati recenziju. | Visok | Projektni zadatak, pogl. 4 | Mogućnost recenzije prikazuje se samo za iskorištene kupone; pokušaj recenziranja bez iskorištenog kupona se odbija. Nova ocjena mijenja prosječnu ocjenu partnera. |
| F-024 | Student se pretplaćuje na kategorije ili partnere i e-mailom prima obavijesti o novim ponudama i ponudama koje uskoro istječu. | Srednji | Projektni zadatak, pogl. 4 | Nakon aktivacije nove ponude u pretplaćenoj kategoriji ili kod pretplaćenog partnera student prima e-mail; za ponude kojima rok istječe za 3 dana šalje se podsjetnik. Pretplata se može otkazati. |

### Administrator

| ID | Opis | Prioritet | Izvor | Kriteriji prihvaćanja |
|---------------|---------------|---------------|---------------|---------------|
| F-025 | Administrator odobrava ili odbija profile partnera, a partner o tome dobiva e-mail obavijest. | Visok | Projektni zadatak, pogl. 5 i 6 | Administrator vidi popis profila na čekanju; nakon odobrenja ili odbijanja status profila se mijenja i partneru stiže e-mail. |
| F-026 | Administrator upravlja korisničkim računima, uključujući deaktivaciju. | Visok | Projektni zadatak, pogl. 5 | Administrator može pregledati i deaktivirati račun; deaktivirani korisnik se ne može prijaviti. Korisnik bez uloge administratora nema pristup ovim radnjama. |
| F-027 | Administrator upravlja kategorijama ponuda. | Srednji | Projektni zadatak, pogl. 5 | Administrator može dodati, preimenovati i ukloniti kategoriju; nova kategorija dostupna je partneru pri izradi ponude i u filtru pretrage. |
| F-028 | Administrator uklanja neprimjerene ponude i recenzije. | Srednji | Projektni zadatak, pogl. 5 | Uklonjena ponuda ili recenzija više nije javno vidljiva. |
| F-029 | Administrator određuje cijenu mjesečne i godišnje pretplate za partnere. | Srednji | Projektni zadatak, pogl. 5 | Nova cijena primjenjuje se na sljedeće plaćanje pretplate. |
| F-030 | Administrator ima pregled statistike platforme: broj studenata i partnera, aktivnih ponuda, iskorištenih kupona po kategorijama i gradovima te prihod od pretplata. | Srednji | Projektni zadatak, pogl. 5 | Prikazani brojevi odgovaraju podacima u bazi za odabrano razdoblje. |
| F-031 | Administrator izvozi odabrane podatke i izvještaje u CSV ili PDF. | Nizak | Projektni zadatak, pogl. 5 | Preuzeta datoteka otvara se u uobičajenom programu i sadrži iste podatke kao prikaz u aplikaciji. |

## 2.2 Nefunkcijski zahtjevi

**Cilj:** Odrediti važna svojstva kvalitete i uvjete rada odobrene aplikacije na način koji tim može razumno provjeriti.

| ID | Opis | Prioritet | Izvor | Način provjere |
|---------------|---------------|---------------|---------------|---------------|
| NF-01 | Pretraga i prikaz popisa ponuda završavaju unutar 2 s pri 50 istodobnih korisnika. | Srednji | Procjena tima | Mjerenje alatom za opterećenje (npr. k6) na postavljenoj aplikaciji. |
| NF-02 | Sav promet između preglednika i poslužitelja ide preko HTTPS-a. | Visok | Sigurnost | Pregled: HTTP zahtjev se preusmjerava na HTTPS. |
| NF-03 | Svaka zaštićena radnja provjerava ulogu korisnika (student, partner, administrator) na poslužitelju ili u bazi (RLS), a ne samo u sučelju. | Visok | Sigurnost | Testni scenarij: poziv administratorske ili partnerske radnje s računom studenta se odbija ili ne vraća podatke, i kada se zahtjev šalje izravno, mimo sučelja. |
| NF-04 | Tajni ključevi (Google, Stripe, baza, e-mail servis) ne nalaze se u repozitoriju, nego u varijablama okruženja. | Visok | Sigurnost | Pregled repozitorija i povijesti promjena. |
| NF-05 | Sustav ne pohranjuje podatke o platnim karticama; obrađuje ih isključivo Stripe. | Visok | Sigurnost, Stripe | Pregled sheme baze. |
| NF-06 | Osobni podaci prikupljaju se samo u opsegu potrebnom za rad platforme, a lokacija korisnika se ne pohranjuje. | Visok | GDPR | Pregled sheme baze i obrazaca za unos. |
| NF-07 | Kod kupona je jedinstven i nije ga moguće pogoditi iz prethodnih kodova. | Visok | Projektni zadatak, pogl. 4; procjena tima | Test: 10 000 generiranih kodova bez ponavljanja; kodovi nisu slijedni brojevi. |
| NF-08 | Sučelje je uporabljivo na mobitelu (širina od 360 px) i na računalu. | Visok | Uporabljivost | Pregled ključnih tijekova (pretraga, kupon, potvrda kupona) u mobilnom prikazu preglednika. |
| NF-09 | Sučelje zadovoljava osnovne smjernice pristupačnosti: dovoljan kontrast, opisi slika i upravljanje tipkovnicom. | Srednji | Pristupačnost | Lighthouse ocjena pristupačnosti od najmanje 90 na glavnim stranicama; ručni prolaz kroz pretragu i generiranje kupona samo tipkovnicom, uz vidljiv fokus. |
| NF-10 | Nedostupnost vanjskog servisa ne ruši ostatak aplikacije (npr. bez karte popis ponuda i dalje radi). | Srednji | Pouzdanost | Testni scenarij s isključenim ključem za Google Maps. |
| NF-11 | Sučelje je na hrvatskom jeziku, a datumi i iznosi prikazuju se u hrvatskom formatu (EUR). | Srednji | Uporabljivost | Pregled sučelja. |
| NF-12 | Programsko rješenje je objektno orijentirano i slojevito (prikaz, poslovna logika, pristup podacima). | Visok | Pravila kolegija | Pregled koda i usporedba s dijagramom razreda. |

## 2.3 Dionici i akteri

**Cilj:** Utvrditi uloge koje utječu na zahtjeve i razlikovati dionike od aktera koji komuniciraju s aplikacijom.

| ID uloge ili aktera | Odnos prema sustavu | Relevantni zahtjevi |
|------------------------|------------------------|------------------------|
| A-01 Posjetitelj | Akter; bez prijave pretražuje ponude, pregledava kartu i profile partnera te može pokrenuti registraciju ili prijavu. Za kupone, favorite, recenzije i obavijesti mora se prijaviti. | F-001, F-016 – F-018 |
| A-02 Student | Akter; uz mogućnosti posjetitelja sprema favorite, generira kupone, ostavlja recenzije i prima obavijesti. Dok status nije potvrđen, ne može generirati kupone. | F-002 – F-005, F-016 – F-024, F-032 |
| A-03 Partner | Akter; upravlja profilom i ponudama, plaća pretplatu, potvrđuje kupone, prati statistiku. | F-002, F-005 – F-015, F-032 |
| A-04 Administrator | Akter; odobrava partnere, upravlja korisnicima, kategorijama, sadržajem i cijenama, prati statistiku. | F-025 – F-031 |
| A-05 Pružatelji identiteta (Microsoft Entra ID, Google) | Vanjski sustav (akter); potvrđuje identitet studenata (Microsoft) i partnera (Google). | F-001, F-003 |
| A-06 Google Maps API | Vanjski sustav (akter); karta i geokodiranje adresa. | F-013, F-018 |
| A-07 Stripe | Vanjski sustav (akter); naplata pretplate i obavijest o plaćanju. | F-008, F-009 |
| A-08 Resend | Vanjski sustav (akter); dostava e-mail poruka. | F-024, F-025 |
| A-09 Vremenski okidač | Sustavski akter; dnevno pokreće automatske radnje (istek ponuda, kupona i pretplata, podsjetnici). | F-009, F-012, F-020, F-024 |
| D-01 Nastavnik i asistent kolegija | Dionik, nije akter aplikacije; odobravaju opseg projekta i daju povratnu informaciju o zahtjevima na kontrolnim točkama. | Odjeljak 2.7 |

------------------------------------------------------------------------

## 2.4 Ograničenja i pretpostavke

**Cilj:** Zabilježiti projektno specifične granice i pretpostavke koje utječu na zahtjeve ili oblikovanje, zajedno s njihovim izvorom i praktičnom posljedicom.

| ID | Tip | Opis ograničenja ili pretpostavke | Izvor | Inženjerska posljedica / Provjera |
|---------------|---------------|---------------|---------------|---------------|
| C-01 | Ograničenje | Prijava putem Supabase Auth: studenti studentskim Microsoft računom (Microsoft Entra ID, OAuth 2.0), partneri Google računom (OAuth 2.0) ili e-mailom i lozinkom. | Projektni zadatak, pogl. 2 i 6; odluka tima (vidi 2.5) | Prijavu obavlja Supabase Auth; lozinke partnera čuva Supabase Auth, a ne vlastite tablice aplikacije. Microsoft aplikacija prima sve organizacijske račune (tenant `organizations`), a dopuštene domene provjeravaju se u `/auth/callback`. Korisnik se u bazi povezuje sa Supabase Auth identifikatorom, a uloga i status studenta vode se u vlastitoj tablici profila. |
| C-02 | Ograničenje | Naplata pretplate isključivo kreditnom karticom putem Stripea. | Projektni zadatak, pogl. 3 i 6 | Status pretplate ažurira se iz Stripeovih obavijesti (webhook); demonstracija se radi u testnom načinu. |
| C-03 | Ograničenje | Karta i geokodiranje putem Google Maps API-ja. | Projektni zadatak, pogl. 6 | API ključ ograničava se na domenu aplikacije; koordinate partnera spremaju se u bazu da se geokodiranje ne ponavlja. |
| C-04 | Ograničenje | Obavijesti se šalju e-mailom putem servisa Resend. | Projektni zadatak, pogl. 6; odluka tima | Slanje se odvija izvan glavnog zahtjeva korisnika; neuspjelo slanje ne prekida radnju. |
| C-05 | Ograničenje | Tehnološki stog: Next.js (TypeScript) i Tailwind CSS, Supabase (Postgres, Auth, Storage), postavljanje na Vercel. | Odluka tima | Klijentski i poslužiteljski dio nalaze se u jednom Next.js projektu; pristup podacima ograničava se RLS pravilima u bazi (NF-03). Detalji u poglavlju 4. |
| C-06 | Ograničenje | Aplikacija mora biti javno dostupna na internetu; za Iteraciju 1 postavljena je inačica s prijavom i barem jednim funkcionalnim korisničkim tijekom. | Pravila kolegija | Postavljanje na Vercel od početka razvoja. Za Iteraciju 1 prioritet imaju F-001, F-002 i jedan cjeloviti tijek (npr. F-011, F-016, F-020). Provjera: otvaranje javnog URL-a s uređaja izvan razvojne okoline. |
| AS-01 | Pretpostavka | Status studenta može se dovoljno pouzdano prepoznati prema domeni e-mail adrese. | Procjena tima | Popis dopuštenih domena vodi se u bazi (tablica `allowed_student_domains`, početno 165 domena hrvatskih visokih učilišta provjerenih kod Microsofta). Ako se javi student s valjanom studentskom adresom izvan popisa, domena se dodaje ručno. Poznato ograničenje: domena ne razlikuje studenta od djelatnika iste ustanove (npr. i nastavnici FER-a imaju adresu `@fer.hr`), pa djelatnik može dobiti status studenta. Ublažavanje: student pri korištenju kupona pokazuje partneru studentsku iskaznicu (X-icu), što je navedeno u uvjetima korištenja (F-032). Pouzdanije rješenje opisano je u [7.3 Budući rad](7-Zakljucak-i-buduci-rad.md#73-budući-rad). |
| AS-02 | Pretpostavka | Partner pri potvrdi kupona ima uređaj s internetskom vezom i prijavljen je u aplikaciju. | Procjena tima | Potvrda kupona bez internetske veze nije u opsegu. Provjeriti s barem jednim partnerom pri ispitivanju F-014. |
| AS-03 | Pretpostavka | Adrese partnera dovoljno su točne za geokodiranje. | Procjena tima | Ako geokodiranje ne uspije, partner ručno označava lokaciju (F-013). |
| AS-04 | Pretpostavka | Student kupon predočuje partneru na zaslonu mobitela. | Procjena tima | Kupon i QR kod moraju biti čitljivi na mobilnom zaslonu (NF-08); ispis kupona nije potreban. |

------------------------------------------------------------------------

## 2.5 Značajne promjene zahtjeva

**Cilj:** Sačuvati razlog promjena koje mijenjaju dogovoreni opseg, prioritet ili kriterije prihvaćanja.

| Datum | ID zahtjeva | Promjena i razlog  | Dogovoreno s / dokaz |
|-------|-------------|--------------------|----------------------|
| 26. 10. 2026. | F-001, F-002, F-003, F-004, C-01, A-05 | Studenti se prijavljuju studentskim Microsoft računom (Microsoft Entra ID), a partneri Googleom ili e-mailom i lozinkom; uloga se određuje načinom prijave. Razlog: studentske adrese hrvatskih visokih učilišta uglavnom su Microsoft računi, pa prijava ujedno potvrđuje status studenta, bez zasebne poveznice e-mailom. Prijava putem AAI@EduHr razmotrena je i odgođena (vidi 7.3). | Odluka tima; potvrditi s asistentom |
| 26. 10. 2026. | F-032, AS-01 | Dodani uvjeti korištenja s obvezom pokazivanja studentske iskaznice (X-ice) pri korištenju kupona. Razlog: prepoznavanje studenta po domeni e-mail adrese ne razlikuje studenta od djelatnika iste ustanove (AS-01), pa partner pri korištenju kupona provjerava status. | Odluka tima |

------------------------------------------------------------------------

## 2.6 Sljedivost zahtjeva

**Cilj:** Osigurati dvosmjernu sljedivost — povezati zahtjeve s opisanim ponašanjem, dijelovima sustava koji ih ostvaruju te ispitivanjem ili drugom provjerom.

Obrasci uporabe (poglavlje 3) i ispitni slučajevi (poglavlje 5) još nisu izrađeni, pa su te poveznice *na čekanju*. Tablica će se dopunjavati za ostale zahtjeve kako nastaju obrasci uporabe i implementacija.

| ID zahtjeva | Obrazac uporabe / modul | Arhitekturna realizacija | Ispitivanje ili provjera |
|------------------|------------------|------------------|------------------|
| F-001 | *na čekanju* (poglavlje 3) | `MicrosoftLoginButton`, `GoogleLoginButton` i obrazac za e-mail na stranici `/prijava`; `/auth/callback` (provjera domene), `/auth/confirm`; Supabase Auth; `src/lib/auth.ts` | *na čekanju* (poglavlje 5) |
| F-002, F-003 | *na čekanju* (poglavlje 3) | Tablica `profiles` i okidač `handle_new_user` (uloga prema načinu prijave), SQL funkcija `student_institution` nad tablicom `allowed_student_domains` (`supabase/migrations/`); `User.isVerifiedStudent()`, stranica `/student` | Ručna provjera prijave računima `@fer.hr`; ispitni slučajevi *na čekanju* (poglavlje 5) |
| F-012 | *na čekanju* (poglavlje 3) | `Offer.isActive()`; automatski istek ponuda još nije ostvaren | *na čekanju* (poglavlje 5) |
| F-016 | *na čekanju* (poglavlje 3) | `OfferService.search()`, stranica `/ponude`; trenutačno s lažnim podacima | *na čekanju* (poglavlje 5) |
| F-018 | *na čekanju* (poglavlje 3) | Stranica `/karta`; Google Maps još nije povezan | *na čekanju* (poglavlje 5) |
| NF-03 | — | `src/proxy.ts` traži prijavu za `/student`, `/partner` i `/admin`; RLS na tablicama `profiles` (korisnik čita samo svoj profil, ulogu ne može mijenjati) i `allowed_student_domains`; provjera uloge na stranicama `/partner` i `/admin` još nije ostvarena | *na čekanju* (poglavlje 5) |

------------------------------------------------------------------------

## 2.7 Pregled zahtjeva

**Cilj:** Zabilježiti važne povratne informacije o zahtjevima i odluke koje iz njih proizlaze na kontrolnim točkama projekta, u 7. i 14. tjednu.

| Kontrolna točka | Povratna informacija ili nalaz | Odluka o zahtjevu ili opsegu |
|------------------------|------------------------|------------------------|
| Iteracija 1 | — | — |
| Demo 2 | — | — |
| Završni pregled | — | — |

------------------------------------------------------------------------

> **Završna provjera:** Zahtjevi su aktualni, provjerljivi i povezani. Svaki važan zahtjev moguće je pratiti od njegova opisa i ponašanja preko mjesta realizacije u sustavu do odgovarajućeg ispitivanja ili druge provjere.
