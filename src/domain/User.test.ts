import { describe, expect, it } from "vitest";
import { User } from "./User";

function student(status: "potvrden" | "nepotvrden") {
  return new User("1", "ana@fer.hr", "student", status, status === "potvrden" ? "FER" : null);
}

describe("User.isVerifiedStudent", () => {
  it("student s potvrđenim statusom je potvrđeni student (F-002)", () => {
    expect(student("potvrden").isVerifiedStudent()).toBe(true);
  });

  it("student s nepotvrđenim statusom, partner i administrator nisu (F-004)", () => {
    expect(student("nepotvrden").isVerifiedStudent()).toBe(false);
    expect(new User("2", "kafic@example.com", "partner", null, null).isVerifiedStudent()).toBe(false);
    expect(new User("3", "admin@example.com", "admin", null, null).isVerifiedStudent()).toBe(false);
  });

  it("korisnik bez profila nije potvrđeni student", () => {
    expect(new User("4", "novi@example.com", null, null, null).isVerifiedStudent()).toBe(false);
  });
});

describe("User.hasAcceptedTerms", () => {
  it("bez vremena prihvaćanja uvjeti nisu prihvaćeni (F-032)", () => {
    expect(student("potvrden").hasAcceptedTerms()).toBe(false);
  });

  it("s vremenom prihvaćanja uvjeti su prihvaćeni", () => {
    const user = new User("1", "ana@fer.hr", "student", "potvrden", "FER", "Ana", true, new Date("2026-11-01"));
    expect(user.hasAcceptedTerms()).toBe(true);
  });
});

describe("User.isAdmin", () => {
  it("samo uloga admin je administrator (NF-03)", () => {
    expect(new User("3", "admin@example.com", "admin", null, null).isAdmin()).toBe(true);
    expect(new User("2", "kafic@example.com", "partner", null, null).isAdmin()).toBe(false);
    expect(student("potvrden").isAdmin()).toBe(false);
  });
});
