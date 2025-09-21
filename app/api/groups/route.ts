import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth";

export async function GET(req: Request) {
  const user = await getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const groups = await prisma.wordGroup.findMany({
    where: { userId: user.id },
    orderBy: { id: "asc" },
    select: { id: true, name: true, _count: { select: { cards: true } } },
  });

  return NextResponse.json(groups);
}

export async function POST(req: Request) {
  const user = await getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { name } = await req.json();
  const group = await prisma.wordGroup.create({
    data: { name, userId: user.id },
  });

  return NextResponse.json(group);
}
