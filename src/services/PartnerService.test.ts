import { beforeEach, describe, expect, it, vi } from "vitest";
import { Partner } from "../domain/Partner";
import type { LatLng } from "../lib/geo";
import type { CategoryRepository } from "@/repositories/CategoryRepository";
import type { OfferRepository } from "@/repositories/OfferRepository";
import type { NewPartner, PartnerProfile, PartnerRepository } from "@/repositories/PartnerRepository";
import type { Geocoder } from "./Geocoder";
import type { NotificationService } from "./NotificationService";
import { PartnerService } from "./PartnerService";

// PartnerService ne treba storage; mock samo sprječava učitavanje Supabase klijenta
vi.mock("../lib/storage", () => ({ uploadImage: async () => "", deleteImage: async () => {} }));

function partner(id: string, city: string, lat: number | null, lng: number | null) {
  return new Partner(id, `Partner ${id}`, "Hrana", city, "Adresa 1", "01 111", "", "", "odobren", "12345678903", null, null, lat, lng);
}

const categories = { findAll: async () => [{ id: "c1", name: "Hrana" }] } as unknown as CategoryRepository;

// Lažni geokoder: zna samo adrese iz popisa i broji pozive.
class FakeGeocoder implements Geocoder {
  calls: string[] = [];
  known: Record<string, LatLng> = { "Unska ulica 3, Zagreb": { lat: 45.8, lng: 15.97 }, "Ilica 1, Zagreb": { lat: 45.81, lng: 15.97 } };
  fail = false;

  async geocode(address: string, city: string) {
    this.calls.push(`${address}, ${city}`);
    if (this.fail) {
      throw new Error("REQUEST_DENIED");
    }
    return this.known[`${address}, ${city}`] ?? null;
  }
}

// Lažni repozitorij s jednim partnerom vlasnika u1.
class FakePartners {
  created: NewPartner | undefined;
  current: Partner | undefined;
  locations: (LatLng | null)[] = [];

  async findAll() {
    return this.current ? [this.current] : [];
  }
  async findByOwner() {
    return this.current;
  }
  async create(p: NewPartner) {
    this.created = p;
    return partner("p1", p.city, p.lat, p.lng);
  }
  async update(_id: string, _ownerId: string, profile: PartnerProfile) {
    const c = this.current!;
    this.current = new Partner(c.id, profile.name, c.category, profile.city, profile.address, profile.phone, profile.hours,
      profile.description, c.approvalStatus, c.oib, c.ownerId, c.logoUrl, c.lat, c.lng);
  }
  async setLocation(_id: string, _ownerId: string, location: LatLng | null) {
    this.locations.push(location);
  }
}

function service(partners: object, geocoder: Geocoder = new FakeGeocoder()) {
  return new PartnerService(
    partners as PartnerRepository,
    {} as OfferRepository,
    categories,
    {} as NotificationService,
    geocoder,
  );
}

const registration = { name: "Kafić Kampus", oib: "00000000010", categoryId: "c1", address: "Unska ulica 3", city: "Zagreb", phone: "01 111" };
const profile = { name: "Kafić Kampus", address: "Unska ulica 3", city: "Zagreb", phone: "01 111", hours: "", description: "" };

describe("PartnerService.getMapData", () => {
  it("na kartu idu samo partneri s koordinatama", async () => {
    const repository = { findAll: async () => [partner("p1", "Zagreb", 45.8, 15.97), partner("p2", "Zagreb", null, null)] };
    const { partners } = await service(repository).getMapData();

    expect(partners.map((p) => p.id)).toEqual(["p1"]);
    expect(partners[0]).toEqual({
      id: "p1",
      name: "Partner p1",
      category: "Hrana",
      address: "Adresa 1",
      city: "Zagreb",
      lat: 45.8,
      lng: 15.97,
    });
  });

  it("svaki grad ima jedno središte, a gradovi su poredani abecedno", async () => {
    const repository = {
      findAll: async () => [partner("p1", "Zagreb", 45.8, 15.96), partner("p2", "Split", 43.51, 16.47), partner("p3", "Zagreb", 45.81, 15.98)],
    };
    const { cities } = await service(repository).getMapData();

    expect(cities.map((c) => c.name)).toEqual(["Split", "Zagreb"]);
    expect(cities[1].lat).toBeCloseTo(45.805);
    expect(cities[1].lng).toBeCloseTo(15.97);
  });

  it("grad čiji partneri nemaju koordinate nije u popisu gradova", async () => {
    const { cities } = await service({ findAll: async () => [partner("p1", "Osijek", null, null)] }).getMapData();
    expect(cities).toEqual([]);
  });
});

