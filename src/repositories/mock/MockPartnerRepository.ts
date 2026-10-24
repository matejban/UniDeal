import { Partner } from "@/domain/Partner";
import { partners } from "@/lib/mock-data";
import type { PartnerRepository } from "@/repositories/PartnerRepository";

export class MockPartnerRepository implements PartnerRepository {
  private readonly partners = partners.map(
    (p) => new Partner(p.id, p.name, p.category, p.city, p.address, p.phone, p.hours, p.description),
  );

  async findAll() {
    return this.partners;
  }

  async findById(id: string) {
    return this.partners.find((p) => p.id === id);
  }
}
