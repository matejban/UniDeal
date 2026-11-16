# 3. Obrasci uporabe

**Cilj:** Prikazati glavne interakcije između aktera aplikacije i sustava. Opišite kako akter ostvaruje cilj i što se događa kada važan korak ne uspije. Interakcije temeljite na odobrenim zahtjevima i ažurirajte ih kako se aplikacija razvija.

## 3.1 Dijagram obrazaca uporabe

**Cilj:** Prikazati granicu sustava, relevantne aktere i njihove glavne ciljeve u **preglednom UML dijagramu obrazaca uporabe**. Ako je za razumijevanje pojedinog dijela sustava potrebno prikazati više detalja, taj dio izdvojite u dodatni usmjereni dijagram. Dodatni dijagrami trebaju produbiti dio preglednog modela, a ne stvarati nepovezane ili duplicirane prikaze istog sustava.

![Dijagram obrazaca uporabe sustava CrisisMap](./assets/diagrams/3-1-crisismap-system-UC.svg)

**Slika 3.1. Dijagram obrazaca uporabe sustava CrisisMap**

**PlantUML izvor:** [izvor](./puml/3-1-crisismap-system-UC.puml)

**Provjera dijagrama:** Prikažite prepoznate uloge koje **komuniciraju s aplikacijom**, a ne dionike koji s njom nemaju interakciju. Svaki glavni korisnički cilj mora imati pridruženog aktera; uključeni obrazac uporabe može se dosegnuti preko drugog obrasca uporabe bez vlastite izravne veze s akterom. `<<include>>` i `<<extend>>` koristite samo kada odnos odgovara stvarnom ponašanju.

<details>
<summary><strong>Primjer aktera i granica sustava</strong></summary>

**Opis primjera — CrisisMap:**

Dijagram prikazuje **ogledni scenarij** s građaninom, posjetiteljem i koordinatorom pomoći te vanjskim pružateljem identiteta. Pružatelj identiteta sudjeluje u obrascu uporabe „Prijava u sustav” kao sekundarni akter: korisnik pokreće prijavu u aplikaciji, a vanjski sustav provodi autentikaciju. Budući da projekt koristi vanjskog pružatelja identiteta, ta se ovisnost prikazuje i u dijagramu obrazaca uporabe; tehnički detalji integracije pripadaju arhitekturnoj dokumentaciji.

**Odabir aktera i ciljeva:** Granica pokazuje što aplikacija nudi, akteri imaju različite ciljeve, a nijedan akter ni obrazac uporabe ne tvrdi da ova studentska aplikacija angažira hitne službe. Dijagram usporedite s odobrenim funkcijskim zahtjevima i akterima.

**Pet pitanja za odabir sadržaja dijagrama** (ne pet dijagrama za predaju):

| Fokus                   | Pitanje                                                                                                                     |
| ----------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| Cijeli sustav           | Koji korisnički ciljevi najbolje objašnjavaju čemu ova aplikacija služi?                                                    |
| Ključne funkcionalnosti | Koje ciljeve treba detaljnije opisati ili, ako je potrebno, prikazati zasebnim usmjerenim dijagramom?                       |
| Korisničke uloge        | Koji akteri mogu sudjelovati u pojedinom cilju i kako se njihove ovlasti razlikuju?                                         |
| Ključni procesi         | Koji cilj ima važne alternative koje treba opisati u obrascu uporabe?                                                       |
| Vanjske integracije     | Sudjeluje li drugi sustav u obrascu uporabe kao **sekundarni akter**, primjerice odobreni pružatelj identiteta pri prijavi? |

Vanjski sustav može biti sekundarni akter obrasca uporabe kada sudjeluje u ostvarenju korisničkog cilja; tehničke veze opisuju se u arhitekturi. Nemojte stvarati dodatni obavezni dijagram obrazaca uporabe samo radi popisa integracija. Prenatrpan dijagram podijelite prema povezanim akterima ili ciljevima samo kada time postaje čitljiviji.

</details>

## 3.2 Specifikacije obrazaca uporabe

**Cilj:** Za svaki obrazac uporabe iz dijagrama objasniti cilj aktera, uobičajenu interakciju s aplikacijom i važne alternative. Jednostavne obrasce uporabe opišite kratko; proširite one kod kojih alternative, vanjske ovisnosti ili posljedice zahtijevaju dodatno objašnjenje.

**Za svaki obrazac uporabe koristite jednu okomitu tablicu.** Navedite samo onoliko pojedinosti koliko interakcija zahtijeva; neprimjenjivu alternativu izostavite umjesto da je popunjavate samo radi forme.

### UC-[ID]: [Naziv usmjeren na cilj]

| Element specifikacije             | Opis                                                                                                                                      |
| :-------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------- |
| **Primarni akter**                | [Uloga definirana u analizi zahtjeva]                                                                                                     |
| **Povezani zahtjevi**             | [Identifikatori funkcijskih zahtjeva, npr. F-001, F-004]                                                                                  |
| **Preduvjeti**                    | [Stanje sustava koje mora biti zadovoljeno prije početka izvođenja]                                                                       |
| **Glavni uspješni tok**           | 1. Akter pokreće akciju.<br>2. Program obrađuje unos i vraća povratnu informaciju.<br>3. [Koračni prikaz interakcije do ostvarenja cilja] |
| **Alternativni tokovi / Iznimke** | **[Korak]a — [Naziv iznimke]:** [Uvjet nastanka, reakcija programa i nastavak toka]                                                       |
| **Posljedice (ishod)**            | [Promjena stanja podataka ili potvrda nakon uspješnog završetka]                                                                          |

<details>
<summary><strong>Primjeri specifikacija: Registracija i prijava kriznog događaja</strong></summary>

**Primjer — CrisisMap:**

**UC-001: Registracija računa.** Ovaj kratki primjer odnosi se na projekt čiji odobreni zadatak uključuje račune s adresom e-pošte i lozinkom.

