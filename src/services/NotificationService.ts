import { Resend } from "resend";
import type { ApprovalDecision } from "@/domain/Partner";

// Slanje e-mail obavijesti (#14). Koriste ga odobrenje partnera (#37, F-025) i obavijesti studentima (#15, F-024).
// Metode ne bacaju greške: neuspjelo slanje se samo zapiše i ne prekida radnju korisnika (C-04).
export interface NotificationService {
  sendPartnerDecision(email: string, partnerName: string, decision: ApprovalDecision): Promise<void>;
  sendNewOffer(email: string, offerTitle: string, partnerName: string): Promise<void>;
  sendOfferExpiring(email: string, offerTitle: string, validUntil: string): Promise<void>;
}

type Email = { to: string; subject: string; text: string };

// Tekstovi e-mailova na jednom mjestu, isti za obje implementacije.
function partnerDecisionEmail(email: string, partnerName: string, decision: ApprovalDecision): Email {
  if (decision === "odobren") {
    return {
      to: email,
      subject: "UniDeal: profil partnera je odobren",
      text:
        `Pozdrav,\n\nadministrator je odobrio profil „${partnerName}”.\n` +
        "Profil i ponude postaju javno vidljivi kad aktiviraš pretplatu na partnerskoj ploči.\n\n" +
        "UniDeal",
    };
  }
  return {
    to: email,
    subject: "UniDeal: profil partnera je odbijen",
    text:
      `Pozdrav,\n\nadministrator je odbio profil „${partnerName}”, pa profil nije javno vidljiv.\n` +
      "Za više informacija javi se administratoru.\n\nUniDeal",
  };
}

function newOfferEmail(email: string, offerTitle: string, partnerName: string): Email {
  return {
    to: email,
    subject: `UniDeal: nova ponuda „${offerTitle}”`,
    text: `Pozdrav,\n\n${partnerName} ima novu ponudu: „${offerTitle}”.\nPogledaj je na UniDealu.\n\nUniDeal`,
  };
}

function offerExpiringEmail(email: string, offerTitle: string, validUntil: string): Email {
  return {
    to: email,
    subject: `UniDeal: ponuda „${offerTitle}” uskoro istječe`,
    text: `Pozdrav,\n\nponuda „${offerTitle}” vrijedi još do ${validUntil}.\n\nUniDeal`,
  };
}

// Šalje e-mail preko Resenda (koristi se kad postoji RESEND_API_KEY).
export class ResendNotificationService implements NotificationService {
  private readonly resend: Resend;

  constructor(apiKey: string) {
    this.resend = new Resend(apiKey);
  }

  private async send(email: Email): Promise<void> {
    try {
      const { error } = await this.resend.emails.send({
        from: "UniDeal <noreply@unideal.site>",
        to: email.to,
        subject: email.subject,
        text: email.text,
      });
      if (error) {
        console.error("Slanje e-maila nije uspjelo:", error.message);
      }
    } catch (e) {
      console.error("Slanje e-maila nije uspjelo:", e);
    }
  }

  async sendPartnerDecision(email: string, partnerName: string, decision: ApprovalDecision) {
    await this.send(partnerDecisionEmail(email, partnerName, decision));
  }

  async sendNewOffer(email: string, offerTitle: string, partnerName: string) {
    await this.send(newOfferEmail(email, offerTitle, partnerName));
  }

  async sendOfferExpiring(email: string, offerTitle: string, validUntil: string) {
    await this.send(offerExpiringEmail(email, offerTitle, validUntil));
  }
}

// Za razvoj bez ključa: e-mail se samo ispiše u konzolu poslužitelja.
export class ConsoleNotificationService implements NotificationService {
  private async send(email: Email): Promise<void> {
    console.log(`[e-mail] Za: ${email.to}\n[e-mail] Naslov: ${email.subject}\n${email.text}`);
  }

  async sendPartnerDecision(email: string, partnerName: string, decision: ApprovalDecision) {
    await this.send(partnerDecisionEmail(email, partnerName, decision));
  }

  async sendNewOffer(email: string, offerTitle: string, partnerName: string) {
    await this.send(newOfferEmail(email, offerTitle, partnerName));
  }

  async sendOfferExpiring(email: string, offerTitle: string, validUntil: string) {
    await this.send(offerExpiringEmail(email, offerTitle, validUntil));
  }
}
