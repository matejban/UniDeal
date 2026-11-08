import { describe, expect, it } from "vitest";
import { safeRedirectPath, welcomePath } from "./redirect";

// Nakon prijave korisnik se vraća samo na stranicu unutar aplikacije (NF-03).
describe("safeRedirectPath", () => {
  it("putanja unutar aplikacije ostaje ista", () => {
    expect(safeRedirectPath("/ponude")).toBe("/ponude");
    expect(safeRedirectPath("/ponude/123?greska=1#kupon")).toBe("/ponude/123?greska=1#kupon");
  });

  it("bez putanje vraća naslovnicu", () => {
    expect(safeRedirectPath(undefined)).toBe("/");
    expect(safeRedirectPath("")).toBe("/");
  });

  it("vanjska adresa postaje naslovnica", () => {
    expect(safeRedirectPath("https://zlo.example.com/prijava")).toBe("/");
    expect(safeRedirectPath("//zlo.example.com")).toBe("/");
    expect(safeRedirectPath("/\\zlo.example.com")).toBe("/");
    expect(safeRedirectPath("javascript:alert(1)")).toBe("/");
  });
});

describe("welcomePath", () => {
  it("prijava vodi na /dobrodoslica s kodiranom odredišnom putanjom (F-032)", () => {
    expect(welcomePath("/ponude/123?greska=1")).toBe("/dobrodoslica?next=%2Fponude%2F123%3Fgreska%3D1");
  });
});