| Polje                                             | Opis                                                                                            |
| ------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| Primarni akter                                    | Građanin (A-02 u primjeru)                                                                      |
| ID zahtjeva                                       | F-001                                                                                           |
| Preduvjeti, ako postoje                           | Nema.                                                                                           |
| Glavni tijek                                      | Građanin unosi adresu e-pošte; aplikacija šalje poveznicu za potvrdu; građanin potvrđuje račun. |
| Alternativni ili neuspješni tijekovi, ako postoje | Adresa e-pošte već postoji → aplikacija objašnjava zašto se registracija ne može nastaviti.     |
| Rezultat                                          | Račun je aktivan nakon potvrde.                                                                 |

Ako odobreni zadatak umjesto toga koristi isključivo OAuth prijavu, zamijenite ovaj primjer odgovarajućim ponašanjem prijave; nemojte dodavati registraciju lokalnom lozinkom samo radi podudaranja s primjerom.

**UC-002: Podnošenje prijave kriznog događaja.** Ista polja mogu opisati dulji tijek u kojem odabir lokacije, provjera valjanosti i pohrana mogu ne uspjeti.

| Polje                                             | Opis                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| ------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Primarni akter                                    | Građanin                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| ID zahtjeva                                       | F-004                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| Preduvjeti, ako postoje                           | Obrazac za prijavu dostupan je. Ako odobreni zadatak zahtijeva prijavu u sustav, građanin je prijavljen.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| Glavni tijek                                      | 1. Građanin otvara obrazac za prijavu; aplikacija prikazuje polja za vrstu kriznog događaja, razinu ozbiljnosti, opis i lokaciju.<br>2. Građanin unosi podatke i odabire lokaciju na karti ili drugim podržanim načinom.<br>3. Građanin podnosi obrazac; aplikacija provjerava obavezna polja i lokaciju.<br>4. Aplikacija pohranjuje prijavu i prikazuje potvrdu s referencom na nju.                                                                                                                                                                                                                                                                                                               |
| Alternativni ili neuspješni tijekovi, ako postoje | **1a — Prijava u sustav nije uspjela:** Ako je prijava obavezna, a pružatelj identiteta je ne dovrši, prijava kriznog događaja ostaje nepodnesena i aplikacija objašnjava kako pokušati ponovno.<br>**2a — Odbijen pristup lokaciji:** Ako aplikacija nudi geolokaciju, ali je korisnik odbije, građanin ručno odabire lokaciju ako ta mogućnost postoji; tijek se nastavlja u koraku 3.<br>**3a — Nevaljana ili nedostajuća lokacija:** Aplikacija objašnjava problem, po mogućnosti zadržava unesene podatke i ne pohranjuje prijavu; građanin ispravlja lokaciju i ponavlja korak 3.<br>**3b — Pohrana nije uspjela:** Aplikacija prijavljuje neuspjeh i ne prikazuje lažnu potvrdu o podnošenju. |
| Rezultat                                          | Aplikacija pohranjuje prijavu kriznog događaja i potvrđuje njezino podnošenje.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |

**Odabir razine detalja:** Oba primjera koriste ista polja. UC-001 je kratak jer je glavna iznimka jasna; UC-002 zahtijeva numerirane korake i alternative jer oni mijenjaju ishod i mogu usmjeravati ispitivanje.Pri prilagodbi primjera koristite ID-ove zahtjeva i ponašanje vlastite aplikacije.

**UC-005: Moderiranje prijave kriznog događaja.** Ovaj primjer vrijedi samo za projekt u kojem odobreni opseg uključuje moderatorski pregled prijava.

| Polje                                             | Opis                                                                                                                                                                                                                                                              |
| ------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Primarni akter                                    | Moderator (A-05 u primjeru)                                                                                                                                                                                                                                       |
| ID zahtjeva                                       | F-008                                                                                                                                                                                                                                                             |
| Preduvjeti, ako postoje                           | Moderator je prijavljen i ima moderatorske ovlasti; postoji prijava koja čeka pregled.                                                                                                                                                                            |
| Glavni tijek                                      | 1. Moderator otvara prijavu koja čeka pregled.<br>2. Aplikacija prikazuje podatke prijave i dostupne moderatorske radnje.<br>3. Moderator odabire odobravanje ili odbijanje.<br>4. Aplikacija provjerava ovlasti, mijenja status prijave i prikazuje novi status. |
| Alternativni ili neuspješni tijekovi, ako postoje | **3a — Radnja nije potvrđena:** Moderator odustaje od promjene i prijava ostaje nepromijenjena.<br>**4a — Ovlasti nisu valjane:** Aplikacija odbija promjenu i status prijave ostaje nepromijenjen.                                                               |
| Rezultat                                          | Prijava ima novi status ako je moderatorska radnja uspješno provedena; inače ostaje nepromijenjena.                                                                                                                                                               |

</details>

---

### UC-1.1: Prijava studenta Microsoft računom

| Element specifikacije             | Opis |
| :-------------------------------- | :--- |
| **Primarni akter**                | A-02 Student (uz A-05 Microsoft Entra ID) |
| **Povezani zahtjevi**             | F-001, F-002, F-032 |
| **Preduvjeti**                    | Korisnik nije prijavljen i ima studentski Microsoft račun. |
| **Glavni uspješni tok**           | 1. Student otvara stranicu `/prijava` (ili na stranici ponude odabire „Prijavi se za kupon”).<br>2. Student odabire „Prijava Microsoft računom”.<br>3. Microsoft Entra ID potvrđuje identitet i vraća studenta u aplikaciju (`/auth/callback`).<br>4. Sustav provjerava da je domena e-mail adrese na popisu hrvatskih visokih učilišta.<br>5. Pri prvoj prijavi sustav stvara profil s ulogom „student”, statusom „potvrđen” i nazivom učilišta.<br>6. Sustav vodi studenta na `/dobrodoslica` (UC-1.3), a zatim na stranicu s koje je krenuo. |
| **Alternativni tokovi / Iznimke** | **3a — Student odustane ili prijava kod Microsofta ne uspije:** sustav vraća studenta na `/prijava` s porukom „Prijava nije uspjela. Pokušaj ponovno.”<br>**4a — Domena nije na popisu:** sustav odjavljuje korisnika i prikazuje poruku da je prijava Microsoft računom dostupna samo studentima hrvatskih visokih učilišta.<br>**5a — Račun je deaktiviran (F-026, UC-1.4):** sustav odjavljuje korisnika i prikazuje poruku da je račun deaktiviran.<br>**6a — Uvjeti su već prihvaćeni:** `/dobrodoslica` odmah šalje studenta dalje.<br>**6b — Odredišna adresa je vanjska:** sustav umjesto nje vodi na naslovnicu. |
| **Posljedice (ishod)**            | Student je prijavljen, a profil ima potvrđen status studenta i naziv učilišta; student smije generirati kupone (UC-5.1). |

