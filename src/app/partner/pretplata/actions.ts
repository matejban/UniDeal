"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { requireRole } from "@/lib/auth";
import { originFromHeaders } from "@/lib/origin";
import { subscriptionService } from "@/services";

// Partner klikne na plan i odlazi na Stripeovu stranicu za plaćanje (F-008).
export async function startCheckout(plan: string) {
  const user = await requireRole("partner");

  const requestHeaders = await headers();
  const origin = originFromHeaders((name) => requestHeaders.get(name));

  let url = "";
  let errorReason = "";
  try {
    const result = await subscriptionService.startCheckout(user, plan, {
      // Status pretplate se ovdje ne postavlja, to radi webhook (#34).
      successUrl: `${origin}/partner/pretplata?uspjeh=1`,
      cancelUrl: `${origin}/partner/pretplata?otkazano=1`,
    });
    if (result.ok) {
      url = result.url;
    } else {
      errorReason = result.reason;
    }
  } catch (e) {
    console.error("Pokretanje plaćanja nije uspjelo:", e);
    errorReason = "placanje";
  }

  // redirect mora biti izvan try/catch
  if (errorReason) {
    redirect(`/partner/pretplata?greska=${errorReason}`);
  }
  redirect(url);
}
