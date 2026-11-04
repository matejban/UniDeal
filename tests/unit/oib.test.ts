// Pokretanje: npm test
import assert from "node:assert/strict";
import { test } from "node:test";
import { isValidOib } from "../../src/domain/oib.ts";

test("ispravan OIB prolazi", () => {
  assert.equal(isValidOib("69435151530"), true);
  assert.equal(isValidOib("94577403194"), true);
  // Kontrolna znamenka 0 kad je 11 - a = 10.
  assert.equal(isValidOib("00000000001"), true);
});

test("OIB koji nema točno 11 znamenki se odbija", () => {
  assert.equal(isValidOib("6943515153"), false);
  assert.equal(isValidOib("694351515301"), false);
  assert.equal(isValidOib("6943515153a"), false);
  assert.equal(isValidOib(""), false);
});

test("OIB s krivom kontrolnom znamenkom se odbija", () => {
  assert.equal(isValidOib("69435151531"), false);
  assert.equal(isValidOib("94577403195"), false);
});
