import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromCookies } from "@/lib/auth"; // korábbi helpered
import { validateGroupName } from "@/lib/validation";

export async function POST(req: Request) {
  const user = await getUserFromCookies();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { name } = await req.json();
  const validation = validateGroupName(name);
  if (!validation.success) {
    return NextResponse.json({ error: validation.error }, { status: 400 });
  }

  const group = await prisma.wordGroup.create({
    data: {
      name: validation.data,
      userId: user.id,
    },
  });

  return NextResponse.json(group, { status: 201 });
}
