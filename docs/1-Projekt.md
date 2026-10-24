# 1. Opseg projekta

**Cilj:** Objasniti odobreni projektni zadatak vlastitim riječima tima. Čitatelj treba razumjeti problem, ciljane korisnike, cilj projekta i njegove granice bez prethodnog čitanja detaljnih zahtjeva.

## 1.1 Problem i cilj projekta

**Cilj:** Jasno razgraničiti problem koji se rješava od predloženog rješenja i stvarne koristi za korisnika.

Studenti imaju pravo na brojne popuste i pogodnosti, ali ih je teško pronaći: ponude su razbacane po web-stranicama, društvenim mrežama i letcima i često su zastarjele. Partneri (trgovine, kafići, restorani, teretane, servisi, kulturne ustanove) nemaju jednostavan način da dopru do studentske populacije ni da saznaju koliko se njihove ponude stvarno koriste.

Cilj projekta je web platforma UniDeal koja povezuje studente i partnere na jednom mjestu. Studenti besplatno pretražuju aktualne ponude, vide ih na karti i koriste ih putem digitalnog kupona s QR kodom koji partner potvrđuje. Partneri uz mjesečnu ili godišnju pretplatu objavljuju ponude i vide broj pregleda i iskorištenja. Očekivana korist je pregled ponuda na jednom mjestu, zabilježeno stvarno korištenje popusta i recenzije koje mogu ostaviti samo studenti koji su ponudu iskoristili.

<details>
<summary><strong>Očekivane koristi i potkrepljujući dokazi</strong></summary>

**Primjer — CrisisMap:** „Tijekom teških vremenskih prilika građaninu mogu trebati prijave kriznih događaja relevantne za njegovu lokaciju. CrisisMap ima za cilj prikazati lokacijski relevantne prijave kriznih događaja na karti kako bi ih građanin mogao pronaći na jednom mjestu.” Time su navedeni problem, ciljani korisnik, predložena mogućnost i očekivana korist. Ne tvrdi se da je izmjereno smanjenje vremena reagiranja niti da aplikacija ima integraciju sa službom za hitne intervencije. Tim i dalje mora opisati opseg odobren za vlastiti projekt.

„Aplikacija smanjuje vrijeme odgovora na krizni događaj za 30 % na temelju simulacija.” Broj očekivanu korist čini konkretnijom, ali odmah zahtijeva provjeru: **gdje je simulacija i kako je postotak izračunan?** Ako takav dokaz ne postoji, očekivanu korist navedite bez brojčanog rezultata.

</details>

## 1.2 Ciljani korisnici i dionici

**Cilj:** Utvrditi osobe, uloge i organizacije čije potrebe i interesi određuju projektni zadatak.

| Skupina korisnika ili dionika | Potreba ili interes relevantan za ovaj projekt |
| --- | --- |
| Student | Pronaći aktualne popuste prema kategoriji, gradu i blizini, spremiti favorite, generirati kupon i ocijeniti iskorištenu ponudu. Platformu koristi besplatno; kupone može generirati tek kada potvrdi status studenta studentskom e-mail adresom. |
| Partner | Objaviti ponude, potvrditi korištenje kupona (kod ili QR) i pratiti broj pregleda, iskorištenja i prosječnu ocjenu. Plaća mjesečnu ili godišnju pretplatu; profil postaje javan nakon odobrenja administratora i aktivacije pretplate. |
| Administrator | Odobravati partnere, upravljati korisnicima, kategorijama i sadržajem, uklanjati neprimjerene ponude i recenzije, određivati cijenu pretplate te pregledavati i izvoziti statistiku (CSV ili PDF). |

<details>
<summary><strong>Korisnici, dionici i neobavezna persona</strong></summary>

**Primjer — CrisisMap:**

| Skupina korisnika ili dionika | Potreba ili interes relevantan za ovaj projekt |
| --- | --- |
| Građanin | Pronaći informacije o obližnjim kriznim događajima i podnijeti prijavu kriznog događaja s lokacijom. |
| Koordinator pomoći | Pregledati prijave relevantne za područje i dostupne resurse, ako je koordinacija unutar odobrenog opsega. |
| Regulatorno tijelo / Agencija za zaštitu podataka (Dionik) | Zahtijeva osiguravanje anonimnosti prijavitelja i zaštitu osobnih podataka (npr. usklađenost s GDPR-om). Ovaj dionik ne koristi aplikaciju, ali definira ograničenja sustava. |

Riječ je o dvjema različitim potrebama, a ne o dvjema izmišljenim biografijama. Akter komunicira s aplikacijom; demonstrator na kolegiju kojem je rezultat zanimljiv ne mora biti akter aplikacije. Koristite uloge i ovlasti iz svojeg odobrenog zadatka. Persona je neobavezna i korisna je kada pomaže riješiti konkretno projektno pitanje.

**Neobavezni primjer persone:** Ana, koordinatorica pomoći, treba aktualne informacije o resursima kako bi mogla rasporediti pomoć. To može pomoći kada tim odlučuje koje informacije koordinator treba vidjeti prve. Personu opišite samo ako objašnjava projektnu odluku; popis izmišljenih biografija nije obavezni rezultat kolegija.

