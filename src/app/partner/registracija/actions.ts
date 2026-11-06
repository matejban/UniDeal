"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireRole } from "@/lib/auth";
import { partnerService } from "@/services";
import type { PartnerRegistration, RegistrationErrors } from "@/services/PartnerService";

export type RegistrationState = { errors: RegistrationErrors; values: PartnerRegistration };

// Vrijednost polja iz obrasca bez razmaka na početku i kraju.
function readField(formData: FormData, name: string): string {
  const value = formData.get(name);
  if (typeof value !== "string") {
    return "";
  }
  return value.trim();
}

// Registracija partnera (F-006). Kod grešaka obrazac dobiva i upisane vrijednosti da ih korisnik ne mora ponovno upisivati.
export async function registerPartner(_prev: RegistrationState, formData: FormData): Promise<RegistrationState> {
  const user = await requireRole("partner");

  const values: PartnerRegistration = {
    name: readField(formData, "name"),
    oib: readField(formData, "oib"),
    categoryId: readField(formData, "categoryId"),
    address: readField(formData, "address"),
    city: readField(formData, "city"),
    phone: readField(formData, "phone"),
  };

  let errors: RegistrationErrors;
  try {
    errors = await partnerService.register(user.id, values);
  } catch (e) {
    console.error("Registracija partnera nije uspjela:", e);
    errors = { form: "Spremanje nije uspjelo. Pokušaj ponovno." };
  }

  if (Object.keys(errors).length > 0) {
    return { errors, values };
  }

  revalidatePath("/partner");
  redirect("/partner");
}