### UC-1.2: Prijava partnera Google računom ili e-mailom

| Element specifikacije             | Opis |
| :-------------------------------- | :--- |
| **Primarni akter**                | A-03 Partner (uz A-05 Google i A-08 Resend) |
| **Povezani zahtjevi**             | F-001, F-002, F-032 |
| **Preduvjeti**                    | Korisnik nije prijavljen. |
| **Glavni uspješni tok**           | 1. Partner otvara stranicu `/prijava`.<br>2. Partner odabire prijavu Google računom, a Google potvrđuje identitet.<br>3. Pri prvoj prijavi sustav stvara profil s ulogom „partner”.<br>4. Sustav vodi partnera na `/dobrodoslica` (UC-1.3), a zatim na odredišnu stranicu; na partnerskoj ploči `/partner` partner zatim registrira poslovni subjekt (F-006). |
| **Alternativni tokovi / Iznimke** | **2a — Prijava e-mailom i lozinkom, račun ne postoji:** sustav stvara račun, šalje e-mail s poveznicom za potvrdu adrese i prikazuje poruku o tome; partner se prijavljuje nakon potvrde.<br>**2b — Adresa još nije potvrđena:** sustav prikazuje poruku da treba kliknuti poveznicu iz e-maila.<br>**2c — Pogrešna lozinka za postojeći račun:** sustav prikazuje poruku o pogrešnoj lozinci i upućuje na prijavu Googleom ako je račun stvoren tako.<br>**2d — Poveznica za potvrdu otvorena u drugom pregledniku:** adresa je potvrđena, a sustav prikazuje poruku da se partner sada može prijaviti.<br>**2e — Lozinka kraća od 6 znakova pri registraciji:** sustav prikazuje poruku da registracija nije uspjela.<br>**3a — Račun je deaktiviran:** sustav odjavljuje korisnika i prikazuje poruku da je račun deaktiviran. |
| **Posljedice (ishod)**            | Partner je prijavljen s ulogom „partner”; ne može generirati kupone (F-004). |

### UC-1.3: Prihvaćanje uvjeta korištenja pri prvoj prijavi

| Element specifikacije             | Opis |
| :-------------------------------- | :--- |
| **Primarni akter**                | A-02 Student ili A-03 Partner |
| **Povezani zahtjevi**             | F-032, F-002 |
| **Preduvjeti**                    | Korisnik se upravo prvi put prijavio (UC-1.1 ili UC-1.2) i još nije prihvatio uvjete korištenja. |
| **Glavni uspješni tok**           | 1. Sustav prikazuje stranicu `/dobrodoslica` s poljem za ime i prezime (ispunjenim podatkom pružatelja identiteta, ako postoji) i poveznicom na uvjete korištenja (`/uvjeti`).<br>2. Korisnik po potrebi ispravlja ime i označava da prihvaća uvjete korištenja, u kojima piše da student uz kupon pokazuje studentsku iskaznicu (X-icu).<br>3. Sustav sprema ime i vrijeme prihvaćanja uvjeta (vrijeme postavlja baza).<br>4. Sustav vodi korisnika na stranicu s koje je krenuo. |
| **Alternativni tokovi / Iznimke** | **2a — Uvjeti nisu označeni:** sustav prikazuje poruku „Za nastavak prihvati uvjete korištenja.” i ništa ne sprema.<br>**2b — Ime je prazno ili dulje od 100 znakova:** sustav prikazuje poruku o duljini imena.<br>**4a — Korisnik bez prihvaćenih uvjeta otvori drugu stranicu za prijavljene:** sustav ga vraća na `/dobrodoslica`. |
| **Posljedice (ishod)**            | Profil ima ime i vrijeme prihvaćanja uvjeta; korisnik može koristiti stranice svoje uloge. |

### UC-1.4: Uređivanje profila i deaktivacija vlastitog računa

| Element specifikacije             | Opis |
| :-------------------------------- | :--- |
| **Primarni akter**                | A-02 Student, A-03 Partner ili A-04 Administrator |
| **Povezani zahtjevi**             | F-005, NF-03 |
| **Preduvjeti**                    | Korisnik je prijavljen i prihvatio je uvjete korištenja. |
| **Glavni uspješni tok**           | 1. Korisnik otvara stranicu `/profil`.<br>2. Sustav prikazuje e-mail, ulogu i, za studenta, naziv učilišta.<br>3. Korisnik mijenja ime i prezime i sprema promjenu.<br>4. Sustav sprema ime i prikazuje poruku „Promjene su spremljene.” |
| **Alternativni tokovi / Iznimke** | **3a — Ime je prazno ili dulje od 100 znakova:** sustav prikazuje poruku o duljini imena i ništa ne sprema.<br>**3b — Korisnik deaktivira račun:** korisnik označava da razumije posljedice i potvrđuje deaktivaciju; sustav označava račun kao neaktivan, odjavljuje korisnika i prikazuje poruku da je račun deaktiviran. Ponovno ga može aktivirati samo administrator (F-026).<br>**3c — Deaktivacija bez potvrde posljedica:** sustav prikazuje poruku i račun ostaje aktivan.<br>**3d — Pokušaj promjene uloge ili statusa studenta mimo sučelja:** baza odbija promjenu (NF-03). |
| **Posljedice (ishod)**            | Profil ima novo ime ili je račun deaktiviran; deaktivirani korisnik ne može se ponovno prijaviti, a njegove recenzije nisu javne. |