</details>

## 1.3 Granice projekta

**Cilj:** Jasno definirati granice sustava — što je obuhvaćeno odobrenim zadatkom, što je svjesno izostavljeno ili odgođeno te o kojim vanjskim uslugama sustav izravno ovisi.

**Uključeno:** Prijava Google računom i odabir uloge (student, partner, administrator); potvrda statusa studenta studentskom e-mail adresom; profili partnera i ponude sa statusima nacrt, aktivna i istekla; pretraga, filtriranje i prikaz ponuda na karti; favoriti; kuponi s kodom i QR kodom te partnerska potvrda korištenja; ocjene i recenzije nakon iskorištenja; pretplata partnera; e-mail obavijesti; administratorski panel, statistika i izvoz izvještaja.  
**Izvan opsega ili odgođeno:** [Tim treba dogovoriti, npr. plaćanje samih popusta kroz platformu ili mobilnu aplikaciju.] 
**Vanjske ovisnosti:** Google OAuth 2.0 (prijava), Google Maps API (karta i geokodiranje), Stripe (naplata pretplate), servis za slanje e-maila (Resend), Supabase (baza, autentifikacija i pohrana datoteka) i Vercel (smještaj aplikacije).

<details>
<summary><strong>Primjer početne granice projekta</strong></summary>

**Primjer — CrisisMap:**  
**Uključeno:** Podnošenje prijave kriznog događaja s lokacijom i pregled prijava na karti.  
**Isključeno:** Automatsko angažiranje hitnih službi; prikaz prijave ne odobrava niti pokreće službenu intervenciju.  
**Vanjska ovisnost:** Pružatelj kartografskih usluga omogućuje prikaz karte; aplikacija ostaje odgovorna za vlastite podatke o prijavama.

Ovo je konkretna granica jer razdvaja prikaz informacija od službenog odgovora hitnih službi i određuje koji sustav osigurava kartu. Izuzeće i ovisnost dio su **nastavnog scenarija**, a ne tvrdnja o tome što objavljena aplikacija stvarno implementira; te činjenice određuju odobreni opseg i stvarna aplikacija tima.

**Drugi primjer korisne granice:** U prvoj implementaciji usredotočite se na koordinaciju odgovora na poplavu. Navedite vrste događaja ili korisnika koje pokriva odobreni projekt umjesto obećavanja svih mogućih kriznih procesa. Predviđanje pomoću umjetne inteligencije ili obuku u virtualnoj stvarnosti navedite kao budući rad samo ako predstavljaju smislen sljedeći korak, a ne kao pretpostavljene funkcionalnosti prve inačice.

Tvrdnja poput „modularna arhitektura omogućuje brzo postavljanje u novim regijama” zahtijeva stvarno projektno uporište. Ovdje nemojte obećavati prilagodljivost samo zato što zvuči kao poželjna korist projekta.

Ovaj pregled zadržite na razini opsega: navedite glavnu mogućnost i njezinu granicu bez popisivanja svakog zahtjeva ili projektne pojedinosti. Ono što je stvarno dovršeno i ono što je ostalo nedovršeno navedite u završnim rezultatima, a ne u ovom početnom opisu.

</details>

## 1.4 Postojeći pristupi i opravdanost projekta

**Cilj:** Objasniti kako korisnici trenutačno rješavaju problem i koja preostala potreba opravdava odobreni projekt.

[U dvije do četiri rečenice opišite jedan postojeći postupak ili relevantno rješenje, što ono već omogućuje i koja konkretna potreba motivira ovaj projekt. Činjenične tvrdnje o vanjskim proizvodima ili praksama potkrijepite izvorom.]

<details>
<summary><strong>Postojeći pristupi i opravdanost projekta</strong></summary>

**Primjer — CrisisMap:** „Nakon teškog vremenskog događaja građanin će možda morati provjeriti izvor meteoroloških upozorenja i zaseban izvor lokalnih prijava. Predloženi prikaz na karti u CrisisMapu objedinjuje prijave kriznih događaja relevantne za odabranu lokaciju. Aplikacija ne zamjenjuje službena upozorenja ni hitne službe.” Time se objašnjava potreba i namjeravana granica projekta bez tvrdnje da su svi postojeći kanali neučinkoviti. Prva je rečenica **primjer korisničkog scenarija**, a ne izmjeren nalaz o stvarnim korisnicima. Ako tim navodi konkretnu službu upozoravanja ili konkurentski proizvod, treba navesti izvor. Pregled konkurencije i snimke zaslona nisu obavezni.

Ako je postojeće rješenje stvarno utjecalo na projekt, usporedite samo relevantnu funkcionalnost, primjerice jasnoću karte ili potrebnu integraciju. Izbjegavajte unaprijed zadani broj proizvoda ili tablicu kriterija koji nisu povezani s odobrenim zadatkom.

</details>

---

>**Završna provjera:** Opis problema, cilj projekta, korisnici i dionici, granice opsega te postojeći pristupi međusobno su usklađeni. Navedene koristi ne predstavljaju neprovjerene tvrdnje, a uključene i izostavljene funkcionalnosti odgovaraju odobrenom projektnom zadatku.
