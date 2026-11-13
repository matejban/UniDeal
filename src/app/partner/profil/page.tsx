import Link from "next/link";
import { redirect } from "next/navigation";
import { requireRole } from "@/lib/auth";
import { CROATIA_CENTER } from "@/lib/geo";
import { partnerService } from "@/services";
import LocationPicker from "./LocationPicker";
import ProfileForm, { LogoForm } from "./ProfileForm";

// Partner uređuje svoj javni profil (F-010).
export default async function PartnerProfileEditPage() {
  const user = await requireRole("partner");
  const partner = await partnerService.getByOwner(user.id);
  if (!partner) {
    redirect("/partner/registracija");
  }

  const profile = {
    name: partner.name,
    address: partner.address,
    city: partner.city,
    phone: partner.phone,
    hours: partner.hours,
    description: partner.description,
  };

  // Karta za ručno označavanje lokacije (F-013, #24) otvara se na postojećoj lokaciji,
  // inače na gradu partnera ako u njemu već ima partnera na karti, inače na Hrvatskoj.
  const location = partner.lat !== null && partner.lng !== null ? { lat: partner.lat, lng: partner.lng } : null;
  const mapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  let initialCenter = CROATIA_CENTER;
  let initialZoom = 7;
  if (location) {
    initialCenter = location;
    initialZoom = 17;
  } else {
    const city = (await partnerService.getMapData()).cities.find((c) => c.name === partner.city);
    if (city) {
      initialCenter = city;
      initialZoom = 13;
    }
  }

  return (
    <div className="mx-auto max-w-md space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Uredi profil</h1>
        <p className="mt-1 text-sm text-gray-600">
          Ovi podaci prikazuju se na tvom javnom profilu kad ga odobri administrator i dok imaš aktivnu pretplatu.
        </p>
        <Link href={`/partneri/${partner.id}`} className="mt-2 inline-block text-sm text-blue-700 hover:underline">
          Pogledaj javni profil
        </Link>
      </div>
      <LogoForm logoUrl={partner.logoUrl} />
      <ProfileForm profile={profile} />

      <section id="lokacija" className="space-y-3 rounded-lg border border-gray-200 bg-white p-6">
        <p className="text-sm font-semibold">Lokacija na karti</p>
        {location ? (
          <p className="text-sm text-gray-600">
            Tvoj poslovni prostor označen je na karti. Ako oznaka nije na pravom mjestu, klikni na kartu i spremi novu
            lokaciju.
          </p>
        ) : (
          <p className="rounded bg-yellow-100 p-3 text-sm text-yellow-800">
            Adresa nije pronađena na karti, pa te studenti ne vide na karti partnera. Klikni na kartu na mjesto
            poslovnog prostora i spremi lokaciju.
          </p>
        )}
        {mapsApiKey ? (
          <LocationPicker
            // Nova lokacija iz baze (npr. nakon promjene adrese) ponovno stvara kartu, inače bi ostala stara oznaka.
            key={location ? `${location.lat},${location.lng}` : "bez-lokacije"}
            apiKey={mapsApiKey}
            location={location}
            initialCenter={initialCenter}
            initialZoom={initialZoom}
          />
        ) : (
          <p className="text-sm text-gray-600">Karta trenutačno nije dostupna, pa lokaciju sada nije moguće označiti.</p>
        )}
      </section>
    </div>
  );
}
