import { describe, expect, it } from "vitest";
import { Partner } from "./Partner";

describe("Partner.isValidOib", () => {
  it("ispravan OIB prolazi", () => {
    expect(Partner.isValidOib("69435151530")).toBe(true);
    expect(Partner.isValidOib("94577403194")).toBe(true);
    // Kontrolna znamenka je 0 kad je 11 - a = 10.
    expect(Partner.isValidOib("00000000001")).toBe(true);
  });

  it("OIB koji nema točno 11 znamenki se odbija", () => {
    expect(Partner.isValidOib("6943515153")).toBe(false);
    expect(Partner.isValidOib("694351515301")).toBe(false);
    expect(Partner.isValidOib("6943515153a")).toBe(false);
    expect(Partner.isValidOib("")).toBe(false);
  });

  it("OIB s krivom kontrolnom znamenkom se odbija", () => {
    expect(Partner.isValidOib("69435151531")).toBe(false);
    expect(Partner.isValidOib("94577403195")).toBe(false);
  });
});
