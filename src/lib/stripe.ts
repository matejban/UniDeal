import "server-only";
import Stripe from "stripe";

let client: Stripe | undefined;

// Jedini Stripe klijent u aplikaciji (#32). Koristi tajni ključ, pa se smije uvoziti samo na poslužitelju (NF-04).
// Stvara se tek pri prvom pozivu: izgradnja i CI rade i bez ključa, a funkcije koje trebaju Stripe
// bez ključa javljaju jasnu grešku, slično kao e-mail bez RESEND_API_KEY.
export function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error("STRIPE_SECRET_KEY nije postavljen (vidi .env.example).");
  }
  client ??= new Stripe(key);
  return client;
}