### UC-2.1: Registracija poslovnog subjekta

| Element specifikacije             | Opis |
| :-------------------------------- | :--- |
| **Primarni akter**                | A-03 Partner |
| **Povezani zahtjevi**             | F-006, F-013, F-025 |
| **Preduvjeti**                    | Partner je prijavljen i još nema profil poslovnog subjekta. |
| **Glavni uspješni tok**           | 1. Partner na `/partner` odabire „Registriraj poslovni subjekt”.<br>2. Partner upisuje naziv, OIB, kategoriju, adresu, grad i telefon.<br>3. Sustav provjerava podatke i sprema profil sa statusom „na čekanju”.<br>4. Partner na `/partner` vidi da profil čeka odobrenje administratora. |
| **Alternativni tokovi / Iznimke** | **2a — Obavezno polje je prazno:** poruka ispod polja, ništa se ne sprema.<br>**3a — OIB nema 11 znamenki ili krivu kontrolnu znamenku:** „OIB mora imati 11 znamenki i ispravnu kontrolnu znamenku.”<br>**3b — OIB je već registriran:** „Partner s tim OIB-om već je registriran.”<br>**3c — Adresa nije pronađena na karti:** profil se svejedno sprema, a lokaciju partner označava ručno (UC-2.2). |
| **Posljedice (ishod)**            | Profil čeka odobrenje (UC-7.1); javan je tek nakon odobrenja i uz aktivnu pretplatu (UC-6.1). |

### UC-2.2: Uređivanje javnog profila partnera

| Element specifikacije             | Opis |
| :-------------------------------- | :--- |
| **Primarni akter**                | A-03 Partner |
| **Povezani zahtjevi**             | F-010, F-013, NF-03 |
| **Preduvjeti**                    | Partner je registrirao poslovni subjekt (UC-2.1). |
| **Glavni uspješni tok**           | 1. Partner na `/partner` odabire „Uredi profil”.<br>2. Partner mijenja naziv, adresu, telefon, radno vrijeme ili opis i odabire „Spremi profil”.<br>3. Sustav sprema promjene i prikazuje „Profil je spremljen.”<br>4. Partner po želji učitava logo (JPG, PNG ili WebP, najviše 2 MB), a stari logo se briše. |
| **Alternativni tokovi / Iznimke** | **2a — Obavezno polje je prazno ili je opis dulji od 1000 znakova:** poruka ispod polja, ništa se ne sprema.<br>**4a — Slika nije JPG, PNG ili WebP ili ima više od 2 MB:** poruka ispod polja, stari logo ostaje. |
| **Posljedice (ishod)**            | Promjene su odmah vidljive na javnom profilu (UC-2.3). Partner može mijenjati samo svoj profil (NF-03). |

### UC-2.3: Pregled profila partnera

| Element specifikacije             | Opis |
| :-------------------------------- | :--- |
| **Primarni akter**                | A-01 Posjetitelj |
| **Povezani zahtjevi**             | F-010, F-007 |
| **Preduvjeti**                    | Prijava nije potrebna. |
| **Glavni uspješni tok**           | 1. Posjetitelj s popisa ponuda ili s karte odabire partnera.<br>2. Sustav na `/partneri/[id]` prikazuje logo, naziv, opis, adresu, telefon, radno vrijeme i aktivne ponude partnera. |
| **Alternativni tokovi / Iznimke** | **2a — Partner nije odobren ili nema aktivnu pretplatu:** stranica ne postoji (404).<br>**2b — Vlasnik otvara svoj profil koji još nije javan:** vidi ga uz napomenu da je to samo pregled.<br>**2c — Partner nema aktivnih ponuda:** „Još nema aktivnih ponuda.” |
| **Posljedice (ishod)**            | Ništa se ne mijenja. |

### UC-2.4: Praćenje kategorija i partnera

