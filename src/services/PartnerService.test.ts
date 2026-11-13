import { describe, expect, it, vi } from "vitest";
import { Partner } from "../domain/Partner";
import type { CategoryRepository } from "@/repositories/CategoryRepository";
import type { OfferRepository } from "@/repositories/OfferRepository";
import type { PartnerRepository } from "@/repositories/PartnerRepository";
import type { NotificationService } from "./NotificationService";
import { PartnerService } from "./PartnerService";

// getMapData ne treba storage; mock samo sprječava učitavanje Supabase klijenta
vi.mock("../lib/storage", () => ({ uploadImage: async () => "", deleteImage: async () => {} }));

function partner(id: string, city: string, lat: number | null, lng: number | null) {
  return new Partner(id, `Partner ${id}`, "Hrana", city, "Adresa 1", "01 111", "", "", "odobren", "12345678903", null, null, lat, lng);
}

function service(partners: Partner[]) {
  const repository = { findAll: async () => partners } as unknown as PartnerRepository;
  return new PartnerService(
    repository,
    {} as OfferRepository,
    {} as CategoryRepository,
    {} as NotificationService,
  );
}

describe("PartnerService.getMapData", () => {
  it("na kartu idu samo partneri s koordinatama", async () => {
    const { partners } = await service([
      partner("p1", "Zagreb", 45.8, 15.97),
      partner("p2", "Zagreb", null, null),
    ]).getMapData();

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
    const { cities } = await service([
      partner("p1", "Zagreb", 45.8, 15.96),
      partner("p2", "Split", 43.51, 16.47),
      partner("p3", "Zagreb", 45.81, 15.98),
    ]).getMapData();

    expect(cities.map((c) => c.name)).toEqual(["Split", "Zagreb"]);
    expect(cities[1].lat).toBeCloseTo(45.805);
    expect(cities[1].lng).toBeCloseTo(15.97);
  });

  it("grad čiji partneri nemaju koordinate nije u popisu gradova", async () => {
    const { cities } = await service([partner("p1", "Osijek", null, null)]).getMapData();
    expect(cities).toEqual([]);
  });
});
