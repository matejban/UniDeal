import { getStripe } from "@/lib/stripe";
import type { CheckoutRequest, PaymentGateway } from "@/services/PaymentGateway";

// Stripe Checkout (F-008): partner plaća na Stripeovoj stranici, a podaci o kartici nikad ne prolaze kroz naš poslužitelj (NF-05).
export class StripePaymentGateway implements PaymentGateway {
  async createCheckout(request: CheckoutRequest): Promise<string> {
    const session = await getStripe().checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: request.priceId, quantity: 1 }],
      customer_email: request.customerEmail,
      // Webhook (#34) po ovome zna kojem partneru pripada plaćanje. ID je i u pretplati,
      // jer kasniji događaji (obnova, otkazivanje) ne nose client_reference_id.
      client_reference_id: request.partnerId,
      metadata: { partner_id: request.partnerId },
      subscription_data: { metadata: { partner_id: request.partnerId } },
      locale: "hr",
      success_url: request.successUrl,
      cancel_url: request.cancelUrl,
    });

    if (!session.url) {
      throw new Error("Stripe nije vratio adresu stranice za plaćanje.");
    }
    return session.url;
  }
}
