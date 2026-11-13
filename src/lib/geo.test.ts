import { describe, expect, it } from "vitest";
import { boundsOf, centerOf, isInCroatia } from "./geo";

describe("isInCroatia", () => {
  it("točke u Hrvatskoj prolaze", () => {
    expect(isInCroatia({ lat: 45.8, lng: 15.97 })).toBe(true); // Zagreb
    expect(isInCroatia({ lat: 42.65, lng: 18.09 })).toBe(true); // Dubrovnik
  });

  it("točke izvan Hrvatske i neispravni brojevi se odbijaju", () => {
    expect(isInCroatia({ lat: 48.2, lng: 16.37 })).toBe(false); // Beč
    expect(isInCroatia({ lat: 45.8, lng: 12.0 })).toBe(false);
    expect(isInCroatia({ lat: Number.NaN, lng: 15.97 })).toBe(false);
  });
});

describe("boundsOf", () => {
  it("prazan popis nema granice", () => {
    expect(boundsOf([])).toBeNull();
  });

  it("granice obuhvaćaju sve točke", () => {
    expect(
      boundsOf([
        { lat: 45.8, lng: 15.97 },
        { lat: 43.51, lng: 16.47 },
        { lat: 45.55, lng: 18.69 },
      ]),
    ).toEqual({ north: 45.8, south: 43.51, east: 18.69, west: 15.97 });
  });
});

describe("centerOf", () => {
  it("prazan popis nema središte", () => {
    expect(centerOf([])).toBeNull();
  });

  it("središte jedne točke je ta točka", () => {
    expect(centerOf([{ lat: 45.8, lng: 15.97 }])).toEqual({ lat: 45.8, lng: 15.97 });
  });

  it("središte više točaka je prosjek koordinata", () => {
    const center = centerOf([
      { lat: 45.8, lng: 15.96 },
      { lat: 45.81, lng: 15.98 },
    ]);
    expect(center?.lat).toBeCloseTo(45.805);
    expect(center?.lng).toBeCloseTo(15.97);
  });
});