describe("PartnerService.register: geokodiranje adrese (F-013)", () => {
  let partners: FakePartners;
  let geocoder: FakeGeocoder;

  beforeEach(() => {
    partners = new FakePartners();
    geocoder = new FakeGeocoder();
  });

  it("pronađena adresa sprema se s koordinatama", async () => {
    expect(await service(partners, geocoder).register("u1", registration)).toEqual({});
    expect(partners.created).toMatchObject({ address: "Unska ulica 3", lat: 45.8, lng: 15.97 });
  });

  it("nepronađena adresa ne sprječava registraciju, a partner nema koordinate", async () => {
    expect(await service(partners, geocoder).register("u1", { ...registration, address: "Nepostojeća 99" })).toEqual({});
    expect(partners.created).toMatchObject({ lat: null, lng: null });
  });

  it("greška geokodiranja ne sprječava registraciju", async () => {
    geocoder.fail = true;
    vi.spyOn(console, "error").mockImplementation(() => {});
    expect(await service(partners, geocoder).register("u1", registration)).toEqual({});
    expect(partners.created).toMatchObject({ lat: null, lng: null });
  });

  it("neispravna registracija se ne geokodira", async () => {
    await service(partners, geocoder).register("u1", { ...registration, oib: "1" });
    expect(geocoder.calls).toEqual([]);
    expect(partners.created).toBeUndefined();
  });
});

describe("PartnerService.updateProfile: geokodiranje samo kad treba (F-013)", () => {
  let partners: FakePartners;
  let geocoder: FakeGeocoder;

  beforeEach(() => {
    partners = new FakePartners();
    partners.current = new Partner("p1", "Kafić Kampus", "Hrana", "Zagreb", "Unska ulica 3", "01 111", "", "", "odobren",
      "00000000010", "u1", null, 45.8, 15.97);
    geocoder = new FakeGeocoder();
  });

  it("ista adresa s postojećom lokacijom ne geokodira se ponovno", async () => {
    await service(partners, geocoder).updateProfile("p1", "u1", { ...profile, phone: "01 999" });
    expect(geocoder.calls).toEqual([]);
    expect(partners.locations).toEqual([]);
  });

  it("nova adresa dobiva nove koordinate", async () => {
    await service(partners, geocoder).updateProfile("p1", "u1", { ...profile, address: "Ilica 1" });
    expect(geocoder.calls).toEqual(["Ilica 1, Zagreb"]);
    expect(partners.locations).toEqual([{ lat: 45.81, lng: 15.97 }]);
  });

  it("nepronađena nova adresa briše staru lokaciju", async () => {
    await service(partners, geocoder).updateProfile("p1", "u1", { ...profile, address: "Nepostojeća 99" });
    expect(partners.locations).toEqual([null]);
  });

  it("profil bez lokacije geokodira se i kad se adresa nije promijenila", async () => {
    const c = partners.current!;
    partners.current = new Partner(c.id, c.name, c.category, c.city, c.address, c.phone, c.hours, c.description,
      c.approvalStatus, c.oib, c.ownerId, c.logoUrl, null, null);
    await service(partners, geocoder).updateProfile("p1", "u1", profile);
    expect(geocoder.calls).toEqual(["Unska ulica 3, Zagreb"]);
    expect(partners.locations).toEqual([{ lat: 45.8, lng: 15.97 }]);
  });
});

describe("PartnerService.setLocation: ručno označena lokacija (F-013)", () => {
  it("lokacija u Hrvatskoj se sprema", async () => {
    const partners = new FakePartners();
    expect(await service(partners).setLocation("p1", "u1", { lat: 45.8, lng: 15.97 })).toBe("");
    expect(partners.locations).toEqual([{ lat: 45.8, lng: 15.97 }]);
  });

  it("lokacija izvan Hrvatske se odbija", async () => {
    const partners = new FakePartners();
    expect(await service(partners).setLocation("p1", "u1", { lat: 48.2, lng: 16.37 })).toBe("Označi lokaciju u Hrvatskoj.");
    expect(partners.locations).toEqual([]);
  });
});
