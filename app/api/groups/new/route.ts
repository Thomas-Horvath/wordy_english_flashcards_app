import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth"; // korábbi helpered

export async function POST(req: Request) {
  const user = await getUserFromRequest(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { name } = await req.json();
  if (!name || typeof name !== "string") {
    return NextResponse.json({ error: "Név kötelező" }, { status: 400 });
  }

  const group = await prisma.wordGroup.create({
    data: {
      name,
      userId: user.id,
    },
  });

  return NextResponse.json(group, { status: 201 });
}
