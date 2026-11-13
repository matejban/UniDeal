import { describe, expect, it } from "vitest";
import { centerOf } from "./geo";

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
