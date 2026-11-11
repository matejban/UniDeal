import { beforeEach, describe, expect, it, vi } from "vitest";
import { Offer } from "../domain/Offer";
import { Partner } from "../domain/Partner";
import type { CategoryRepository } from "@/repositories/CategoryRepository";
import type { OfferInput, OfferRepository } from "@/repositories/OfferRepository";
import type { PartnerRepository } from "@/repositories/PartnerRepository";
import { OfferService } from "./OfferService";

// bez pravog uploada u storage; svaka učitana slika dobiva novo ime
const storage = vi.hoisted(() => ({ uploads: 0, deleted: [] as string[] }));
vi.mock("../lib/storage", () => ({
  uploadImage: async (_bucket: string, partnerId: string) => `https://slike/${partnerId}/foto${++storage.uploads}.jpg`,
  deleteImage: async (_bucket: string, url: string) => {
    storage.deleted.push(url);
  },
}));

function partner(id: string, ownerId: string, approval: Partner["approvalStatus"] = "odobren") {
  return new Partner(id, "Kafić", "Hrana", "Zagreb", "Unska 3", "01 111", "", "", approval, "12345678903", ownerId, null);
}

class FakeOfferRepository implements OfferRepository {
  rows: Offer[] = [];
  private nextId = 1;

  async findAll() {
    return this.rows;
  }
  async findById(id: string) {
    return this.rows.find((o) => o.id === id);
  }
  async findByPartner(partnerId: string) {
    return this.rows.filter((o) => o.partnerId === partnerId);
  }
  async create(partnerId: string, data: OfferInput) {
    const id = `o${this.nextId++}`;
    this.rows.push(toOffer(id, partnerId, data, "nacrt", null));
    return id;
  }
  async update(id: string, data: OfferInput) {
    this.rows = this.rows.map((o) => (o.id === id ? toOffer(id, o.partnerId, data, o.status, o.photoUrl) : o));
  }
  async setPhoto(id: string, photoUrl: string) {
    this.rows = this.rows.map((o) => (o.id === id ? toOffer(id, o.partnerId, o, o.status, photoUrl) : o));
  }
  async delete(id: string) {
    this.rows = this.rows.filter((o) => o.id !== id);
  }
}

function toOffer(id: string, partnerId: string, d: OfferInput, status: Offer["status"], photoUrl: string | null) {
  return new Offer(
    id,
    partnerId,
    d.title,
    d.description,
    "",
    d.discountType,
    d.discountValue,
    d.validUntil,
    d.conditions,
    status,
    d.usageLimit,
    d.categoryId,
    photoUrl,
  );
}

const partners = {
  findByOwner: async (ownerId: string) =>
    [partner("p1", "ana"), partner("p2", "ivo"), partner("p3", "novi", "na_cekanju"), partner("p4", "odbijeni", "odbijen")].find(
      (p) => p.ownerId === ownerId,
    ),
} as unknown as PartnerRepository;

const categories = {
  findAll: async () => [{ id: "hrana", name: "Hrana" }],
} as unknown as CategoryRepository;

const valid: OfferInput = {
  title: "Kava + kroasan",
  description: "Uz svaku kavu kroasan gratis",
  categoryId: "hrana",
  discountType: "postotak",
  discountValue: 20,
  validUntil: "2999-12-31",
  conditions: "",
  usageLimit: "neograniceno",
};

function image(type = "image/jpeg", size = 1000) {
  return new File([new Uint8Array(size)], "foto", { type });
}

