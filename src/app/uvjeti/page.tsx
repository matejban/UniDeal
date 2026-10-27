import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Uvjeti korištenja · UniDeal" };

// Uvjeti korištenja (F-032). Korisnik ih prihvaća pri prvoj prijavi na /dobrodoslica.
export default function TermsPage() {
  return (
    <article className="max-w-2xl space-y-6 text-sm leading-6 text-gray-800">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Uvjeti korištenja</h1>
        <p className="mt-1 text-gray-500">Vrijede od 27. listopada 2026.</p>
      </div>

      <p>
        UniDeal povezuje studente hrvatskih visokih učilišta s lokalnim poslovnim subjektima koji im nude popuste.
        UniDeal je studentski projekt nastao na kolegiju Programsko inženjerstvo na Fakultetu elektrotehnike i
        računarstva Sveučilišta u Zagrebu. Korištenjem platforme prihvaćaš ove uvjete.
      </p>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold text-gray-900">1. Tko smije koristiti platformu</h2>
        <ul className="list-disc space-y-1 pl-5">
          <li>Ponude i kartu može pregledavati svatko, i bez prijave.</li>
          <li>
            Kupone smiju generirati i koristiti samo studenti hrvatskih visokih učilišta prijavljeni studentskim
            Microsoft računom. Kupon je osoban i ne smiješ ga ustupiti drugoj osobi.
          </li>
          <li>
            Partneri su poslovni subjekti prijavljeni Google računom ili e-mailom. Profil i ponude partnera javno su
            vidljivi tek kada ih administrator odobri i dok partner ima aktivnu pretplatu.
          </li>
        </ul>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold text-gray-900">2. Korištenje kupona i studentska iskaznica</h2>
        <p>
          Status studenta prepoznajemo po adresi e-pošte učilišta. Ista adresa ne razlikuje studenta od djelatnika
          učilišta, pa je provjera na prodajnom mjestu obavezna:
        </p>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            Pri korištenju kupona student partneru pokazuje <strong>važeću studentsku iskaznicu (X-icu)</strong>.
          </li>
          <li>Partner smije odbiti popust ako student ne pokaže X-icu ili ako podaci na njoj ne odgovaraju.</li>
          <li>Kupon vrijedi do isteka ponude i za uvjete koje je partner naveo u ponudi.</li>
        </ul>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold text-gray-900">3. Obveze partnera</h2>
        <ul className="list-disc space-y-1 pl-5">
          <li>Partner unosi točne podatke o poslovnom subjektu i ponudama.</li>
          <li>Partner poštuje objavljene ponude za studente koji pokažu kupon i X-icu.</li>
          <li>Kupon potvrđuje u aplikaciji tek kada je popust stvarno odobren.</li>
        </ul>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold text-gray-900">4. Recenzije i sadržaj</h2>
        <p>
          Student može ocijeniti partnera samo nakon iskorištenog kupona. Recenzija mora biti istinita i pristojna.
          Administrator uklanja neprimjerene ponude i recenzije te može deaktivirati račun koji krši ove uvjete.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold text-gray-900">5. Osobni podaci</h2>
        <p>Prikupljamo samo podatke potrebne za rad platforme:</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>adresu e-pošte, ime i prezime, ulogu te, za studente, naziv učilišta prema domeni adrese;</li>
          <li>za partnere podatke o poslovnom subjektu: naziv, OIB, adresu, telefon, radno vrijeme i opis;</li>
          <li>kupone, recenzije, favorite i pretplate na obavijesti koje sam napraviš;</li>
          <li>vrijeme prihvaćanja ovih uvjeta.</li>
        </ul>
        <p>
          Tvoju lokaciju ne spremamo; karta je koristi samo u pregledniku. Podatke o platnim karticama obrađuje
          isključivo Stripe i ne spremamo ih. Podaci se čuvaju u Supabaseu u Europskoj uniji, a e-poštu šaljemo
          putem usluge Resend. Prijavu obavljaju Microsoft i Google, od kojih dobivamo samo adresu e-pošte i ime.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold text-gray-900">6. Deaktivacija računa</h2>
        <p>
          Svoj račun možeš deaktivirati u svakom trenutku na stranici{" "}
          <Link href="/profil" className="text-blue-700 underline">
            Moj račun
          </Link>
          . Nakon deaktivacije više se ne možeš prijaviti, a tvoje ponude i recenzije nisu javno vidljive.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold text-gray-900">7. Promjene uvjeta</h2>
        <p>
          Uvjete možemo promijeniti. Na ovoj stranici uvijek je trenutačna inačica s datumom od kojeg vrijedi.
        </p>
      </section>
    </article>
  );
}
