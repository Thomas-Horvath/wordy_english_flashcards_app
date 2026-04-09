import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { validateRegistrationInput } from "@/lib/validation";

export async function POST(req: Request) {
  const body = await req.json();
  const validation = validateRegistrationInput(body);

  if (!validation.success) {
    return NextResponse.json({ error: validation.error }, { status: 400 });
  }

  const { name, email, password } = validation.data;

  const existingUser = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });

  if (existingUser) {
    return NextResponse.json(
      { error: "Ezzel az email címmel már létezik fiók." },
      { status: 409 }
    );
  }

  const hash = await bcrypt.hash(password, 10);

  try {
    const user = await prisma.user.create({
      data: { name, email, password: hash },
    });

    return NextResponse.json({ id: user.id, email: user.email });
  } catch (error) {
    const prismaError = error as { code?: string };
    if (prismaError.code === "P2002") {
      return NextResponse.json(
        { error: "Ezzel az email címmel már létezik fiók." },
        { status: 409 }
      );
    }

    console.error("Register error:", error);
    return NextResponse.json({ error: "Nem sikerült létrehozni a fiókot." }, { status: 500 });
  }
}
