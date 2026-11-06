export type Category = { id: string; name: string };

export interface CategoryRepository {
  findAll(): Promise<Category[]>;
}
