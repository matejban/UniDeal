// Podaci za stranicu za plaćanje. Sve što je Stripeovo skriveno je iza ovog sučelja,
// pa se pravila naplate mogu ispitati bez Stripea.
export type CheckoutRequest = {
  // ID cijene u Stripeu (subscription_prices.stripe_price_id).
  priceId: string;
  // ID partnera: po njemu webhook (#34) zna kome pripada plaćanje.
  partnerId: string;
  customerEmail: string;
  successUrl: string;
  cancelUrl: string;
};

export interface PaymentGateway {
  // Stvara sesiju plaćanja pretplate i vraća adresu Stripeove stranice na koju šaljemo partnera.
  createCheckout(request: CheckoutRequest): Promise<string>;
}
