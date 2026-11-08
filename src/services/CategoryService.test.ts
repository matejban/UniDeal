import { beforeEach, describe, expect, it } from "vitest";
import {
  type Category,
  CategoryInUseError,
  type CategoryRepository,
  type CategoryWithUsage,
  DuplicateCategoryError,
} from "../repositories/CategoryRepository";
import { CategoryService } from "./CategoryService";

// Lažni repozitorij u memoriji. failWith glumi grešku baze koja se dogodi nakon provjere u servisu.
class FakeCategoryRepository implements CategoryRepository {
  rows: CategoryWithUsage[] = [
    { id: "hrana", name: "Hrana", offerCount: 0, partnerCount: 0 },
    { id: "zabava", name: "Zabava", offerCount: 0, partnerCount: 0 },
  ];
  failWith: Error | null = null;

  private failIfAsked() {
    if (this.failWith) throw this.failWith;
  }

  async findAll(): Promise<Category[]> {
    return this.rows.map((r) => ({ id: r.id, name: r.name }));
  }

  async findAllWithUsage() {
    return this.rows;
  }

  async create(name: string) {
    this.failIfAsked();
    const row = { id: name, name, offerCount: 0, partnerCount: 0 };
    this.rows.push(row);
    return { id: row.id, name: row.name };
  }

  async rename(id: string, name: string) {
    this.failIfAsked();
    this.rows = this.rows.map((r) => (r.id === id ? { ...r, name } : r));
  }

  async delete(id: string) {
    this.failIfAsked();
    this.rows = this.rows.filter((r) => r.id !== id);
  }
}

describe("CategoryService", () => {
  let repo: FakeCategoryRepository;
  let service: CategoryService;

  beforeEach(() => {
    repo = new FakeCategoryRepository();
    service = new CategoryService(repo);
  });

  function names() {
    return repo.rows.map((r) => r.name);
  }

  describe("create", () => {
    it("sprema novu kategoriju bez razmaka na rubovima", async () => {
      expect(await service.create("  Putovanja ")).toBeNull();
      expect(names()).toContain("Putovanja");
    });

    it.each(["", "   "])("odbija prazan naziv %j", async (name) => {
      expect(await service.create(name)).toEqual({ code: "prazan-naziv" });
      expect(repo.rows).toHaveLength(2);
    });

    it.each(["Hrana", "hrana", " HRANA "])("odbija postojeći naziv %j", async (name) => {
      expect(await service.create(name)).toEqual({ code: "zauzet-naziv" });
      expect(repo.rows).toHaveLength(2);
    });

    it("razlikovanje veličine slova vrijedi i za hrvatska slova", async () => {
      await service.create("Šport");
      expect(await service.create("šPORT")).toEqual({ code: "zauzet-naziv" });
    });

    it("javlja zauzet naziv kad ga baza odbije nakon provjere", async () => {
      repo.failWith = new DuplicateCategoryError();
      expect(await service.create("Putovanja")).toEqual({ code: "zauzet-naziv" });
    });

    it("ostale greške baze ne skriva", async () => {
      repo.failWith = new Error("baza je pala");
      await expect(service.create("Putovanja")).rejects.toThrow("baza je pala");
    });
  });

  describe("rename", () => {
    it("mijenja naziv bez razmaka na rubovima", async () => {
      expect(await service.rename("hrana", " Prehrana ")).toBeNull();
      expect(names()).toEqual(["Prehrana", "Zabava"]);
    });

    it("odbija prazan naziv", async () => {
      expect(await service.rename("hrana", "  ")).toEqual({ code: "prazan-naziv" });
      expect(names()).toContain("Hrana");
    });

    it("odbija naziv druge kategorije", async () => {
      expect(await service.rename("hrana", "zabava")).toEqual({ code: "zauzet-naziv" });
      expect(names()).toEqual(["Hrana", "Zabava"]);
    });

    it("dopušta ispravak veličine slova vlastitog naziva", async () => {
      expect(await service.rename("hrana", "HRANA")).toBeNull();
      expect(names()).toContain("HRANA");
    });

    it("javlja zauzet naziv kad ga baza odbije nakon provjere", async () => {
      repo.failWith = new DuplicateCategoryError();
      expect(await service.rename("hrana", "Prehrana")).toEqual({ code: "zauzet-naziv" });
    });

    it("ostale greške baze ne skriva", async () => {
      repo.failWith = new Error("baza je pala");
      await expect(service.rename("hrana", "Prehrana")).rejects.toThrow("baza je pala");
    });
  });

  describe("delete", () => {
    it("briše kategoriju koju nitko ne koristi", async () => {
      expect(await service.delete("hrana")).toBeNull();
      expect(names()).toEqual(["Zabava"]);
    });

    it("ne briše kategoriju s ponudama i javlja broj", async () => {
      repo.rows[0].offerCount = 3;
      expect(await service.delete("hrana")).toEqual({ code: "u-upotrebi", offerCount: 3, partnerCount: 0 });
      expect(names()).toContain("Hrana");
    });

    it("ne briše kategoriju koja ima samo partnere", async () => {
      repo.rows[0].partnerCount = 2;
      expect(await service.delete("hrana")).toEqual({ code: "u-upotrebi", offerCount: 0, partnerCount: 2 });
      expect(names()).toContain("Hrana");
    });

    it("javlja svježe brojke kad baza odbije brisanje nakon provjere", async () => {
      const original = repo.delete.bind(repo);
      repo.delete = async (id) => {
        // Ponuda se pojavila između provjere i brisanja.
        repo.rows[0].offerCount = 1;
        repo.failWith = new CategoryInUseError();
        await original(id);
      };
      expect(await service.delete("hrana")).toEqual({ code: "u-upotrebi", offerCount: 1, partnerCount: 0 });
    });

    it("ostale greške baze ne skriva", async () => {
      repo.failWith = new Error("baza je pala");
      await expect(service.delete("hrana")).rejects.toThrow("baza je pala");
    });
  });
});
