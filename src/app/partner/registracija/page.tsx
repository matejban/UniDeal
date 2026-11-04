import { redirect } from "next/navigation";
import { requireRole } from "@/lib/auth";
import { partnerService } from "@/services";
import RegistrationForm from "./RegistrationForm";

// Partner jednom unosi podatke o poslovnom subjektu; profil zatim čeka odobrenje administratora (F-006).
export default async function PartnerRegistrationPage() {
  const user = await requireRole("partner");
  if (await partnerService.getByOwner(user.id)) redirect("/partner");
  const categories = await partnerService.getCategories();

  return (
    <div className="mx-auto max-w-md space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Registracija partnera</h1>
        <p className="mt-1 text-sm text-gray-600">
          Upiši podatke o svom poslovnom subjektu. Profil postaje javan kad ga odobri administrator.
        </p>
      </div>
      <RegistrationForm categories={categories} />
    </div>
  );
}
