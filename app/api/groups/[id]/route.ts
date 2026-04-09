import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getUserFromCookies } from "@/lib/auth";
import { planWordPairChanges } from "@/lib/wordPairs";
import { sanitizeWordPairs, validateGroupName } from "@/lib/validation";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getUserFromCookies();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const groupId = Number(id);

  if (isNaN(groupId)) return NextResponse.json({ error: "Invalid id" }, { status: 400 });

  const group = await prisma.wordGroup.findFirst({
    where: { id: groupId, userId: user.id },
    include: { cards: true },
  });

  if (!group) return NextResponse.json({ error: "Group not found" }, { status: 404 });

  return NextResponse.json(group);
}


// PUT /api/groups/:id -> frissíti a nevet + szavakat
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getUserFromCookies();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const groupId = Number(id);

  if (Number.isNaN(groupId)) return NextResponse.json({ error: "Invalid id" }, { status: 400 });

  const { name, cards } = await req.json() as {
    name: string;
    cards: { id?: number; en: string; hu: string }[];
  };

  const nameValidation = validateGroupName(name);
  if (!nameValidation.success) {
    return NextResponse.json({ error: nameValidation.error }, { status: 400 });
  }

  const cardsValidation = sanitizeWordPairs(cards);
  if (!cardsValidation.success) {
    return NextResponse.json({ error: cardsValidation.error }, { status: 400 });
  }

  const group = await prisma.wordGroup.findFirst({
    where: { id: groupId, userId: user.id },
    include: {
      cards: {
        select: { id: true, en: true, hu: true },
        orderBy: { id: "asc" },
      },
    },
  });

  if (!group) {
    return NextResponse.json({ error: "Group not found" }, { status: 404 });
  }

  let plan;
  try {
    plan = planWordPairChanges(group.cards, cardsValidation.data);
  } catch {
    return NextResponse.json(
      { error: "Érvénytelen kártyaazonosító érkezett a mentéshez." },
      { status: 400 }
    );
  }

  await prisma.$transaction(async (tx) => {
    await tx.wordGroup.update({
      where: { id: groupId },
      data: { name: nameValidation.data },
    });

    if (plan.deleteIds.length > 0) {
      await tx.wordPair.deleteMany({
        where: { groupId, id: { in: plan.deleteIds } },
      });
    }

    for (const card of plan.update) {
      await tx.wordPair.update({
        where: { id: card.id },
        data: { en: card.en, hu: card.hu },
      });
    }

    if (plan.create.length > 0) {
      await tx.wordPair.createMany({
        data: plan.create.map((card) => ({
          ...card,
          groupId,
        })),
      });
    }
  });

  return NextResponse.json({ success: true });
}


export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getUserFromCookies();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const groupId = Number(id);
  if (isNaN(groupId)) {
    return NextResponse.json({ error: "Érvénytelen ID" }, { status: 400 });
  }

  try {
    const deleted = await prisma.wordGroup.deleteMany({
      where: { id: groupId, userId: user.id },
    });

    if (deleted.count === 0) {
      return NextResponse.json({ error: "Group not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Csoport törölve" });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Nem sikerült törölni a csoportot" },
      { status: 500 }
    );
  }
}
