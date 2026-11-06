import type { ApprovalDecision, Partner, PendingPartner } from "@/domain/Partner";

export interface PartnerRepository {
  // Javno vidljivi partneri: odobreni, s aktivnom pretplatom (F-007).
  findAll(): Promise<Partner[]>;
  findById(id: string): Promise<Partner | undefined>;
  // Profil partnera prijavljenog korisnika, i dok još nije javan.
  findByOwner(ownerId: string): Promise<Partner | undefined>;
  // Profili na čekanju odobrenja, najstariji prvi; vidi ih samo administrator (F-025).
  findPending(): Promise<PendingPartner[]>;
  setApproval(id: string, decision: ApprovalDecision): Promise<void>;
}
