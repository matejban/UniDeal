"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { DiscountType, UsageLimit } from "@/domain/Offer";
import { requireRole } from "@/lib/auth";
import type { OfferInput } from "@/repositories/OfferRepository";
import { offerService } from "@/services";
import type { OfferErrors } from "@/services/OfferService";

// vraćamo upisane vrijednosti da se ne izgube kad je greška
export type OfferFormValues = Omit<OfferInput, "discountValue"> & { discountValue: string };
export type OfferFormState = { errors: OfferErrors; values: OfferFormValues };

function readField(formData: FormData, name: string): string {
  const value = formData.get(name);
  if (typeof value !== "string") {
    return "";
  }
  return value.trim();
}

function readValues(formData: FormData): OfferFormValues {
  return {
    title: readField(formData, "title"),
    description: readField(formData, "description"),
    categoryId: readField(formData, "categoryId"),
    discountType: readField(formData, "discountType") as DiscountType,
    discountValue: readField(formData, "discountValue"),
    validUntil: readField(formData, "validUntil"),
    conditions: readField(formData, "conditions"),
    usageLimit: readField(formData, "usageLimit") as UsageLimit,
  };
}

// da radi i 5,50 sa zarezom
function toInput(values: OfferFormValues): OfferInput {
  const discount = values.discountValue === "" ? NaN : Number(values.discountValue.replace(",", "."));
  return { ...values, discountValue: discount };
}

// ako nije odabrana slika dode prazan File
function readPhoto(formData: FormData): File | null {
  const file = formData.get("photo");
  if (file instanceof File && file.size > 0) {
    return file;
  }
  return null;
}

function revalidateOffer(offerId?: string) {
  revalidatePath("/ponude");
  if (offerId) {
    revalidatePath(`/ponude/${offerId}`);
  }
  revalidatePath("/partneri/[id]", "page");
  revalidatePath("/partner");
}

// F-011
export async function createOffer(_prev: OfferFormState, formData: FormData): Promise<OfferFormState> {
  const user = await requireRole("partner");
  const values = readValues(formData);

  let errors: OfferErrors;
  try {
    errors = await offerService.createOffer(user.id, toInput(values), readPhoto(formData));
  } catch (e) {
    console.error("Spremanje ponude nije uspjelo:", e);
    errors = { form: "Spremanje nije uspjelo. Pokušaj ponovno." };
  }
  if (Object.keys(errors).length > 0) {
    return { errors, values };
  }

  revalidateOffer();
  redirect("/partner?poruka=spremljena");
}

export async function updateOffer(offerId: string, _prev: OfferFormState, formData: FormData): Promise<OfferFormState> {
  const user = await requireRole("partner");
  const values = readValues(formData);

  let errors: OfferErrors;
  try {
    errors = await offerService.updateOffer(user.id, offerId, toInput(values), readPhoto(formData));
  } catch (e) {
    console.error("Spremanje ponude nije uspjelo:", e);
    errors = { form: "Spremanje nije uspjelo. Pokušaj ponovno." };
  }
  if (Object.keys(errors).length > 0) {
    return { errors, values };
  }

  revalidateOffer(offerId);
  redirect("/partner?poruka=spremljena");
}

export async function deleteOffer(offerId: string) {
  const user = await requireRole("partner");

  let deleted = false;
  try {
    deleted = await offerService.deleteOffer(user.id, offerId);
  } catch (e) {
    console.error("Brisanje ponude nije uspjelo:", e);
  }

  // redirect mora biti izvan try/catch
  if (!deleted) {
    redirect(`/partner/ponude/${offerId}/uredi?greska=brisanje`);
  }
  revalidateOffer(offerId);
  redirect("/partner?poruka=obrisana");
}
