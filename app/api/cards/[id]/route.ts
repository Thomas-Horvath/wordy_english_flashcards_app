import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const cardId = Number(id);
    if (isNaN(cardId)) {
        return NextResponse.json({ error: "Érvénytelen ID" }, { status: 400 });
    }

    try {
        await prisma.wordPair.delete({ where: { id: cardId } });
        return NextResponse.json({ message: "Szó törölve" });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Nem sikerült törölni" }, { status: 500 });
    }
}
