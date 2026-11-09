export type Category = { id: string; name: string };
export type CategoryWithUsage = Category & { offerCount: number; partnerCount: number };

// Baza već ima kategoriju s istim nazivom.
export class DuplicateCategoryError extends Error {
  constructor() {
    super("Kategorija s tim nazivom već postoji");
  }
}

// Kategoriju još koristi neka ponuda ili partner, pa je baza ne da obrisati.
export class CategoryInUseError extends Error {
  constructor() {
    super("Kategoriju još koriste ponude ili partneri");
  }
}

export interface CategoryRepository {
  findAll(): Promise<Category[]>;
  // Kategorije s brojem ponuda i partnera. RLS skriva neobjavljene retke, pa su brojke potpune samo administratoru.
  findAllWithUsage(): Promise<CategoryWithUsage[]>;
  // Baci DuplicateCategoryError ako je naziv zauzet.
  create(name: string): Promise<Category>;
  // Baci DuplicateCategoryError ako je naziv zauzet.
  rename(id: string, name: string): Promise<void>;
  // Baci CategoryInUseError ako kategoriju još koristi neka ponuda ili partner.
  delete(id: string): Promise<void>;
}
