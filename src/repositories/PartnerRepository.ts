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

// Podaci javnog profila koje partner smije mijenjati (F-010).
export type PartnerProfile = {
  name: string;
  address: string;
  city: string;
  phone: string;
  hours: string;
  description: string;
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
  // Mijenja profil partnera, ali samo ako ga posjeduje ownerId (F-010).
  update(id: string, ownerId: string, profile: PartnerProfile): Promise<void>;
  // Sprema URL loga, isto samo za vlasnika profila (#13).
  setLogo(id: string, ownerId: string, logoUrl: string): Promise<void>;
  // Profili na čekanju odobrenja, najstariji prvi; vidi ih samo administrator (F-025).
  findPending(): Promise<PendingPartner[]>;
  setApproval(id: string, decision: ApprovalDecision): Promise<void>;
}
