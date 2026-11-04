"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireRole } from "@/lib/auth";
import { partnerService } from "@/services";
import type { PartnerRegistration, RegistrationErrors } from "@/services/PartnerService";

export type RegistrationState = { errors: RegistrationErrors; values: PartnerRegistration };

// Registracija partnera (F-006). Greške i upisane vrijednosti vraćaju se obrascu da ih korisnik ne mora ponovno upisivati.
export async function registerPartner(_prev: RegistrationState, formData: FormData): Promise<RegistrationState> {
  const user = await requireRole("partner");

  const field = (name: string) => String(formData.get(name) ?? "").trim();
  const values: PartnerRegistration = {
    name: field("name"),
    oib: field("oib"),
    categoryId: field("categoryId"),
    address: field("address"),
    city: field("city"),
    phone: field("phone"),
  };
  let errors: RegistrationErrors;
  try {
    errors = await partnerService.register(user.id, values);
  } catch (e) {
    console.error("Registracija partnera nije uspjela:", e);
    errors = { form: "Spremanje nije uspjelo. Pokušaj ponovno." };
  }
  if (Object.keys(errors).length > 0) return { errors, values };

  revalidatePath("/partner");
  redirect("/partner");
}
