export type ValidationResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

export type WordPairInput = {
  id?: number;
  en: string;
  hu: string;
};

export type SanitizedWordPairInput = {
  id?: number;
  en: string;
  hu: string;
};

export function validateRegistrationInput(input: {
  name?: unknown;
  email?: unknown;
  password?: unknown;
}): ValidationResult<{ name: string; email: string; password: string }> {
  const name = typeof input.name === "string" ? input.name.trim() : "";
  const email = typeof input.email === "string" ? input.email.trim().toLowerCase() : "";
  const password = typeof input.password === "string" ? input.password : "";

  if (!name || !email || !password) {
    return { success: false, error: "Minden mező kitöltése kötelező." };
  }

  if (name.length < 2) {
    return { success: false, error: "A név legalább 2 karakter hosszú legyen." };
  }

  if (name.length > 80) {
    return { success: false, error: "A név legfeljebb 80 karakter lehet." };
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { success: false, error: "Adj meg egy érvényes email címet." };
  }

  if (password.length < 8) {
    return { success: false, error: "A jelszó legalább 8 karakter hosszú legyen." };
  }

  return { success: true, data: { name, email, password } };
}

export function validateGroupName(name: unknown): ValidationResult<string> {
  const normalized = typeof name === "string" ? name.trim() : "";

  if (!normalized) {
    return { success: false, error: "A csomag neve kötelező." };
  }

  if (normalized.length < 2) {
    return { success: false, error: "A csomag neve legalább 2 karakter hosszú legyen." };
  }

  if (normalized.length > 100) {
    return { success: false, error: "A csomag neve legfeljebb 100 karakter lehet." };
  }

  return { success: true, data: normalized };
}

export function sanitizeWordPairs(cards: unknown): ValidationResult<SanitizedWordPairInput[]> {
  if (!Array.isArray(cards)) {
    return { success: false, error: "A szókártyák formátuma érvénytelen." };
  }

  const sanitized: SanitizedWordPairInput[] = [];

  for (const item of cards) {
    if (!item || typeof item !== "object") {
      return { success: false, error: "A szókártyák formátuma érvénytelen." };
    }

    const raw = item as Partial<WordPairInput>;
    const en = typeof raw.en === "string" ? raw.en.trim() : "";
    const hu = typeof raw.hu === "string" ? raw.hu.trim() : "";

    if (!en && !hu) {
      continue;
    }

    if (!en || !hu) {
      return { success: false, error: "Minden kártyánál mindkét nyelvi mezőt töltsd ki." };
    }

    if (en.length > 120 || hu.length > 120) {
      return { success: false, error: "Egy szó legfeljebb 120 karakter lehet." };
    }

    const sanitizedCard: SanitizedWordPairInput = { en, hu };

    if (typeof raw.id === "number") {
      sanitizedCard.id = raw.id;
    }

    sanitized.push(sanitizedCard);
  }

  return { success: true, data: sanitized };
}
