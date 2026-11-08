import { afterEach, describe, expect, it, vi } from "vitest";

// "server-only" baca grešku izvan Next.js poslužiteljskog okruženja, pa ga u testu zamjenjujemo praznim modulom.
vi.mock("server-only", () => ({}));

import { getStripe } from "./stripe";

describe("getStripe", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("javlja jasnu grešku kad STRIPE_SECRET_KEY nije postavljen", () => {
    vi.stubEnv("STRIPE_SECRET_KEY", "");
    expect(() => getStripe()).toThrow("STRIPE_SECRET_KEY");
  });

  it("vraća isti klijent pri svakom pozivu", () => {
    vi.stubEnv("STRIPE_SECRET_KEY", "sk_test_neispravan_kljuc_samo_za_test");
    expect(getStripe()).toBe(getStripe());
  });
});
