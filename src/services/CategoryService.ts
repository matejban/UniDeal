import {
  type Category,
  CategoryInUseError,
  type CategoryRepository,
  type CategoryWithUsage,
  DuplicateCategoryError,
} from "../repositories/CategoryRepository";

// Razlog odbijanja radnje; null znači da je radnja uspjela. Ostale greške (npr. pad baze) idu dalje kao iznimke.
export type CategoryError =
  | { code: "prazan-naziv" }
  | { code: "zauzet-naziv" }
  | { code: "u-upotrebi"; offerCount: number; partnerCount: number };

function sameName(a: string, b: string): boolean {
  return a.toLocaleLowerCase("hr") === b.toLocaleLowerCase("hr");
}

// Upravljanje kategorijama ponuda (F-027).
export class CategoryService {
  constructor(private readonly categories: CategoryRepository) {}

  async getAllWithUsage(): Promise<CategoryWithUsage[]> {
    return this.categories.findAllWithUsage();
  }

  async create(name: string): Promise<CategoryError | null> {
    const trimmed = name.trim();
    const error = this.checkName(trimmed, await this.categories.findAll());
    if (error) return error;

    try {
      await this.categories.create(trimmed);
    } catch (e) {
      // Netko je u međuvremenu spremio isti naziv.
      if (e instanceof DuplicateCategoryError) return { code: "zauzet-naziv" };
      throw e;
    }
    return null;
  }

  async rename(id: string, name: string): Promise<CategoryError | null> {
    const trimmed = name.trim();
    // Vlastiti naziv ne smeta, pa se "hrana" može ispraviti u "Hrana".
    const others = (await this.categories.findAll()).filter((c) => c.id !== id);
    const error = this.checkName(trimmed, others);
    if (error) return error;

    try {
      await this.categories.rename(id, trimmed);
    } catch (e) {
      if (e instanceof DuplicateCategoryError) return { code: "zauzet-naziv" };
      throw e;
    }
    return null;
  }

  // Kategorija se ne može ukloniti dok je koristi ijedna ponuda ili partner.
  async delete(id: string): Promise<CategoryError | null> {
    const usage = await this.getUsage(id);
    if (usage.offerCount > 0 || usage.partnerCount > 0) {
      return { code: "u-upotrebi", ...usage };
    }

    try {
      await this.categories.delete(id);
    } catch (e) {
      // Netko je u međuvremenu dodao ponudu ili partnera, pa baza odbija brisanje.
      if (e instanceof CategoryInUseError) return { code: "u-upotrebi", ...(await this.getUsage(id)) };
      throw e;
    }
    return null;
  }

  private checkName(name: string, existing: Category[]): CategoryError | null {
    if (name === "") return { code: "prazan-naziv" };
    if (existing.some((c) => sameName(c.name, name))) return { code: "zauzet-naziv" };
    return null;
  }

  private async getUsage(id: string): Promise<{ offerCount: number; partnerCount: number }> {
    const category = (await this.categories.findAllWithUsage()).find((c) => c.id === id);
    return { offerCount: category?.offerCount ?? 0, partnerCount: category?.partnerCount ?? 0 };
  }
}
