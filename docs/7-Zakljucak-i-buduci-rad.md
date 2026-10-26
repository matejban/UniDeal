# 7. Zaključak i budući rad

**Cilj:** Objektivno procijeniti i dokumentirati konačni opseg onoga što je tim isporučio, kritički se osvrnuti na najvažnije inženjerske spoznaje stečene tijekom razvoja programa te identificirati realne mogućnosti nadogradnje.

## 7.1 Rezultati projekta

[Sažmite što korisnici mogu raditi u dovršenoj aplikaciji. Jasno razlikujte dovršene, djelomično ostvarene i neostvarene funkcionalnosti te opišite njihov učinak na korisnike. Tvrdnje temeljite na pokrenutoj aplikaciji i zabilježenim rezultatima ispitivanja.]

## 7.2 Izazovi i naučene lekcije

[Opišite jedan ili dva značajna tehnička ili organizacijska izazova. Objasnite što se dogodilo, kako je tim reagirao i što je iz toga naučio. Navedite znanja ili vještine koje bi timu pomogle da problem ranije prepozna ili riješi. Navedite što biste u sličnom projektu sljedeći put napravili drugačije i zašto.]

<details>
<summary><strong>Primjer: obrada lokacije pri prijavi događaja</strong></summary>

**Primjer — CrisisMap:** Tim se pri podnošenju prijava kriznih događaja u početku oslanjao na pristup lokaciji preglednika. Kada su korisnici odbili dopuštenje, nisu mogli zadati lokaciju. Tim je dodao mogućnost ručnog odabira lokacije i ispitao oba puta. To je pokazalo zašto funkcionalnost koja ovisi o dopuštenju od početka treba imati alternativni korisnički tijek.

**Analiza primjera:** Opis navodi poteškoću, odgovor tima i konkretnu naučenu lekciju. Ne tvrdi da je cijela aplikacija ispitana samo zato što je provjeren jedan tijek.

</details>

## 7.3 Budući rad

[Navedite mali broj opravdanih poboljšanja i ograničite se na nekoliko prioriteta. Razlikujte nedovršene funkcionalnosti potrebne za ispunjenje izvornog opsega od neobaveznih proširenja. Za svako ukratko objasnite korist i što bi trebalo promijeniti.]

### Prijava putem AAI@EduHr

Status studenta zasad se prepoznaje prema domeni e-mail adrese (pretpostavka AS-01 u [2.4](2-Analiza-zahtjeva.md#24-ograničenja-i-pretpostavke)). Domena ne razlikuje studenta od djelatnika iste ustanove, pa djelatnik može dobiti status studenta, a popis dopuštenih domena treba ručno održavati. Zasad to ublažavamo uvjetima korištenja (F-032): student pri korištenju kupona pokazuje partneru studentsku iskaznicu (X-icu), a partner smije odbiti popust ako je ne pokaže.

AAI@EduHr, sustav elektroničkih identiteta u hrvatskom sustavu znanosti i visokog obrazovanja, uz identitet korisnika šalje i podatak o njegovoj vezi s ustanovom (npr. student ili djelatnik). Prijava putem AAI@EduHr omogućila bi pouzdano prepoznavanje studenata svih visokih učilišta na isti način, bez popisa domena. Za to bi trebalo:

- registrirati aplikaciju kao resurs u AAI@EduHr, što je administrativni postupak kod matične ustanove ili Srca;
- povezati prijavu putem protokola SAML 2.0, koji Supabase Auth podržava tek na plaćenom planu Pro;
- dodjeljivati ulogu studenta prema podatku o vezi s ustanovom umjesto prema domeni e-mail adrese.

Zbog administrativnog postupka i troška to nije u opsegu ovog projekta (vidi [1.3 Granice projekta](1-Projekt.md#13-granice-projekta)).

---

>**Završna provjera:** Tvrdnje o dovršenim funkcionalnostima podudaraju se s postavljenom aplikacijom i rezultatima ispitivanja. Nedovršen rad jasno je naveden; planovi za budući rad ne prikazuju se kao dovršene funkcionalnosti. Utrošeno vrijeme i pojedinačni doprinosi dokumentirani su u dokumentu [A. Pregled aktivnosti grupe](A-Pregled-aktivnosti-grupe.md).
