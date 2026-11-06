import type { ApprovalDecision, Partner, PendingPartner } from "@/domain/Partner";

// Podaci koje partner unosi pri registraciji (F-006).
export type NewPartner = {
  ownerId: string;
  name: string;
  oib: string;
  categoryId: string;
  address: string;
  city: string;
  phone: string;
};

// Baza već ima partnera s istim OIB-om ili korisnik već ima profil partnera.
export class DuplicatePartnerError extends Error {
  constructor(readonly field: "oib" | "owner") {
    super(field === "oib" ? "Partner s tim OIB-om već postoji" : "Korisnik već ima profil partnera");
  }
}

export interface PartnerRepository {
  // Javno vidljivi partneri: odobreni, s aktivnom pretplatom (F-007).
  findAll(): Promise<Partner[]>;
  findById(id: string): Promise<Partner | undefined>;
  // Profil partnera prijavljenog korisnika, i dok još nije javan.
  findByOwner(ownerId: string): Promise<Partner | undefined>;
  // Sprema profil sa statusom na čekanju. Baci DuplicatePartnerError ako su OIB ili vlasnik zauzeti.
  create(partner: NewPartner): Promise<Partner>;
  // Profili na čekanju odobrenja, najstariji prvi; vidi ih samo administrator (F-025).
  findPending(): Promise<PendingPartner[]>;
  setApproval(id: string, decision: ApprovalDecision): Promise<void>;
}
