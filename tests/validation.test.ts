import test from "node:test";
import assert from "node:assert/strict";

import {
  sanitizeWordPairs,
  validateGroupName,
  validateRegistrationInput,
} from "../lib/validation";
import { planWordPairChanges } from "../lib/wordPairs";

test("validateRegistrationInput accepts normalized valid input", () => {
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

test("validateRegistrationInput rejects weak password", () => {
  const result = validateRegistrationInput({
    name: "Teszt",
    email: "teszt@example.com",
    password: "123",
  });

  assert.equal(result.success, false);
});

test("validateGroupName trims and validates name", () => {
  const result = validateGroupName("  Alap igek  ");

  assert.equal(result.success, true);
  if (result.success) {
    assert.equal(result.data, "Alap igek");
  }
});

test("sanitizeWordPairs rejects half-filled rows", () => {
  const result = sanitizeWordPairs([
    { en: "dog", hu: "" },
  ]);

  assert.equal(result.success, false);
});

test("sanitizeWordPairs drops fully empty rows and trims content", () => {
  const result = sanitizeWordPairs([
    { en: " dog ", hu: " kutya " },
    { en: "", hu: "" },
  ]);

  assert.equal(result.success, true);
  if (result.success) {
    assert.deepEqual(result.data, [{ en: "dog", hu: "kutya" }]);
  }
});

test("planWordPairChanges computes create, update and delete operations", () => {
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
