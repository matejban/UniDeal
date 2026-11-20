# UniDeal — Projektna dokumentacija

**Kolegij:** [Programsko inženjerstvo](https://www.fer.unizg.hr/predmet/proinz), Fakultet elektrotehnike i računarstva Sveučilišta u Zagrebu  
**Akademska godina:** 2026./2027.  
**Tim:** ČokolinoPlusPlus  
**Nastavnik:** Vlado Sruk  
**Asistent / demonstrator:** Eda Jovičić (asistentica), Vito Ljubotina (demonstrator)

## Pregled projekta

**Cilj:** Omogućiti čitatelju koji prvi put vidi projekt da u dvije ili tri rečenice prepozna aplikaciju, njezine ciljane korisnike i glavnu svrhu.

UniDeal je web platforma za studentske pogodnosti i popuste. Studenti na jednom mjestu besplatno pretražuju ponude partnera, vide ih na karti i koriste ih putem kupona s QR kodom, a partneri uz pretplatu objavljuju ponude i prate koliko se koriste. Detaljan opis nalazi se u [1. Opseg projekta](1-Projekt.md), a otvoreni zadaci u [GitHub Issues](https://github.com/matejban/UniDeal/issues).


**Aplikacija i osnovno postavljanje:** [README repozitorija](../README.md#quick-start)  
**Javno dostupna aplikacija:** pogledajte [README – Postavljanje](../README.md#deployment)

## Članovi tima i uloge

Ažurirani popis članova, njihovih GitHub profila i glavnih uloga ili doprinosa nalazi se u [README-u repozitoriju](../README.md#team-members).

## Kazalo dokumentacije

| Stranica | Svrha |
| --- | --- |
| [1. Opseg projekta](1-Projekt.md) | Problem, cilj i granice projekta |
| [2. Analiza zahtjeva](2-Analiza-zahtjeva.md) | Zahtjevi, ograničenja i sljedivost |
| [3. Obrasci uporabe](3-Obrasci-uporabe.md) | Akteri i reprezentativne interakcije korisnika |
| [4. Arhitektura i oblikovanje](4-Arhitektura-i-oblikovanje.md) | Glavne odluke oblikovanja, struktura, podaci i ponašanje |
| [5. Ispitivanje](5-Ispitivanje.md) | Pristup ispitivanju, stvarni rezultati i poznati nedostaci |
| [6. Postavljanje, instalacija i konfiguracija](6-Postavljanje-instalacija-i-konfiguracija.md) | Lokalna instalacija, konfiguracija, javno postavljanje i administracija |
| [7. Zaključak i budući rad](7-Zakljucak-i-buduci-rad.md) | Zaključak i moguća daljnja poboljšanja |
| [A. Pregled aktivnosti grupe](A-Pregled-aktivnosti-grupe.md) | Aktivnosti tima, doprinosi i izazovi |

## Ključne točke projekta

| Kontrolna točka | Demonstracija | Video |
| --- | --- | --- |
| Iteracija 1 |[www.unideal.site](https://www.unideal.site) | nije snimljen |
| Završni pregled | [www.unideal.site](https://www.unideal.site) | nije snimljen |

Dokumentacija se kontinuirano ažurira kako se aplikacija razvija.

## Organizacija projekta i razvojni proces

**Način rada:** Posao je podijeljen u sedam područja, po jedno za svakog člana tima (vidi README). Zadaci se vode kao GitHub Issues s oznakom područja. Svaki član radi na vlastitoj grani nazvanoj po sebi i zadatku, a promjene ulaze u granu `master` kroz pull request koji pregleda voditelj tima; CI pritom provjerava lint, testove i izgradnju. Tim komunicira u privatnoj grupi na Discordu, gdje se raspravlja o odlukama i zadacima te javlja što je napravljeno. Rad je organiziran prema rokovima predaje.   
**Praćenje trenutačnih zadataka i nedostataka:** [GitHub Issues](https://github.com/matejban/UniDeal/issues)


## Pravila dokumentacije

Dokumentacija se sastoji od međusobno povezanih Markdown stranica. Obavezni UML dijagrami izrađuju se u PlantUML-u, uz PlantUML izvor u dokumentaciji sačuvajte i čitljivu sliku. Primjeri u ovom predlošku kolegija pokazuju kako nešto dokumentirati; nisu dio rezultata studentskog projekta.

## Akademski integritet, ponašanje i licenciranje

README repozitorija sadrži projektnu [izjavu o uporabi umjetne inteligencije](../README.md#ai-usage), [informacije o kodeksu ponašanja i podršci](../README.md#code-of-conduct-and-support) te [status licence ili ponovne uporabe](../README.md#license). Pristupni podaci i druge tajne nikada se ne objavljuju u dokumentaciji niti dijele u običnim porukama.

## Izjava o uporabi umjetne inteligencije

<!-- UPUTA: Ovo je detaljan zapis uporabe umjetne inteligencije; README sadrži kratak sažetak i poveznicu na ovaj odjeljak. Unesite samo ono što se stvarno dogodilo i uklonite neupotrijebljene retke. Ako nije korišten nijedan alat generativne umjetne inteligencije, zamijenite cijeli odjeljak jednom rečenicom koja to jasno navodi. Svaki redak mora upućivati na stranicu, datoteku, zahtjev za uključivanje promjena (PR) ili zadatak. Nikada ne unosite pristupne podatke, osobne podatke ni tuđi zaštićeni sadržaj u alate umjetne inteligencije. -->

Kratak sažetak: [README – Uporaba umjetne inteligencije](../README.md#ai-usage). Ovaj odjeljak bilježi koji su alati korišteni, za koju dokumentaciju ili kod te kako je tim provjerio rezultat. Slijedi FER-ova [pravila o primjerenoj uporabi umjetne inteligencije](https://www.fer.unizg.hr/_download/repository/Policy%20on%20the%20appropriate%20use%20of%20artificial%20intelligence%20at%20the%20faculty%20of%20electrical%20engineering%20and%20computing%5B1%5D.pdf).

### Korišteni alati

| Alat | Inačica ili model | Koristio/la | Glavna svrha |
| --- | --- | --- | --- |
| Claude (Anthropic) | Opus 5.5 | svi članovi tima | objašnjavanje koda i tehnologija, pomoć pri pisanju koda i traženju grešaka, prijedlozi teksta dokumentacije i PlantUML dijagrama, priprema prezentacije za predstavljanje zahtjeva (poglavlje 2) na vježbama, prepisivanje i opisi zadataka u GitHub Issues, komentari na zajedničkim zadacima |

### Opseg doprinosa umjetne inteligencije

| Stranica, datoteka ili artefakt | Vrsta pomoći | Što je alat proizveo | Što je tim zadao i promijenio | Lokacija |
| --- | --- | --- | --- | --- |
| Dokumentacija područja 5: UC-5.1 – UC-5.4, retci 2.6, ispitivanje CT-5.x i ST-5.x | Izrada nacrta | Prijedlog teksta prema kodu | Tekst provjeren prema kodu i aplikaciji i ispravljen; testove sam izvela i upisala stvarne rezultate | [3](3-Obrasci-uporabe.md), [2.6](2-Analiza-zahtjeva.md), [5](5-Ispitivanje.md) |
| Kod kupona (#27, #29) | Objašnjenje i prijedlozi dijelova koda | Prijedlozi po koracima | Kod sam pokrenula i testirala lokalno (`npm run dev`, `npm test`), izmijenila dijelove i ručno provjerila na [www.unideal.site](https://www.unideal.site) | PR #67, PR #73 |
| Dijagram razreda 4.3.2 | Izvor dijagrama | Nacrt PlantUML-a prema kodu | Iscrtan, uspoređen s kodom i pojednostavljen |[`4-3-unideal-domain-CD.puml`](puml/4-3-unideal-domain-CD.puml) |
| Kod karte i geokodiranja (#23, #24) | Prijedlozi koda i objašnjenje | Prijedloge koda za kartu, geokodiranje i ručno označavanje lokacije te jedinične testove | Odredio opseg prema zadacima, napravio i ograničio ključeve u Google Cloudu, pregledao promjene, pokrenuo testove i ispitao kartu i lokaciju partnera s pravim ključevima te otvorio PR-ove | PR #91, PR #92 |
| 2. Analiza zahtjeva | Izrada nacrta i preoblikovanje | Nacrt zahtjeva, aktera, ograničenja i pretpostavki prema projektnom zadatku | Nacrt sam provjerio prema predlošku i projektnom zadatku te odlučio o uklanjanju izmišljenih datuma i spajanju srodnih zahtjeva prema komentaru asistentice | [2](2-Analiza-zahtjeva.md) |
| Dokumentacija područja 4: UC-4.1 – UC-4.4, retci 2.6, CT-4.x i ST-4.x, 4.1 | Izrada nacrta | Prijedlog teksta prema kodu | Tekst sam provjerio prema kodu i aplikaciji; ručne testove ST-4.x sam izveo | [3](3-Obrasci-uporabe.md), [2.6](2-Analiza-zahtjeva.md), [5](5-Ispitivanje.md), [4.1](4-Arhitektura-i-oblikovanje.md) |
| Kod pretplate: Stripe klijent i cijene (#32), Stripe Checkout (#33) | Objašnjenje, prijedlozi i debuggiranje dijelova koda | Prijedlozi za kod, testove i migraciju s cijenama prema opisu zadataka | Kod sam testirao, u Stripeu napravio proizvod i cijene, upisao ID-eve u bazu, ispitao plaćanje testnim karticama na www.unideal.site i proveo kod kroz pregled PR-a | PR #74, PR #90 |
| Dokumentacija područja 6: UC-6.1, UC-6.2, retci 2.6, CT-6.x, ST-6.x | Izrada nacrta | Savjeti u izvedbi testova | Ručne testove ST-6.x sam izveo i upisao stvarne rezultate | [3](3-Obrasci-uporabe.md), [2.6](2-Analiza-zahtjeva.md), [5](5-Ispitivanje.md), PR #94, PR #101 |
| [npr. 3. Obrasci uporabe, UC-002] | [Izrada nacrta / preoblikovanje / prijevod / izvor dijagrama / sažimanje] | [Kratak opis] | [Ulaz zadan alatu; dodane, ispravljene ili uklonjene činjenice] | [Stranica dokumentacije, `.puml` datoteka, PR] |

Stranice i artefakti koji nisu navedeni iznad izrađeni su bez pomoći generativne umjetne inteligencije. [Po želji: kao dodatne retke navedite kod ili ispitivanja izrađena uz pomoć umjetne inteligencije.]

### Provjera generiranog sadržaja

| Provjera | Kako je provedena | Dokaz |
| --- | --- | --- |
| Činjenična točnost | Tekst dokumentacije uspoređen je s kodom na grani `master` i s pokrenutom aplikacijom na www.unideal.site | Pregled pull requesta (voditelj tima), npr. PR #95 |
| Nema tvrdnji o neostvarenim funkcionalnostima | Neostvareno je u 2.6 označeno kao _na čekanju_, a u README-u navedeno pod Ograničenja | [2.6](2-Analiza-zahtjeva.md), [5.4](5-Ispitivanje.md), [README](../README.md) |
| Dosljednost s drugim stranicama | Oznake zahtjeva (F, NF), obrazaca uporabe (UC) i testova (CT, ST) povezane su u tablici sljedivosti | [2.6 Sljedivost](2-Analiza-zahtjeva.md) |
| Izvori dijagrama | PlantUML je iscrtan na plantuml.com i pregledan prije commita; slika i izvor su u repou | `docs/puml/`, `docs/assets/diagrams/` |
| Povjerljivi sadržaj | U alat se ne unose sadržaj datoteke `.env.local`, lozinke ni podaci korisnika; ključevi su samo u postavkama Vercela i Supabasea | `.gitignore` (pravilo `.env.*`) ne pušta `.env.local` u repozitorij |

### Pogreške pronađene u izlazu umjetne inteligencije

| Problem | Kako je pronađen | Rješenje |
| --- | --- | --- |
| Koraci CT-5.1 i CT-5.2 tražili su da se u ispisu pogleda skupina testova | Pokretanjem `npm test`: zadani ispis Vitesta ne prikazuje skupine | Koraci promijenjeni u `npm test -- --reporter=verbose` |
| Karta za ručno označavanje lokacije nakon spremanja nove adrese zadržavala je staru oznaku | Ispitivanjem ST-4.6 | Karta se ponovno stvara kad se lokacija u bazi promijeni (PR #92) |
| Nacrt analize zahtjeva sadržavao je izmišljene datume i sastanak s asistentom koji se nije dogodio | Pregledom nacrta | Datumi i sastanak uklonjeni |
| Komponenta karte pozivala je setState izravno u efektu | `npm run lint` | Ispravljeno prije commita |
| U uputi za upis ID-eva Stripeovih cijena ostali su zamjenski tekstovi `price_MONTHLY_ID` i `price_YEARLY_ID`, koji su tako upisani u `subscription_prices`, pa plaćanje pretplate nije moglo započeti | Provjerom tablice `subscription_prices` uočeni zamjenski tekstovi umjesto pravih ID-eva (Stripe za njih javlja „No such price”) | U SQL Editoru upisani pravi ID-evi cijena iz Stripea; plaćanje ispitano testnom karticom na [www.unideal.site](https://www.unideal.site/partner/pretplata) |
| Uputa je tražila ispitivanje plaćanja na preview adresi grane `josip/33-stripe-checkout`, izgrađenoj prije nego što je u Vercel dodan `STRIPE_SECRET_KEY`, pa je plaćanje javljalo grešku | Usporedbom vremena izgradnje previewa s vremenom dodavanja varijable u Vercelu | Ispitivanje provedeno na produkciji nakon ponovnog postavljanja (Redeploy), koje učitava nove varijable |
| [Netočna, izmišljena ili iz predloška preuzeta tvrdnja] | [Pregled, ispitivanje ili usporedba s aplikacijom] | [Ispravak s poveznicom] |

<!-- UPUTA: Zabilježite stvarne ispravke ili napišite „Nisu utvrđene”. Općenita tvrdnja poput „sav tekst je pregledan” nije dokaz; dokaz su prethodne tablice. Tim mora moći objasniti svaku rečenicu koju objavi. -->

<details>
<summary><strong>Primjer zapisa uporabe umjetne inteligencije</strong></summary>

**Primjer — CrisisMap:**

| Stranica ili artefakt | Vrsta pomoći | Što je alat proizveo | Što je tim zadao i promijenio | Lokacija |
| --- | --- | --- | --- | --- |
| 3. Obrasci uporabe, UC-002 | Izrada nacrta | Prvu inačicu glavnog i alternativnih tijekova | Tim je zadao stvarna polja obrasca i uklonio granu prijave u sustav koja u aplikaciji ne postoji | Primjer PR #31 |
| Sekvencijski dijagram, podnošenje prijave | Izvor dijagrama | Nacrt PlantUML-a | Tim je uskladio nazive sudionika s komponentama i uklonio korak slanja obavijesti koji nije implementiran | `diagrams/report-submission.puml` (primjer) |

| Problem | Kako je pronađen | Rješenje |
| --- | --- | --- |
| U tekstu je stajalo da se obavijesti dostavljaju unutar jedne minute | Usporedba s Ispitivanjem (5.4): dostava nikada nije ispitana | Tvrdnja je uklonjena; obavijesti su navedene pod Budućim radom |
| Nacrt je kopirao primjer zahtjeva F-005 iz predloška kao projektni zahtjev | Usporedba s vlastitim popisom zahtjeva tima | Zamijenjeno stvarnim zahtjevom tima |

**Analiza primjera:** Svaki redak navodi stranicu ili datoteku, ono što je alat generirao i ono što je tim promijenio. Pogreške su tipične za generiranu dokumentaciju: funkcionalnost koja ne postoji i tekst predloška prikazan kao činjenica o projektu. Tvrdnje poput „AI je korišten svugdje” ili „sav tekst je pregledan” nije moguće provjeriti. Ovo je nastavni scenarij, a ne opis objavljenog projekta.

</details>
