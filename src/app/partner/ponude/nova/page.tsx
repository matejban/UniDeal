import Link from "next/link";
import { redirect } from "next/navigation";
import { today } from "@/domain/Offer";
import { requireRole } from "@/lib/auth";
import { offerService, partnerService } from "@/services";
import { createOffer } from "../actions";
import OfferForm from "../OfferForm";

export default async function NewOfferPage() {
  const user = await requireRole("partner");
  const partner = await partnerService.getByOwner(user.id);
  if (!partner) {
    redirect("/partner/registracija");
  }
  // samo odobreni partner (F-025)
  if (partner.approvalStatus !== "odobren") {
    redirect("/partner");
  }
  const categories = await offerService.getCategories();

  return (
    <div className="mx-auto max-w-md space-y-6">
      <div>
        <Link href="/partner" className="text-sm text-blue-700 hover:underline">Natrag na partnersku ploču</Link>
        <h1 className="mt-2 text-2xl font-bold">Nova ponuda</h1>
        <p className="mt-1 text-sm text-gray-600">Ponuda se sprema kao nacrt i studenti je ne vide dok je ne objaviš.</p>
      </div>
      <OfferForm
        action={createOffer}
        values={{
          title: "",
          description: "",
          categoryId: "",
          discountType: "postotak",
          discountValue: "",
          validUntil: "",
          conditions: "",
          usageLimit: "neograniceno",
        }}
        categories={categories}
        photoUrl={null}
        minDate={today()}
        submitLabel="Spremi nacrt"
      />
    </div>
  );
}