describe("OfferService", () => {
  let repo: FakeOfferRepository;
  let service: OfferService;

  beforeEach(() => {
    repo = new FakeOfferRepository();
    storage.deleted = [];
    service = new OfferService(repo, partners, categories);
  });

  it("partner stvara ponudu koja je nacrt", async () => {
    expect(await service.createOffer("ana", valid, null)).toEqual({});
    expect(repo.rows).toHaveLength(1);
    expect(repo.rows[0].partnerId).toBe("p1");
    expect(repo.rows[0].status).toBe("nacrt");
  });

  it("fotografija se sprema uz novu ponudu", async () => {
    await service.createOffer("ana", valid, image());
    expect(repo.rows[0].photoUrl).toMatch(/^https:\/\/slike\/p1\/foto\d+\.jpg$/);
  });

  it("korisnik bez profila partnera ne može stvoriti ponudu", async () => {
    expect(await service.createOffer("nitko", valid, null)).toHaveProperty("form");
    expect(repo.rows).toHaveLength(0);
  });

  it("partner kojeg administrator nije odobrio ne može stvoriti ponudu", async () => {
    expect(await service.createOffer("novi", valid, null)).toHaveProperty("form");
    expect(await service.createOffer("odbijeni", valid, null)).toHaveProperty("form");
    expect(repo.rows).toHaveLength(0);
  });

  it("ponuda bez obaveznih polja se ne sprema", async () => {
    const errors = await service.createOffer("ana", { ...valid, title: "", description: "", categoryId: "x" }, null);
    expect(Object.keys(errors).sort()).toEqual(["categoryId", "description", "title"]);
    expect(repo.rows).toHaveLength(0);
  });

  it("ponuda s rokom u prošlosti se ne sprema", async () => {
    const errors = await service.createOffer("ana", { ...valid, validUntil: "2000-01-01" }, null);
    expect(errors).toHaveProperty("validUntil");
  });

  it("odbija neispravan popust", async () => {
    expect(await service.createOffer("ana", { ...valid, discountValue: NaN }, null)).toHaveProperty("discountValue");
    expect(await service.createOffer("ana", { ...valid, discountValue: 0 }, null)).toHaveProperty("discountValue");
    expect(await service.createOffer("ana", { ...valid, discountValue: 120 }, null)).toHaveProperty("discountValue");
    expect(await service.createOffer("ana", { ...valid, discountValue: 1.555 }, null)).toHaveProperty("discountValue");
    // 5.1 * 100 nije točno 510 pa je ovo prije padalo
    expect(await service.createOffer("ana", { ...valid, discountType: "iznos", discountValue: 5.1 }, null)).toEqual({});
    expect(await service.createOffer("ana", { ...valid, discountType: "iznos", discountValue: 19.99 }, null)).toEqual({});
    // iznos smije biti preko 100
    expect(await service.createOffer("ana", { ...valid, discountType: "iznos", discountValue: 120 }, null)).toEqual({});
  });

  it("odbija sliku pogrešne vrste", async () => {
    expect(await service.createOffer("ana", valid, image("application/pdf"))).toHaveProperty("photo");
    expect(repo.rows).toHaveLength(0);
  });

  it("partner uređuje svoju ponudu", async () => {
    await service.createOffer("ana", valid, null);
    expect(await service.updateOffer("ana", "o1", { ...valid, title: "Dvije kave" }, null)).toEqual({});
    expect(repo.rows[0].title).toBe("Dvije kave");
  });

  it("partner ne može urediti ni obrisati tuđu ponudu", async () => {
    await service.createOffer("ana", valid, null);
    expect(await service.updateOffer("ivo", "o1", { ...valid, title: "Tuđe" }, null)).toHaveProperty("form");
    expect(await service.deleteOffer("ivo", "o1")).toBe(false);
    expect(repo.rows[0].title).toBe("Kava + kroasan");
  });

  it("istekla ponuda ne može se urediti", async () => {
    repo.rows.push(toOffer("stara", "p1", valid, "istekla", null));
    expect(await service.updateOffer("ana", "stara", valid, null)).toHaveProperty("form");
  });

  it("nova fotografija zamjenjuje staru, a stara se briše iz Storagea", async () => {
    await service.createOffer("ana", valid, image("image/jpeg"));
    const first = repo.rows[0].photoUrl;
    expect(first).not.toBeNull();

    expect(await service.updateOffer("ana", "o1", valid, image("image/png"))).toEqual({});
    expect(repo.rows[0].photoUrl).not.toBe(first);
    expect(storage.deleted).toEqual([first]);
  });

  it("uređivanje bez nove fotografije ne briše postojeću", async () => {
    await service.createOffer("ana", valid, image("image/jpeg"));
    await service.updateOffer("ana", "o1", { ...valid, title: "Dvije kave" }, null);
    expect(storage.deleted).toEqual([]);
  });

  it("brisanje ponude briše i njezinu fotografiju", async () => {
    await service.createOffer("ana", valid, image("image/jpeg"));
    const photo = repo.rows[0].photoUrl;
    expect(await service.deleteOffer("ana", "o1")).toBe(true);
    expect(storage.deleted).toEqual([photo]);
  });

  it("obrisana ponuda više ne postoji", async () => {
    await service.createOffer("ana", valid, null);
    expect(await service.deleteOffer("ana", "o1")).toBe(true);
    expect(await service.getPartnerOffers("p1")).toHaveLength(0);
  });
});
