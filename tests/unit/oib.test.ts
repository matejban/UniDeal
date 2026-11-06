// Pokretanje: npm test
import assert from "node:assert/strict";
import { test } from "node:test";
import { Partner } from "../../src/domain/Partner.ts";

test("ispravan OIB prolazi", () => {
  assert.equal(Partner.isValidOib("69435151530"), true);
  assert.equal(Partner.isValidOib("94577403194"), true);
  // Kontrolna znamenka je 0 kad je 11 - a = 10.
  assert.equal(Partner.isValidOib("00000000001"), true);
});

test("OIB koji nema točno 11 znamenki se odbija", () => {
  assert.equal(Partner.isValidOib("6943515153"), false);
  assert.equal(Partner.isValidOib("694351515301"), false);
  assert.equal(Partner.isValidOib("6943515153a"), false);
  assert.equal(Partner.isValidOib(""), false);
});

test("OIB s krivom kontrolnom znamenkom se odbija", () => {
  assert.equal(Partner.isValidOib("69435151531"), false);
  assert.equal(Partner.isValidOib("94577403195"), false);
});
