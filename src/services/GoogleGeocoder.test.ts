import { afterEach, describe, expect, it, vi } from "vitest";

// "server-only" baca grešku izvan Next.js poslužiteljskog okruženja, pa ga u testu zamjenjujemo praznim modulom.
vi.mock("server-only", () => ({}));

import { GoogleGeocoder, parseGeocodingResponse } from "./GoogleGeocoder";

function result(lat: number, lng: number, locationType = "ROOFTOP") {
  return { geometry: { location: { lat, lng }, location_type: locationType } };
}

describe("parseGeocodingResponse", () => {
  it("vraća koordinate prvog rezultata", () => {
    expect(parseGeocodingResponse({ status: "OK", results: [result(45.8, 15.97), result(1, 1)] })).toEqual({
      lat: 45.8,
      lng: 15.97,
    });
  });

  it("nepronađena adresa vraća null", () => {
    expect(parseGeocodingResponse({ status: "ZERO_RESULTS", results: [] })).toBeNull();
  });

  it("rezultat koji je samo grad ili područje smatra se nepronađenim", () => {
    expect(parseGeocodingResponse({ status: "OK", results: [result(45.81, 15.98, "APPROXIMATE")] })).toBeNull();
  });

  it("odbijen zahtjev je greška", () => {
    expect(() =>
      parseGeocodingResponse({ status: "REQUEST_DENIED", error_message: "The provided API key is invalid." }),
    ).toThrow("REQUEST_DENIED");
  });
});

describe("GoogleGeocoder", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("traži adresu s gradom u Hrvatskoj s ključem iz konstruktora", async () => {
    const fetchMock = vi.fn(async () => Response.json({ status: "OK", results: [result(45.8, 15.97)] }));
    vi.stubGlobal("fetch", fetchMock);

    const location = await new GoogleGeocoder("tajni-kljuc").geocode("Unska ulica 3", "Zagreb");

    expect(location).toEqual({ lat: 45.8, lng: 15.97 });
    const url = new URL(String((fetchMock.mock.calls[0] as unknown[])[0]));
    expect(url.searchParams.get("address")).toBe("Unska ulica 3, Zagreb");
    expect(url.searchParams.get("components")).toBe("country:HR");
    expect(url.searchParams.get("key")).toBe("tajni-kljuc");
  });

  it("HTTP greška je greška", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => new Response("", { status: 500 })));
    await expect(new GoogleGeocoder("k").geocode("Unska ulica 3", "Zagreb")).rejects.toThrow("HTTP 500");
  });
});
