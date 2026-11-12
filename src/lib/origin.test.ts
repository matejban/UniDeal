import { describe, expect, it } from "vitest";
import { originFromHeaders } from "./origin";

function headers(values: Record<string, string>) {
  return (name: string) => values[name] ?? null;
}

describe("originFromHeaders", () => {
  it("koristi zaglavlje origin kad postoji", () => {
    expect(originFromHeaders(headers({ origin: "https://www.unideal.site", host: "drugo.example" }))).toBe(
      "https://www.unideal.site",
    );
  });

  it("bez origina gradi adresu iz proslijeđenog hosta i protokola", () => {
    expect(originFromHeaders(headers({ "x-forwarded-host": "unideal-git-x.vercel.app", "x-forwarded-proto": "https" }))).toBe(
      "https://unideal-git-x.vercel.app",
    );
  });

  it("lokalno koristi http, a drugdje https", () => {
    expect(originFromHeaders(headers({ host: "localhost:3000" }))).toBe("http://localhost:3000");
    expect(originFromHeaders(headers({ host: "www.unideal.site" }))).toBe("https://www.unideal.site");
  });
});
