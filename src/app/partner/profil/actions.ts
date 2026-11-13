"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth";
import type { PartnerProfile } from "@/repositories/PartnerRepository";
import { partnerService } from "@/services";
import type { ProfileErrors } from "@/services/PartnerService";

export type ProfileState = { errors: ProfileErrors; values: PartnerProfile; saved: boolean };

// Vrijednost polja iz obrasca bez razmaka na početku i kraju.
function readField(formData: FormData, name: string): string {
  const value = formData.get(name);
  if (typeof value !== "string") {
    return "";
  }
  return value.trim();
}

// Spremanje javnog profila partnera (F-010).
export async function updateProfile(_prev: ProfileState, formData: FormData): Promise<ProfileState> {
  const user = await requireRole("partner");

  const values: PartnerProfile = {
    name: readField(formData, "name"),
    address: readField(formData, "address"),
    city: readField(formData, "city"),
    phone: readField(formData, "phone"),
    hours: readField(formData, "hours"),
    description: readField(formData, "description"),
  };

  // Profil se traži po prijavljenom korisniku, a ne po ID-u iz obrasca, pa partner ne može urediti tuđi profil.
  const partner = await partnerService.getByOwner(user.id);
  if (!partner) {
    return { errors: { form: "Još nemaš profil partnera." }, values, saved: false };
  }

  let errors: ProfileErrors;
  try {
    errors = await partnerService.updateProfile(partner.id, user.id, values);
  } catch (e) {
    console.error("Spremanje profila partnera nije uspjelo:", e);
    errors = { form: "Spremanje nije uspjelo. Pokušaj ponovno." };
  }

  if (Object.keys(errors).length > 0) {
    return { errors, values, saved: false };
  }

  // Promjena se odmah vidi na javnom profilu i na partnerskoj ploči, a nova adresa i na karti (#24).
  revalidatePath(`/partneri/${partner.id}`);
  revalidatePath("/partner");
  revalidatePath("/partner/profil");
  revalidatePath("/karta");
  return { errors: {}, values, saved: true };
}

export type LocationState = { error: string; saved: boolean };

// Ručno označena lokacija partnera na karti, kad geokodiranje ne pronađe adresu (F-013, #24).
export async function saveLocation(_prev: LocationState, formData: FormData): Promise<LocationState> {
  const user = await requireRole("partner");

  const lat = readField(formData, "lat");
  const lng = readField(formData, "lng");
  if (lat === "" || lng === "") {
    return { error: "Klikni na kartu da označiš lokaciju.", saved: false };
  }

  const partner = await partnerService.getByOwner(user.id);
  if (!partner) {
    return { error: "Još nemaš profil partnera.", saved: false };
  }

  let error: string;
  try {
    error = await partnerService.setLocation(partner.id, user.id, { lat: Number(lat), lng: Number(lng) });
  } catch (e) {
    console.error("Spremanje lokacije nije uspjelo:", e);
    error = "Spremanje nije uspjelo. Pokušaj ponovno.";
  }
  if (error !== "") {
    return { error, saved: false };
  }

  revalidatePath(`/partneri/${partner.id}`);
  revalidatePath("/partner");
  revalidatePath("/partner/profil");
  revalidatePath("/karta");
  return { error: "", saved: true };
}

export type LogoState = { error: string; saved: boolean };

// Učitavanje loga partnera (#13).
export async function updateLogo(_prev: LogoState, formData: FormData): Promise<LogoState> {
  const user = await requireRole("partner");

  const file = formData.get("logo");
  if (!(file instanceof File)) {
    return { error: "Odaberi sliku.", saved: false };
  }

  const partner = await partnerService.getByOwner(user.id);
  if (!partner) {
    return { error: "Još nemaš profil partnera.", saved: false };
  }

  let error: string;
  try {
    error = await partnerService.updateLogo(partner.id, user.id, file);
  } catch (e) {
    console.error("Učitavanje loga nije uspjelo:", e);
    error = "Učitavanje nije uspjelo. Pokušaj ponovno.";
  }
  if (error !== "") {
    return { error, saved: false };
  }

  revalidatePath(`/partneri/${partner.id}`);
  revalidatePath("/partner/profil");
  return { error: "", saved: true };
}
