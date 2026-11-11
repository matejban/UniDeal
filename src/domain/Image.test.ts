import { describe, expect, it } from "vitest";
import { checkImage, imagePath } from "./Image";

// Pomoćna funkcija: napravi datoteku zadane vrste i veličine.
function makeFile(type: string, size: number): File {
  return new File([new Uint8Array(size)], "slika", { type: type });
}

describe("checkImage", () => {
  it("prihvaća JPG, PNG i WebP do 2 MB", () => {
    expect(checkImage(makeFile("image/jpeg", 1000))).toBe("");
    expect(checkImage(makeFile("image/png", 1000))).toBe("");
    expect(checkImage(makeFile("image/webp", 2 * 1024 * 1024))).toBe("");
  });

  it("odbija prazno polje", () => {
    expect(checkImage(makeFile("", 0))).toBe("Odaberi sliku.");
  });

  it("odbija krivu vrstu datoteke", () => {
    expect(checkImage(makeFile("application/pdf", 1000))).toBe("Slika mora biti JPG, PNG ili WebP.");
    expect(checkImage(makeFile("image/gif", 1000))).toBe("Slika mora biti JPG, PNG ili WebP.");
  });

  it("odbija sliku veću od 2 MB", () => {
    expect(checkImage(makeFile("image/png", 2 * 1024 * 1024 + 1))).toBe("Slika može imati najviše 2 MB.");
  });
});

const base = "https://abc.supabase.co/storage/v1/object/public";

describe("imagePath", () => {
  it("iz javnog URL-a vraća putanju unutar bucketa", () => {
    expect(imagePath("offer-photos", `${base}/offer-photos/p1/1731000000000.jpg`)).toBe("p1/1731000000000.jpg");
    expect(imagePath("partner-logos", `${base}/partner-logos/p1/logo%20novi.png`)).toBe("p1/logo novi.png");
  });

  it("URL drugog bucketa ili neispravan URL ne daje putanju", () => {
    expect(imagePath("offer-photos", `${base}/partner-logos/p1/1.jpg`)).toBeNull();
    expect(imagePath("offer-photos", "https://primjer.hr/slika.jpg")).toBeNull();
    expect(imagePath("offer-photos", "nije-url")).toBeNull();
    expect(imagePath("offer-photos", `${base}/offer-photos/`)).toBeNull();
  });
});
