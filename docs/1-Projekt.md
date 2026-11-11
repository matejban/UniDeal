# 1. Opseg projekta

## 1.1 Problem i cilj projekta

Studenti imaju pravo na brojne popuste i pogodnosti, ali ih je teško pronaći: ponude su razbacane po web-stranicama, društvenim mrežama i letcima i često su zastarjele. Partneri (trgovine, kafići, restorani, teretane, servisi, kulturne ustanove) nemaju jednostavan način da dopru do studentske populacije ni da saznaju koliko se njihove ponude stvarno koriste.

Cilj projekta je web platforma UniDeal koja povezuje studente i partnere na jednom mjestu. Studenti besplatno pretražuju aktualne ponude, vide ih na karti i koriste ih putem digitalnog kupona s QR kodom koji partner potvrđuje. Partneri uz mjesečnu ili godišnju pretplatu objavljuju ponude i vide broj pregleda i iskorištenja. Očekivana korist je pregled ponuda na jednom mjestu, zabilježeno stvarno korištenje popusta i recenzije koje mogu ostaviti samo studenti koji su ponudu iskoristili.

## 1.2 Ciljani korisnici i dionici

| Skupina korisnika ili dionika | Potreba ili interes relevantan za ovaj projekt                                                                                                                                                                                                                                          |
| ----------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Student                       | Pronaći aktualne popuste prema kategoriji, gradu i blizini, spremiti favorite, generirati kupon i ocijeniti iskorištenu ponudu. Platformu koristi besplatno; prijavljuje se računom svog visokog učilišta (Microsoft), čime je potvrđen status studenta potreban za generiranje kupona. |
| Partner                       | Objaviti ponude, potvrditi korištenje kupona (kod ili QR) i pratiti broj pregleda, iskorištenja i prosječnu ocjenu. Plaća mjesečnu ili godišnju pretplatu; profil postaje javan nakon odobrenja administratora i aktivacije pretplate.                                                  |
| Administrator                 | Odobravati partnere, upravljati korisnicima, kategorijama i sadržajem, uklanjati neprimjerene ponude i recenzije, određivati cijenu pretplate te pregledavati i izvoziti statistiku (CSV ili PDF).                                                                                      |

## 1.3 Granice projekta

**Uključeno:** Prijava studenata studentskim Microsoft računom, čime je potvrđen status studenta, a partnera Google računom ili e-mailom i lozinkom (administrator se dodjeljuje ručno); profili partnera i ponude sa statusima nacrt, aktivna i istekla; pretraga, filtriranje i prikaz ponuda na karti; favoriti; kuponi s kodom i QR kodom te partnerska potvrda korištenja; ocjene i recenzije nakon iskorištenja; pretplata partnera; e-mail obavijesti; administratorski panel, statistika i izvoz izvještaja.  
**Izvan opsega ili odgođeno:** Prijava putem AAI@EduHr i pouzdano razlikovanje studenata od djelatnika ustanove (vidi [7.3 Budući rad](7-Zakljucak-i-buduci-rad.md#73-budući-rad)). [Tim treba dogovoriti ostale stavke, npr. plaćanje samih popusta kroz platformu ili mobilnu aplikaciju.]
**Vanjske ovisnosti:** Microsoft Entra ID (prijava studenata), Google OAuth 2.0 (prijava partnera), Google Maps API (karta i geokodiranje), Stripe (naplata pretplate), servis za slanje e-maila (Resend), Supabase (baza, autentifikacija i pohrana datoteka) i Vercel (smještaj aplikacije).

## 1.4 Postojeći pristupi i opravdanost projekta

Student koji danas traži popust obično pretražuje web-stranice i profile pojedinih partnera na društvenim mrežama ili se oslanja na preporuke kolega. Postojeća rješenja pokrivaju samo dio potrebe:

- **Kolegio** ([kolegio.hr](https://kolegio.hr)) je hrvatska stranica sa studentskim pogodnostima koja provjerava status studenta i omogućuje spremanje ponuda u favorite. Ponude se ne mogu filtrirati po gradu, nema recenzija ni ocjena, a iz javno dostupnog sučelja nije vidljivo bilježi li se stvarno korištenje popusta niti nudi li partnerima uvid u statistiku.
- **ISIC** ([isic.hr](https://isic.hr)) vezuje popuste uz međunarodnu studentsku iskaznicu, pa student prvo mora izraditi iskaznicu da bi ih mogao koristiti.
- **UNiDAYS** ([myunidays.com](https://www.myunidays.com)) je međunarodna platforma sa studentskim popustima, ali na njoj nema ponude za Hrvatsku, pa hrvatski studenti i partneri od nje nemaju koristi.

UniDeal objedinjuje aktualne ponude s prikazom na karti, bilježi stvarno korištenje kuponom s QR kodom koji partner potvrđuje i dopušta recenzije samo studentima koji su ponudu iskoristili. Status studenta potvrđuje se prijavom računom visokog učilišta, bez izrade dodatne iskaznice.
