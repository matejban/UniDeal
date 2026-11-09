import Link from "next/link";
import { notFound } from "next/navigation";
import { today } from "@/domain/Offer";
import { requireRole } from "@/lib/auth";
import { offerService } from "@/services";
import { deleteOffer, updateOffer } from "../../actions";
import DeleteOfferButton from "../../DeleteOfferButton";
import OfferForm from "../../OfferForm";

// uređivanje i brisanje ponude (F-011)
export default async function EditOfferPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ greska?: string }>;
}) {
  const { id } = await params;
  const { greska } = await searchParams;
  const user = await requireRole("partner");
  const offer = await offerService.getOwnOffer(user.id, id);
  if (!offer) {
    notFound();
  }
  const categories = await offerService.getCategories();

  return (
    <div className="mx-auto max-w-md space-y-6">
      <div>
        <Link href="/partner" className="text-sm text-blue-700 hover:underline">Natrag na partnersku ploču</Link>
        <h1 className="mt-2 text-2xl font-bold">Uredi ponudu</h1>
      </div>

      {greska === "brisanje" && (
        <p className="rounded bg-red-50 p-3 text-sm text-red-700">Brisanje nije uspjelo. Pokušaj ponovno.</p>
      )}

      {offer.canBeEdited() ? (
        <OfferForm
          action={updateOffer.bind(null, offer.id)}
          values={{
            title: offer.title,
            description: offer.description,
            categoryId: offer.categoryId,
            discountType: offer.discountType,
            discountValue: offer.discountValue.toLocaleString("hr-HR", { useGrouping: false }),
            validUntil: offer.validUntil,
            conditions: offer.conditions,
            usageLimit: offer.usageLimit,
          }}
          categories={categories}
          photoUrl={offer.photoUrl}
          minDate={today()}
          submitLabel="Spremi promjene"
        />
      ) : (
        <p className="rounded bg-gray-100 p-3 text-sm text-gray-700">
          Ponuda „{offer.title}” je istekla i više se ne može uređivati. Možeš je obrisati.
        </p>
      )}

      <DeleteOfferButton action={deleteOffer.bind(null, offer.id)} title={offer.title} />
    </div>
  );
}