_Trenutačno oblikovanje: praćenje i obavijesti (#15) još nisu ostvareni; servis za e-mail (#14) već postoji._

| Element specifikacije             | Opis |
| :-------------------------------- | :--- |
| **Primarni akter**                | A-02 Student, A-08 Resend, A-09 Vremenski okidač |
| **Povezani zahtjevi**             | F-024 |
| **Preduvjeti**                    | Student je prijavljen. |
| **Glavni uspješni tok**           | 1. Student odabire „Prati kategoriju” na `/ponude` ili „Prati partnera” na profilu partnera.<br>2. Kad se objavi nova ponuda u toj kategoriji ili kod tog partnera (UC-3.2), student dobiva e-mail.<br>3. Tri dana prije isteka ponude vremenski okidač studentu šalje podsjetnik.<br>4. Student na `/student` vidi što prati i može otkazati praćenje. |
| **Alternativni tokovi / Iznimke** | **2a — Slanje e-maila ne uspije:** greška se zapisuje, a ponuda se svejedno objavljuje.<br>**3a — Podsjetnik je već poslan:** ne šalje se ponovno. |
| **Posljedice (ishod)**            | Student dobiva obavijesti samo za ono što prati. |

### UC-3.1: Izrada, uređivanje i brisanje ponude

| Element specifikacije             | Opis |
| :-------------------------------- | :--- |
| **Primarni akter**                | A-03 Partner |
| **Povezani zahtjevi**             | F-011, F-021, F-025, NF-03 |
| **Preduvjeti**                    | Partner je prijavljen i administrator je odobrio njegov profil (UC-7.1). |
| **Glavni uspješni tok**           | 1. Partner na `/partner` odabire „Nova ponuda”.<br>2. Partner upisuje naziv, opis, kategoriju, popust (postotak ili iznos), rok trajanja, uvjete i ograničenje korištenja, po želji dodaje fotografiju i odabire „Spremi nacrt”.<br>3. Sustav sprema ponudu kao nacrt i prikazuje je u tablici „Moje ponude”.<br>4. Partner ponudu može urediti („Uredi”) ili obrisati (ikona koša) uz potvrdu. |
| **Alternativni tokovi / Iznimke** | **1a — Profil nije odobren:** gumba nema, nego poruka „Ponude možeš dodavati kad administrator odobri tvoj profil.”<br>**2a — Polje nedostaje ili je neispravno (npr. rok u prošlosti, postotak veći od 100):** poruka ispod polja, ništa se ne sprema.<br>**2b — Slika nije JPG, PNG ili WebP ili ima više od 2 MB:** poruka ispod polja.<br>**4a — Ponuda je istekla:** ne može se urediti, samo obrisati.<br>**4b — Tuđa ponuda:** stranica za uređivanje ne postoji, a baza odbija izmjenu (NF-03). |
| **Posljedice (ishod)**            | Nacrt vide samo partner i administrator, a studenti tek nakon objave (UC-3.2). S obrisanom ponudom brišu se i njezini kuponi i recenzije. |

### UC-3.2: Objava ponude

_Trenutačno oblikovanje: objava (#17) i automatski istek (#18) još nisu ostvareni._

| Element specifikacije             | Opis |
| :-------------------------------- | :--- |
| **Primarni akter**                | A-03 Partner, A-09 Vremenski okidač |
| **Povezani zahtjevi**             | F-012, F-007, F-024 |
| **Preduvjeti**                    | Partner je odobren, a ponuda je nacrt (UC-3.1). |
| **Glavni uspješni tok**           | 1. Partner uz nacrt odabire „Objavi”.<br>2. Sustav provjerava da su polja popunjena i da rok nije prošao te ponudi postavlja status „aktivna”.<br>3. Ponuda se prikazuje na `/ponude`, na karti i na profilu partnera, a pretplaćeni studenti dobivaju e-mail (F-024).<br>4. Kad rok prođe, vremenski okidač ponudi postavlja status „istekla”. |
| **Alternativni tokovi / Iznimke** | **2a — Rok je prošao:** poruka, ponuda ostaje nacrt.<br>**2b — Istekla ponuda:** ne može se ponovno objaviti.<br>**3a — Partner nema aktivnu pretplatu:** ponuda je aktivna, ali nije javna (F-007).<br>**4a — Okidač se još nije pokrenuo:** istekla ponuda se svejedno ne prikazuje u pretrazi. |
| **Posljedice (ishod)**            | Studenti za aktivnu ponudu mogu generirati kupone (UC-5.1) do isteka roka. |

### UC-5.1: Generiranje kupona za ponudu

| Element specifikacije             | Opis                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| :-------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Primarni akter**                | A-02 Student                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| **Povezani zahtjevi**             | F-020, F-021, F-004, F-032, NF-07, NF-08                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| **Preduvjeti**                    | Student je prijavljen i ima potvrđen status studenta. Ponuda je aktivna i rok joj nije prošao.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| **Glavni uspješni tok**           | 1. Student otvara stranicu ponude.<br>2. Student odabire „Generiraj kupon”.<br>3. Sustav provjerava da je student potvrđen i da je ponuda aktivna.<br>4. Sustav generira jedinstveni kod od 10 znakova koji nije moguće pogoditi i sprema kupon sa statusom „izdan”.<br>5. Sustav prikazuje stranicu kupona s kodom, QR kodom, nazivom ponude i partnera, rokom važenja i napomenom da uz kupon treba pokazati studentsku iskaznicu (X-icu).                                                                                                                                                                                                                                                                                                                                                                                             |
| **Alternativni tokovi / Iznimke** | **1a — Korisnik nije prijavljen:** umjesto gumba prikazuje se poveznica „Prijavi se za kupon”; nakon prijave student se vraća na istu ponudu.<br>**3a — Status studenta nije potvrđen:** sustav prikazuje poruku da kupon može generirati samo student s potvrđenim statusom; kupon se ne stvara (F-004).<br>**3b — Ponuda je istekla ili nije dostupna:** sustav prikazuje poruku i kupon se ne stvara.<br>**3c — Ponuda „jednom po studentu” je već iskorištena:** sustav prikazuje poruku o razlogu i kupon se ne stvara (F-021).<br>**3d — Ponuda „jednom po studentu”, student već ima važeći neiskorišten kupon:** sustav ne stvara novi kupon, nego prikazuje postojeći (F-021).<br>**4a — Generirani kod već postoji:** sustav generira novi kod, najviše tri puta; ako ne uspije, prikazuje poruku da generiranje nije uspjelo. |
| **Posljedice (ishod)**            | U bazi postoji kupon sa statusom „izdan” vezan uz studenta i ponudu. Student ga pokazuje partneru na zaslonu mobitela do isteka ponude.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |

### UC-5.2: Potvrda korištenja kupona

| Element specifikacije             | Opis                                                                                                                                                                                                                                                                                                                                                           |
| :-------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Primarni akter**                | A-03 Partner                                                                                                                                                                                                                                                                                                                                                   |
| **Povezani zahtjevi**             | F-014, F-032, NF-03                                                                                                                                                                                                                                                                                                                                            |
| **Preduvjeti**                    | Partner je prijavljen i njegov profil je odobren. Student mu pokazuje kupon na mobitelu.                                                                                                                                                                                                                                                                       |
| **Glavni uspješni tok**           | 1. Partner otvara zaslon za potvrdu kupona.<br>2. Partner upisuje kod s kupona ili skenira QR kod.<br>3. Sustav pronalazi kupon i prikazuje ponudu, status i napomenu da student treba pokazati studentsku iskaznicu (X-icu).<br>4. Partner potvrđuje korištenje.<br>5. Sustav kuponu postavlja status „iskorišten” i vrijeme korištenja te prikazuje potvrdu. |
| **Alternativni tokovi / Iznimke** | **3a — Kod ne postoji:** sustav prikazuje poruku da kupon nije pronađen.<br>**3b — Kupon je za ponudu drugog partnera:** sustav odbija potvrdu.<br>**3c — Kupon je već iskorišten ili je istekao:** sustav prikazuje status kupona i ne dopušta potvrdu.<br>**4a — Student ne pokaže X-icu:** partner odustaje od potvrde; kupon ostaje „izdan”.               |
| **Posljedice (ishod)**            | Kupon ima status „iskorišten” s vremenom korištenja; student za njega može ostaviti recenziju (UC-5.4).                                                                                                                                                                                                                                                        |

### UC-5.3: Pregled povijesti kupona

| Element specifikacije             | Opis                                                                                                                                                                                                                       |
| :-------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Primarni akter**                | A-02 Student                                                                                                                                                                                                               |
| **Povezani zahtjevi**             | F-022                                                                                                                                                                                                                      |
| **Preduvjeti**                    | Student je prijavljen.                                                                                                                                                                                                     |
| **Glavni uspješni tok**           | 1. Student otvara svoj profil.<br>2. Sustav prikazuje popis svih studentovih kupona s ponudom, partnerom, datumom i statusom (izdan, iskorišten, istekao).<br>3. Student odabire kupon i sustav prikazuje stranicu kupona. |
| **Alternativni tokovi / Iznimke** | **2a — Student nema kupona:** sustav prikazuje poruku da još nema generiranih kupona.                                                                                                                                      |
| **Posljedice (ishod)**            | Nema promjene podataka.                                                                                                                                                                                                    |

### UC-5.4: Ocjenjivanje partnera

| Element specifikacije             | Opis                                                                                                                                                                                                     |
| :-------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Primarni akter**                | A-02 Student                                                                                                                                                                                             |
| **Povezani zahtjevi**             | F-023                                                                                                                                                                                                    |
| **Preduvjeti**                    | Student je prijavljen i ima iskorišten kupon za ponudu tog partnera.                                                                                                                                     |
| **Glavni uspješni tok**           | 1. Student u povijesti kupona odabire iskorišteni kupon i „Ocijeni”.<br>2. Student odabire ocjenu od 1 do 5 i po želji piše komentar.<br>3. Sustav sprema recenziju i ažurira prosječnu ocjenu partnera. |
| **Alternativni tokovi / Iznimke** | **1a — Kupon nije iskorišten:** mogućnost ocjenjivanja se ne prikazuje; pokušaj mimo sučelja baza odbija.<br>**3a — Kupon je već ocijenjen:** sustav odbija drugu recenziju za isti kupon.               |
| **Posljedice (ishod)**            | Recenzija je javno vidljiva na profilu partnera; administrator je može ukloniti.                                                                                                                         |

### UC-6.1: Plaćanje pretplate

| Element specifikacije             | Opis |
| :-------------------------------- | :--- |
| **Primarni akter**                | A-03 Partner (uz A-07 Stripe) |
| **Povezani zahtjevi**             | F-008, F-007, NF-05 |
| **Preduvjeti**                    | Partner je prijavljen, prihvatio je uvjete korištenja i registrirao je poslovni subjekt (F-006). Nema pretplatu koja još vrijedi. |
| **Glavni uspješni tok**           | 1. Partner na partnerskoj ploči `/partner` odabire „Plati pretplatu”.<br>2. Sustav na `/partner/pretplata` prikazuje mjesečnu i godišnju pretplatu s cijenama iz baze i gumbom „Plati” uz svaku.<br>3. Partner odabire „Plati” uz željeni plan.<br>4. Sustav provjerava plan, profil partnera, postojeću pretplatu i cijenu plana u Stripeu te partnera šalje na Stripeovu stranicu za plaćanje (Stripe Checkout) s cijenom plana i e-mailom partnera.<br>5. Partner na Stripeovoj stranici upisuje podatke kartice i plaća; podaci kartice ne prolaze kroz aplikaciju (NF-05).<br>6. Stripe vraća partnera na `/partner/pretplata`, gdje sustav prikazuje „Plaćanje se obrađuje. Pretplata će se aktivirati čim Stripe potvrdi uplatu.”<br>7. Stripe javlja sustavu da je uplata primljena, a sustav pretplati postavlja status „aktivna” i datum isteka (UC-6.2). |
| **Alternativni tokovi / Iznimke** | **1a — Korisnik nije partner:** neprijavljeni korisnik vodi se na `/prijava`, a korisniku druge uloge stranica ne postoji (404).<br>**2a — Partner još nije registrirao poslovni subjekt:** sustav prikazuje „Pretplatu možeš platiti tek nakon što registriraš poslovni subjekt.” i poveznicu na registraciju; gumbi za plaćanje se ne prikazuju.<br>**2b — Cijene nisu postavljene ili cijena plana nije napravljena u Stripeu:** sustav prikazuje „Cijene pretplate još nisu postavljene.”, odnosno uz taj plan onemogućen gumb „Plati” i napomenu „Plaćanje još nije dostupno.”; zahtjev mimo sučelja odbija se porukom „Plaćanje ovog plana trenutačno nije dostupno.”<br>**4a — Profil je odbijen:** sustav prikazuje „Profil je odbijen pa pretplata nije moguća. Za više informacija javi se administratoru.”<br>**4b — Pretplata još vrijedi:** sustav prikazuje „Pretplata je već aktivna.” i ne naplaćuje je ponovno.<br>**4c — Nepoznat plan (zahtjev mimo sučelja):** sustav prikazuje „Odabran je nepoznat plan pretplate.”<br>**4d — Stripe nije dostupan:** sustav prikazuje „Plaćanje nije moguće pokrenuti. Pokušaj ponovno kasnije.”<br>**5a — Partner odustane na Stripeovoj stranici:** Stripe ga vraća na `/partner/pretplata`, gdje sustav prikazuje „Plaćanje je otkazano. Ništa nije naplaćeno i pretplata nije promijenjena.”<br>**5b — Kartica je odbijena:** Stripe na svojoj stranici prikazuje grešku i ništa ne naplaćuje; partner može pokušati drugom karticom ili odustati (5a). Pretplata se ne aktivira. |
| **Posljedice (ishod)**            | Stripe je naplatio pretplatu i uz nju zapisao ID partnera. Nakon potvrde uplate (UC-6.2) pretplata ima status „aktivna” i datum isteka, a odobreni partner i njegove aktivne ponude javno su vidljivi (F-007). Partner koji još čeka odobrenje smije platiti, ali javan postaje tek nakon odobrenja (UC-7.1). |

### UC-6.2: Ažuriranje stanja pretplate iz Stripea

_Trenutačno oblikovanje: Stripe webhook (#34) i prikaz stanja pretplate partneru (#36) još nisu ostvareni. Pravilo da je partner javan samo uz aktivnu pretplatu već vrijedi u bazi (`private.partner_is_public`)._

| Element specifikacije             | Opis |
| :-------------------------------- | :--- |
| **Primarni akter**                | A-07 Stripe |
| **Povezani zahtjevi**             | F-008, F-007, C-02, NF-03 |
| **Preduvjeti**                    | Partner je pokrenuo plaćanje pretplate (UC-6.1). U Stripeu je upisana adresa webhooka aplikacije, a u aplikaciji tajna `STRIPE_WEBHOOK_SECRET`. |
| **Glavni uspješni tok**           | 1. Nakon uspješne naplate ili obnove pretplate Stripe šalje obavijest na `/api/stripe/webhook`.<br>2. Sustav provjerava potpis obavijesti tajnom `STRIPE_WEBHOOK_SECRET`.<br>3. Sustav iz obavijesti čita ID partnera (`client_reference_id` ili `metadata.partner_id`) te Stripeove identifikatore kupca i pretplate.<br>4. Sustav u tablicu `subscriptions` upisuje plan, status „aktivna” i datum isteka jednak kraju plaćenog razdoblja.<br>5. Partner na `/partner/pretplata` vidi da je pretplata aktivna i do kada vrijedi; ako ga je administrator odobrio, partner i njegove aktivne ponude prikazuju se u pretrazi, na karti i na javnom profilu (F-007). |
| **Alternativni tokovi / Iznimke** | **2a — Potpis nije ispravan:** sustav odbija obavijest (HTTP 400) i ništa ne mijenja.<br>**3a — Ista obavijest stigne više puta ili drugim redoslijedom:** sustav postavlja stanje iz obavijesti umjesto da produžuje rok, pa ponovljena obavijest ne mijenja ishod.<br>**4a — Partner otkaže pretplatu ili naplata ne uspije:** sustav pretplatu označava kao neaktivnu (status „otkazana” ili „istekla”); partner i njegove ponude više nisu javni.<br>**4b — Rok prođe bez obnove ili obavijest kasni:** pretplata se ne smatra aktivnom čim prođe datum isteka, jer baza (`private.partner_is_public`) i domena (`Subscription.isActive()`) uz status provjeravaju i datum; partner i ponude nestaju iz pretrage i s karte, a nakon obnove ponovno se prikazuju. |
| **Posljedice (ishod)**            | Tablica `subscriptions` odražava stanje pretplate u Stripeu. Pretplatu upisuje samo poslužitelj secret ključem; partner je ne može sam upisati ni promijeniti (NF-03). |

### UC-7.1: Odobravanje partnera

| Element specifikacije             | Opis |
| :-------------------------------- | :--- |
| **Primarni akter**                | A-04 Administrator (uz A-08 Resend) |
| **Povezani zahtjevi**             | F-025, NF-03 |
| **Preduvjeti**                    | Administrator je prijavljen; postoji barem jedan profil partnera sa statusom „na čekanju”. |
| **Glavni uspješni tok**           | 1. Administrator na `/admin` vidi broj partnera na čekanju i otvara `/admin/partneri`.<br>2. Sustav prikazuje popis profila na čekanju (naziv, OIB, kategorija, adresa, kontakt, datum prijave).<br>3. Administrator odabire „Odobri” ili „Odbij” uz pojedini profil.<br>4. Sustav sprema odluku i uklanja profil s popisa na čekanju.<br>5. Sustav vlasniku profila šalje e-mail o odluci. |
| **Alternativni tokovi / Iznimke** | **3a — Korisnik nije administrator:** stranica ne postoji (404), a baza odbija promjenu statusa i mimo sučelja.<br>**4a — Spremanje ne uspije:** sustav prikazuje „Odluka nije spremljena. Pokušaj ponovno.”, a status profila se ne mijenja.<br>**5a — Profil nema vlasnika (demonstracijski partner):** e-mail se ne šalje.<br>**5b — Slanje e-maila ne uspije:** greška se zapisuje, a odluka ostaje spremljena. |
| **Posljedice (ishod)**            | Profil je odobren ili odbijen; partner vidi status na `/partner`. Odobreni profil postaje javan tek uz aktivnu pretplatu. |

### UC-7.2: Upravljanje korisničkim računima

| Element specifikacije             | Opis |
| :-------------------------------- | :--- |
| **Primarni akter**                | A-04 Administrator |
| **Povezani zahtjevi**             | F-026, NF-03 |
| **Preduvjeti**                    | Administrator je prijavljen. |
| **Glavni uspješni tok**           | 1. Administrator otvara `/admin/korisnici`.<br>2. Sustav prikazuje korisnike (ime, e-mail, uloga, status studenta, aktivnost računa).<br>3. Administrator po želji filtrira popis po e-mailu ili ulozi.<br>4. Administrator uz račun odabire „Deaktiviraj”.<br>5. Sustav označava račun kao deaktiviran i osvježava popis. |
| **Alternativni tokovi / Iznimke** | **3a — Nema korisnika za zadane uvjete:** sustav prikazuje „Nema korisnika za zadane uvjete.”<br>**4a — Račun je već deaktiviran:** administrator odabire „Aktiviraj” i račun ponovno postaje aktivan.<br>**4b — Vlastiti račun:** gumb se ne prikazuje; pokušaj mimo sučelja odbija se porukom „Ne možeš deaktivirati vlastiti račun.”<br>**5a — Spremanje ne uspije:** sustav prikazuje „Promjena nije uspjela. Pokušaj ponovno.” |
| **Posljedice (ishod)**            | Deaktivirani korisnik ne može se prijaviti (UC-1.1, 5a), a aktivna sesija smatra se neprijavljenom. |

### UC-7.3: Upravljanje kategorijama ponuda

| Element specifikacije             | Opis |
| :-------------------------------- | :--- |
| **Primarni akter**                | A-04 Administrator |
| **Povezani zahtjevi**             | F-027, NF-03 |
| **Preduvjeti**                    | Administrator je prijavljen. |
| **Glavni uspješni tok**           | 1. Administrator otvara `/admin/kategorije`.<br>2. Sustav prikazuje kategorije s brojem ponuda i partnera koji ih koriste.<br>3. Administrator upisuje naziv nove kategorije i dodaje je, preimenuje postojeću ili uklanja kategoriju koju nitko ne koristi.<br>4. Sustav sprema promjenu i osvježava popis. |
| **Alternativni tokovi / Iznimke** | **3a — Prazan naziv:** „Upiši naziv kategorije.”<br>**3b — Naziv već postoji (bez obzira na velika i mala slova):** „Kategorija s tim nazivom već postoji.”<br>**3c — Kategoriju koriste ponude ili partneri:** sustav odbija uklanjanje i navodi broj ponuda i partnera koji je koriste.<br>**4a — Spremanje ne uspije:** „Promjena nije spremljena. Pokušaj ponovno.” |
| **Posljedice (ishod)**            | Nova ili preimenovana kategorija nudi se partneru pri izradi ponude i u filtru na `/ponude`; uklonjena se više ne nudi. |

### UC-7.4: Pregled statistike platforme

| Element specifikacije             | Opis |
| :-------------------------------- | :--- |
| **Primarni akter**                | A-04 Administrator |
| **Povezani zahtjevi**             | F-030, NF-03 |
| **Preduvjeti**                    | Administrator je prijavljen. |
| **Glavni uspješni tok**           | 1. Administrator otvara `/admin`.<br>2. Sustav prikazuje statistiku za zadnjih 30 dana: broj studenata i partnera, aktivnih ponuda i iskorištenih kupona te iskorištene kupone po kategorijama i gradovima.<br>3. Administrator odabire početni i završni datum i „Prikaži”.<br>4. Sustav prikazuje statistiku za odabrano razdoblje. |
| **Alternativni tokovi / Iznimke** | **3a — Neispravan datum ili početak nakon kraja:** sustav prikazuje zadnjih 30 dana uz poruku „Razdoblje nije ispravno, pa je prikazano zadnjih 30 dana.”<br>**4a — Nema iskorištenih kupona u razdoblju:** „Nema iskorištenih kupona u odabranom razdoblju.”<br>**4b — Prihod od pretplata:** prikazuje se „—” (još nije dostupno) dok se ne bilježe plaćanja (#34). |
| **Posljedice (ishod)**            | Podaci se samo čitaju; ništa se ne mijenja. |

## 3.3 Provjera dosljednosti obrazaca uporabe

**Cilj:** Provjeriti međusobnu usklađenost obrazaca uporabe, aktera, zahtjeva i ispitnih slučajeva. Cjelovito mapiranje održava se isključivo u **[matrici sljedivosti zahtjeva](2-Analiza-zahtjeva.md#26-sljedivost-zahtjeva)**.

| Provjera   | Pitanje za tim                                                                                                              |
| ---------- | --------------------------------------------------------------------------------------------------------------------------- |
| Zahtjev    | Je li svaki važan obrazac uporabe povezan s postojećim zahtjevom?                                                           |
| Akter      | Odgovara li akter naveden ovdje prethodno utvrđenoj ulozi i dopuštenoj interakciji?                                         |
| Aplikacija | Može li tim demonstrirati opisani glavni rezultat i važnu alternativu ili je opis jasno označen kao trenutačno oblikovanje? |

---

Povezivanje zahtjev → obrazac uporabe → ispitivanje održavajte **samo jednom, u [tablici sljedivosti zahtjeva](./2-Analiza-zahtjeva.md)**. Ovdje nemojte održavati drugu projektnu tablicu mapiranja ni stupac sa statusom implementacije. Ako važan zahtjev nema interakciju s ljudskim akterom, objasnite gdje se obrađuje umjesto izmišljanja aktera.

<details>
<summary><strong>Provjera pokrivenosti zahtjeva</strong></summary>

**Primjer — CrisisMap:** Tablica pokrivenosti obrazaca uporabe koju treba analizirati:

| Broj obrasca uporabe | Naziv obrasca uporabe    | Obuhvaćeni funkcijski zahtjevi                  |
| -------------------- | ------------------------ | ----------------------------------------------- |
| UC-001               | Registracija računa      | F-001: Registracija računa putem e-pošte        |
| UC-002               | Prijava kriznog događaja | F-022: Prijava i provjera kriznog događaja      |
| UC-003               | Sustav upozorenja        | F-045: Slanje upozorenja korisnicima i timovima |
| UC-004               | Koordinacija spašavanja  | F-067: Koordinacija s hitnim službama           |

---

**Problemi pokrivenosti koje treba riješiti:**

- **Pogrešan ID zahtjeva:** ova tablica povezuje UC-002 s F-022, dok se opis UC-002 u odjeljku 3.2 poziva na F-004, zahtjev za podnošenje prijave iz odjeljka 2.1.
- **Zahtjevi koji ne postoje:** F-022, F-045 i F-067 nisu definirani u oglednim zahtjevima u 2.1.
- **Obrasci uporabe bez opisa:** UC-003 i UC-004 nemaju opis u 3.2. UC-004 (koordinacija s hitnim službama) ujedno je mogućnost s vanjskim posljedicama koju opseg dopušta samo ako je uključena u odobreni zadatak.
- **Nesklad aktera:** primjer aktera u odjeljku 2.3 navodi da koordinator pomoći podnosi prijave (F-004), dok UC-002 kao primarnog aktera navodi građanina.

</details>

**Završna provjera:** Dijagram, specifikacije obrazaca uporabe i matrica sljedivosti međusobno su usklađeni. Svaki važan obrazac uporabe povezan je s postojećim zahtjevom, akteri odgovaraju stvarnim ulogama u aplikaciji, a opisani glavni i alternativni tijekovi odgovaraju ponašanju koje sustav stvarno podržava.
