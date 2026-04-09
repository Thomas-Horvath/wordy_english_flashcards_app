import type { SanitizedWordPairInput } from "./validation.ts";

type ExistingWordPair = {
  id: number;
  en: string;
  hu: string;
};

type WordPairChangePlan = {
  create: Array<{ en: string; hu: string }>;
  update: Array<{ id: number; en: string; hu: string }>;
  deleteIds: number[];
};

export function planWordPairChanges(
  existingCards: ExistingWordPair[],
  incomingCards: SanitizedWordPairInput[]
): WordPairChangePlan {
  const existingById = new Map(existingCards.map((card) => [card.id, card]));
  const seenIds = new Set<number>();

  const create: Array<{ en: string; hu: string }> = [];
  const update: Array<{ id: number; en: string; hu: string }> = [];

  for (const card of incomingCards) {
    if (typeof card.id !== "number") {
      create.push({ en: card.en, hu: card.hu });
      continue;
    }

    if (seenIds.has(card.id)) {
      throw new Error("Duplicate card id");
    }

    seenIds.add(card.id);

    const existing = existingById.get(card.id);
    if (!existing) {
      throw new Error("Unknown card id");
    }

    if (existing.en !== card.en || existing.hu !== card.hu) {
      update.push({ id: card.id, en: card.en, hu: card.hu });
    }
  }

  const deleteIds = existingCards
    .filter((card) => !seenIds.has(card.id))
    .map((card) => card.id);

  return { create, update, deleteIds };
}
