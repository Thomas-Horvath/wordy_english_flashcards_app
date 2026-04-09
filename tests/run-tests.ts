import assert from "node:assert/strict";

import {
  sanitizeWordPairs,
  validateGroupName,
  validateRegistrationInput,
} from "../lib/validation.ts";
import { planWordPairChanges } from "../lib/wordPairs.ts";

function run(name: string, fn: () => void) {
  fn();
  console.log(`PASS ${name}`);
}

run("validateRegistrationInput normalizes valid input", () => {
  const result = validateRegistrationInput({
    name: "  Teszt Elek ",
    email: " TEST@EXAMPLE.COM ",
    password: "password123",
  });

  assert.equal(result.success, true);
  if (result.success) {
    assert.deepEqual(result.data, {
      name: "Teszt Elek",
      email: "test@example.com",
      password: "password123",
    });
  }
});

run("validateRegistrationInput rejects weak password", () => {
  const result = validateRegistrationInput({
    name: "Teszt",
    email: "teszt@example.com",
    password: "123",
  });

  assert.equal(result.success, false);
});

run("validateGroupName trims and validates", () => {
  const result = validateGroupName("  Alap igek  ");

  assert.equal(result.success, true);
  if (result.success) {
    assert.equal(result.data, "Alap igek");
  }
});

run("sanitizeWordPairs rejects half-filled rows", () => {
  const result = sanitizeWordPairs([{ en: "dog", hu: "" }]);
  assert.equal(result.success, false);
});

run("sanitizeWordPairs trims rows and removes empty lines", () => {
  const result = sanitizeWordPairs([
    { en: " dog ", hu: " kutya " },
    { en: "", hu: "" },
  ]);

  assert.equal(result.success, true);
  if (result.success) {
    assert.deepEqual(result.data, [{ en: "dog", hu: "kutya" }]);
  }
});

run("planWordPairChanges computes create update delete sets", () => {
  const plan = planWordPairChanges(
    [
      { id: 1, en: "dog", hu: "kutya" },
      { id: 2, en: "cat", hu: "macska" },
    ],
    [
      { id: 1, en: "dog", hu: "eb" },
      { en: "bird", hu: "madar" },
    ]
  );

  assert.deepEqual(plan, {
    create: [{ en: "bird", hu: "madar" }],
    update: [{ id: 1, en: "dog", hu: "eb" }],
    deleteIds: [2],
  });
});

console.log("All tests passed.");
