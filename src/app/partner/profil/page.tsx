import Link from "next/link";
import { redirect } from "next/navigation";
import { requireRole } from "@/lib/auth";
import { partnerService } from "@/services";
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
    </div>
  );
}
