"use server";

import { redirect } from "next/navigation";
import { requireRole } from "@/lib/auth";
import { couponService } from "@/services";

// student klikne "Generiraj kupon" (F-020)
export async function issueCoupon(offerId: string) {
  const user = await requireRole("student");

  let couponId = "";
  let errorReason = "";
  try {
    const result = await couponService.issue(user, offerId);
    if (result.ok) {
      couponId = result.coupon.id;
    } else {
      errorReason = result.reason;
    }
  } catch (e) {
    console.error("Generiranje kupona nije uspjelo:", e);
    errorReason = "1";
  }

  // redirect mora biti izvan try/catch
  if (errorReason) {
    redirect(`/ponude/${offerId}?greska=${errorReason}`);
  }
  redirect(`/student/kuponi/${couponId}`);
}