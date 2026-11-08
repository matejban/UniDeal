import { afterEach, describe, expect, it, vi } from "vitest";
import { ConsoleNotificationService } from "./NotificationService";

describe("ConsoleNotificationService", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("bez Resend ključa e-mail o odobrenju ispisuje u konzolu", async () => {
    const log = vi.spyOn(console, "log").mockImplementation(() => {});
    await new ConsoleNotificationService().sendPartnerDecision("partner@primjer.hr", "Kafić Kampus", "odobren");

    const printed = String(log.mock.calls[0][0]);
    expect(printed).toContain("partner@primjer.hr");
    expect(printed).toContain("profil partnera je odobren");
    expect(printed).toContain("Kafić Kampus");
  });

  it("e-mail o odbijanju ima drugačiji naslov", async () => {
    const log = vi.spyOn(console, "log").mockImplementation(() => {});
    await new ConsoleNotificationService().sendPartnerDecision("partner@primjer.hr", "Kafić Kampus", "odbijen");

    expect(String(log.mock.calls[0][0])).toContain("profil partnera je odbijen");
  });
});
