import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id);
  if (isNaN(id)) {
    return NextResponse.json({ error: "Érvénytelen ID" }, { status: 400 });
  }

  try {
    await prisma.wordPair.delete({ where: { id } });
    return NextResponse.json({ message: "Szó törölve" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Nem sikerült törölni" }, { status: 500 });
  }
}
