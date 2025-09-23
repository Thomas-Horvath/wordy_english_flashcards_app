import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromCookies } from "@/lib/auth";

export async function GET() {
  const user = await getUserFromCookies();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const groups = await prisma.wordGroup.findMany({
    where: { userId: user.id },
    orderBy: { name: "asc" },
    select: { id: true, name: true, _count: { select: { cards: true } } },
  });

  const sorted = groups.sort((a, b) =>
  a.name.localeCompare(b.name, "hu") // 👈 magyar rendezés
);

  return NextResponse.json(sorted);
}

export async function POST(req: Request) {
  const user = await getUserFromCookies();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { name } = await req.json();
  const group = await prisma.wordGroup.create({
    data: { name, userId: user.id },
  });

  return NextResponse.json(group);
}
