"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireRole } from "@/lib/auth";
import { categoryService } from "@/services";
import type { CategoryError } from "@/services/CategoryService";

const PAGE = "/admin/kategorije";

function errorUrl(error: CategoryError): string {
  if (error.code === "u-upotrebi") {
    return `${PAGE}?greska=u-upotrebi&ponuda=${error.offerCount}&partnera=${error.partnerCount}`;
  }
  return `${PAGE}?greska=${error.code}`;
}

// Zajednički tok radnji: provjera uloge, izvršavanje i javljanje ishoda (F-027).
// Baza ponovno provjerava ulogu kroz RLS. redirect() baca iznimku, pa ne smije biti unutar try bloka.
async function run(action: () => Promise<CategoryError | null>) {
  await requireRole("admin");

  let error: CategoryError | null;
  try {
    error = await action();
  } catch (e) {
    console.error("Promjena kategorije nije uspjela:", e);
    redirect(`${PAGE}?greska=1`);
  }
  if (error) redirect(errorUrl(error));

  // Kategorije se nude u filtru pretrage i pri registraciji partnera.
  revalidatePath(PAGE);
  revalidatePath("/ponude");
  revalidatePath("/partner/registracija");
}

export async function createCategory(formData: FormData) {
  const name = String(formData.get("name") ?? "");
  await run(() => categoryService.create(name));
}

export async function renameCategory(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const name = String(formData.get("name") ?? "");
  await run(() => categoryService.rename(id, name));
}

export async function deleteCategory(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  await run(() => categoryService.delete(id));
}
