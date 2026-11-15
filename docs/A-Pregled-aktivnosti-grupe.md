# A. Pregled aktivnosti grupe

**Cilj:** Prikazati kako je tim organizirao projekt, raspodijelio rad, reagirao na važne probleme i pridonio rezultatu. Zapisi trebaju opisivati ishode, a ne samo navoditi da je sastanak održan ili da se o nekoj temi raspravljalo.

## A.1 Evidencija sastanaka

**Cilj:** Voditi kratak zapis projektnih sastanaka i tjedne koordinacije: tko je sudjelovao, što je odlučeno i koja je radnja uslijedila. Raspravu koja nije dovela do odluke zabilježite samo ako je važno pitanje ostalo otvoreno.

**Kratice članova tima:** MB = Matej Ban; FL = Fran Lovrić; KD = Krešimir Daković; KB = Karlo Brkić; EB = Elide Babić; JČ = Josip Čaljkušić; FČ = Fran Čeko.

| Datum i sudionici | Glavna tema | Donesena odluka ili zadatak  | Poveznica na zadatak ili  rezultat, ako postoji |
| --- | --- | --- | --- |
| 12. 10. 2026.; MB, KB, EB, JČ, FČ | Upoznavanje tima, odabir teme i tehnologija | Tim je odabrao vlastitu temu, platformu studentskih popusta UniDeal, i dogovorio tehnologije (Next.js, Supabase, Vercel). Na sastanku je započet opis ideje; MB i EB su ga dovršili i poslali asistentici na pregled. | [1. Opseg projekta](1-Projekt.md) |
| 26. 10. 2026.; MB, FL, KD, KB, EB, JČ, FČ | Podjela rada po područjima | Svaki član radi kao fullstack i preuzima jedno područje: MB temelje, bazu i prijavu; FL partnere i obavijesti; KD ponude i statistiku; KB pretragu, kartu i favorite; EB kupone, QR i recenzije; JČ plaćanje i pretplate; FČ administraciju i izvještaje. Tim je zajedno napravio plan rada po područjima, a MB je kao vlasnik repozitorija otvorio issue za svaku funkcionalnost. | [GitHub Issues](https://github.com/matejban/UniDeal/issues), s oznakom područja (npr. `podrucje-3-ponude`) |

## A.2 Plan rada

**Cilj:** Prikazati planirani redoslijed rada i odgovornosti u timu. Prikažite projektne tjedne ili druga kratka razdoblja koja tim koristi, uključujući pripremu za formalne provjere.

**Trenutačni plan:** [GitHub Issues](https://github.com/matejban/UniDeal/issues) s oznakama po područjima (`podrucje-1-temelji` … `podrucje-7-admin`, `zajednicko`) i tablica u nastavku. Rad je podijeljen po područjima, a ne po tjednima: svaki član radi na svom području kad mu odgovara, jer su issuei većinom međusobno neovisni. Svatko održava ažurnima issuee svog područja, a MB kao vlasnik repozitorija otvara issuee i održava oznake.

| Razdoblje | Glavni planirani rad | Odgovorni članovi | Poveznica na zadatke |
| --- | --- | --- | --- |
| 18.–25. 10. 2026. | Postavljanje repozitorija, opis projekta i analiza zahtjeva | svi | — |
| 26. 10. – 1. 11. 2026. | Temelji: Supabase projekt, shema i migracije, RLS po ulogama, prijava i uloge, repozitoriji podataka, CI. Podjela zadataka po područjima. | MB (temelji), svi (podjela zadataka) | [#1]–[#8], [#45] |
| od 2. 11. 2026. (paralelno) | Partneri: registracija, javni profil, upload slika, e-mail obavijesti, pretplata studenata | FL | [#10]–[#15] |
| od 2. 11. 2026. (paralelno) | Ponude: CRUD, statusi, automatski istek, kategorije, pregled vlastitih ponuda partnera, statistika za partnera | KD | [#16]–[#20], [#43] |
| od 2. 11. 2026. (paralelno) | Pretraga i karta: filtri, sortiranje, karta, geokodiranje, ponude u blizini, favoriti | KB | [#21]–[#26] |
| od 2. 11. 2026. (paralelno) | Kuponi: generiranje koda i QR koda, ograničenje korištenja, potvrda kod partnera, povijest kupona, recenzije | EB | [#27]–[#31] |
| od 2. 11. 2026. (paralelno) | Plaćanje: Stripe proizvodi i Checkout, webhook, skrivanje ponuda bez pretplate, stranica pretplate | JČ | [#32]–[#36] |
| od 2. 11. 2026. (paralelno) | Administracija: korisnici, odobravanje partnera, kategorije, moderacija, cijene pretplate, statistika za administratora, izvoz CSV/PDF | FČ | [#37]–[#42], [#44] |
| 11.–20. 11. 2026. | Priprema za prvu predaju (20. 11. 2026.): dokumentacija, granice projekta, ručno ispitivanje prijave, ažuriranje README-a | EB ([#48], [#86]), KB ([#49], [#84]), FL ([#46], [#85]), JČ ([#50]), KD ([#51]), FČ ([#47], [#87]), MB ([#9]) | oznaka [`zajednicko`][oznaka-zajednicko] |
| od 21. 11. 2026. | Nastavak rada na zadacima koji nisu riješeni do prve predaje, dovršetak otvorenih zadataka u svakom području i integracija područja (pretplata ↔ vidljivost ponuda, kuponi ↔ recenzije, statistika) | svi, svatko za svoje područje | otvoreni zadaci po oznaci područja |

[#1]: https://github.com/matejban/UniDeal/issues/1
[#8]: https://github.com/matejban/UniDeal/issues/8
[#9]: https://github.com/matejban/UniDeal/issues/9
[#10]: https://github.com/matejban/UniDeal/issues/10
[#15]: https://github.com/matejban/UniDeal/issues/15
[#16]: https://github.com/matejban/UniDeal/issues/16
[#20]: https://github.com/matejban/UniDeal/issues/20
[#21]: https://github.com/matejban/UniDeal/issues/21
[#26]: https://github.com/matejban/UniDeal/issues/26
[#27]: https://github.com/matejban/UniDeal/issues/27
[#31]: https://github.com/matejban/UniDeal/issues/31
[#32]: https://github.com/matejban/UniDeal/issues/32
[#36]: https://github.com/matejban/UniDeal/issues/36
[#37]: https://github.com/matejban/UniDeal/issues/37
[#42]: https://github.com/matejban/UniDeal/issues/42
[#43]: https://github.com/matejban/UniDeal/issues/43
[#44]: https://github.com/matejban/UniDeal/issues/44
[#45]: https://github.com/matejban/UniDeal/issues/45
[#46]: https://github.com/matejban/UniDeal/issues/46
[#47]: https://github.com/matejban/UniDeal/issues/47
[#48]: https://github.com/matejban/UniDeal/issues/48
[#49]: https://github.com/matejban/UniDeal/issues/49
[#50]: https://github.com/matejban/UniDeal/issues/50
[#51]: https://github.com/matejban/UniDeal/issues/51
[#84]: https://github.com/matejban/UniDeal/issues/84
[#85]: https://github.com/matejban/UniDeal/issues/85
[#86]: https://github.com/matejban/UniDeal/issues/86
[#87]: https://github.com/matejban/UniDeal/issues/87
[oznaka-zajednicko]: https://github.com/matejban/UniDeal/issues?q=label%3Azajednicko

## A.3 Aktivnosti i doprinosi članova

**Cilj:** Prikazati koji su članovi radili na važnim projektnim aktivnostima i približan trud koji prijavljuju. Uz implementaciju uključite oblikovanje, dokumentaciju, integraciju, ispitivanje i postavljanje.

| Aktivnost ili rezultat | Član | Prijavljeni sati | Reprezentativni rezultat ili poveznica |
| --- | --- | --- | --- |
| Otvaranje repozitorija | FČ |  | Početni commit repozitorija |
| Struktura projekta prema predlošku kolegija | EB |  | Direktoriji `docs/`, `tests/`, `db/`, `build/` |
| Odjeljak 1.4 Postojeći pristupi | FČ |  | `docs/1-Projekt.md` |
| Opis projekta, osnovna Next.js aplikacija, objektno orijentirana struktura i prijava Google računom | MB |  | `README.md`, `src/` |
| Analiza zahtjeva | KB |  | `docs/2-Analiza-zahtjeva.md` |
| Supabase projekt, prijava studenata Microsoft računom, prijava partnera e-mailom i profili s ulogom | MB |  | Zadaci [#1] i [#6] |
| Upravljanje korisničkim računima i deaktivacija | FČ |  | Zadatak [#38], PR [#56] |
| Članovi tima u README-u i dorada analize zahtjeva | KB |  | Zadatak [#45] |
| Shema baze i migracije, RLS po ulogama, Supabase repozitoriji, zaštita ruta po ulozi, uređivanje profila, CI i README | MB |  | Zadaci [#2]–[#5], [#7]–[#9] |
| Registracija partnera s provjerom OIB-a | FL |  | Zadatak [#10] |
| Generiranje kupona s jedinstvenim kodom i QR kodom | EB |  | Zadatak [#27] |
| Odobravanje partnera u administraciji | FČ |  | Zadatak [#37], PR [#68] |
| Javni profil partnera i uređivanje profila | FL |  | Zadatak [#11] |
| Upload logotipa partnera u Supabase Storage | FL |  | Zadatak [#13] |
| E-mail obavijesti preko Resenda | FL |  | Zadatak [#14] |
| Ograničenje korištenja kupona (jednom po studentu) | EB |  | Zadatak [#29] |
| Stripe klijent i cijene mjesečne i godišnje pretplate | JČ |  | Zadatak [#32] |
| Dokumentacija i testovi temelja i autentifikacije | MB |  | UC-1.1 – UC-1.4, CT-1.x, ST-1.x |
| Obrasci uporabe, sljedivost i ispitivanje kupona | EB |  | Zadatak [#48]; UC-5.1 – UC-5.4, CT-5.1, CT-5.2, ST-5.1 – ST-5.4 |
| Upravljanje kategorijama ponuda (u tijeku) | FČ |  | Zadatak [#39] |
| Statistika za administratora (u tijeku) | FČ |  | Zadatak [#42] |
| Izrada, uređivanje i brisanje ponude te dijagram razreda (4.3.2) | KD |  | Zadatak [#16] |
| Sljedivost F-016 i opis načina rada u README-u | MB |  | `README.md`, `docs/2-Analiza-zahtjeva.md` |
| Stripe Checkout za partnera | JČ |  | Zadatak [#33] |
| Granice projekta (1.3) i dorada postojećih pristupa (1.4) | FČ |  | Zadatak [#47] |
| Brisanje stare slike iz Storagea, ispravak RLS testa, ispitivanje CT-1.3 i ST-1.3 – ST-1.6, dorada obrazaca | MB |  | `docs/5-Ispitivanje.md` |
| Ručno ispitivanje prijave Microsoft računom | FČ |  | Zadatak [#87]; ST-1.1, ST-1.2 |
| Google Maps karta s oznakama partnera | KB |  | Zadatak [#23] |
| Geokodiranje adrese partnera i ručno označavanje lokacije | KB |  | Zadatak [#24] |
| Dokumentacija administratorskog područja | FČ |  | UC-7.1 – UC-7.4 |
| Dijagram razreda za kupone: `Coupon`, `CouponService` i `CouponRepository` | EB |  | PR [#95]; `docs/puml/4-3-unideal-domain-CD.puml` |
| Dokumentacija pretplate: obrasci uporabe, sljedivost i ispitivanje | JČ |  | PR [#94]; UC-6.1, UC-6.2, CT-6.1 – CT-6.3, ST-6.1 – ST-6.4 |

[#2]: https://github.com/matejban/UniDeal/issues/2
[#5]: https://github.com/matejban/UniDeal/issues/5
[#6]: https://github.com/matejban/UniDeal/issues/6
[#7]: https://github.com/matejban/UniDeal/issues/7
[#11]: https://github.com/matejban/UniDeal/issues/11
[#13]: https://github.com/matejban/UniDeal/issues/13
[#14]: https://github.com/matejban/UniDeal/issues/14
[#23]: https://github.com/matejban/UniDeal/issues/23
[#24]: https://github.com/matejban/UniDeal/issues/24
[#29]: https://github.com/matejban/UniDeal/issues/29
[#33]: https://github.com/matejban/UniDeal/issues/33
[#38]: https://github.com/matejban/UniDeal/issues/38
[#39]: https://github.com/matejban/UniDeal/issues/39
[#56]: https://github.com/matejban/UniDeal/pull/56
[#68]: https://github.com/matejban/UniDeal/pull/68
[#94]: https://github.com/matejban/UniDeal/pull/94
[#95]: https://github.com/matejban/UniDeal/pull/95

## A.4 Pregled promjena u repozitoriju

**Cilj:** Prikazati kada su promjene napravljene u repozitoriju i tko ih je napravio, uz napomenu da sam broj zapisa promjena ne mjeri kvalitetu doprinosa.

**Prikaz aktivnosti repozitorija:** [Ugradite ili povežite GitHubov prikaz `Contributors` i generirani graf za projektni repozitorij; navedite razdoblje koje obuhvaća.]

Graf može pokazati kada su zapisi promjena napravljeni i tko ih je napravio, ali ne prikazuje sav rad na oblikovanju, ispitivanju, integraciji, pregledu ili dokumentaciji. Ako postoji uočljiv nesklad s tablicom aktivnosti, kratko ga objasnite; nemojte iz grafa izvoditi broj sati. Generirani prikaz neka bude vezan uz stvarni repozitorij umjesto da se ručno crta drugi graf.

## A.5 Ključni inženjerski izazovi i rješenja

**Cilj:** Dokumentirati stvarne tehničke i organizacijske prepreke s kojima se tim suočio, poduzete korektivne inženjerske korake te konačni ishod. Odaberite konkretne izazove umjesto općenite pohvale timskog rada.

| Izazov | Poduzeta radnja | Ishod ili preostalo ograničenje |
| --- | --- | --- |
|  |  |  |

<details>
<summary><strong>Rješavanje nesklada formata lokacije</strong></summary>

**Primjer — CrisisMap:**

| Izazov | Poduzeta radnja | Ishod ili preostalo ograničenje |
| --- | --- | --- |
| Odabrani položaj na karti prikazivao se u klijentu, ali podnesena prijava nije zadržavala koordinate. | AK i EP usporedile su zahtjev preglednika s poljima lokacije koje očekuje API; AK je uskladila format zahtjeva, a LM je dodao provjeru valjanosti lokacije. | Nova prijava u ovom se scenariju može dohvatiti sa spremljenim položajem; tim povezuje odgovarajuću promjenu integracije i provjeru. |

**Problem, odgovor i ishod:** Svaki se dio može provjeriti u projektu. Rečenica poput „imali smo poteškoće s integracijom i riješili ih timskim radom” ne bi čitatelju rekla što nije radilo ni kako je rješenje promijenjeno.

</details>

---

>**Završna provjera:** Sastanci navode smislene ishode i odgovorne osobe; plan odražava namjeravani rad; tablica uloženog rada i generirani prikaz repozitorija odnose na ovaj vidljivi projekt; konkretni izazovi povezani su s radnjama i njihovim rezultatima. 