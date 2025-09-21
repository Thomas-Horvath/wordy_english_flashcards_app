import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const groupId = Number(id);

  if (isNaN(groupId)) return NextResponse.json({ error: "Invalid id" }, { status: 400 });

  const group = await prisma.wordGroup.findUnique({
    where: { id: groupId },
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
  const { id } = await params;
  const groupId = Number(id);

  if (Number.isNaN(groupId)) return NextResponse.json({ error: "Invalid id" }, { status: 400 });

  const { name, cards } = await req.json() as {
    name: string;
    cards: { id?: number; en: string; hu: string }[];
  };

  // először update a group név
  await prisma.wordGroup.update({
    where: { id: groupId },
    data: { name },
  });

  // töröljük az összes régit, majd újra létrehozzuk (egyszerű megoldás)
  await prisma.wordPair.deleteMany({ where: { groupId } });
  await prisma.wordPair.createMany({
    data: cards.map(c => ({
      en: c.en,
      hu: c.hu,
      groupId,
    })),
  });

  return NextResponse.json({ success: true });
}


export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {

  const { id } = await params;
  const groupId = Number(id);
  if (isNaN(groupId)) {
    return NextResponse.json({ error: "Érvénytelen ID" }, { status: 400 });
  }

  try {
    await prisma.wordGroup.delete({
      where: { id: groupId },
    });
    return NextResponse.json({ message: "Csoport törölve" });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Nem sikerült törölni a csoportot" },
      { status: 500 }
    );
  }
}