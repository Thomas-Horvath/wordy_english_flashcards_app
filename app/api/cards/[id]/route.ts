import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromCookies } from "@/lib/auth";

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const user = await getUserFromCookies();
    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const cardId = Number(id);
    if (isNaN(cardId)) {
        return NextResponse.json({ error: "Érvénytelen ID" }, { status: 400 });
    }

    try {
        const card = await prisma.wordPair.findFirst({
            where: {
                id: cardId,
                group: { userId: user.id },
            },
            select: { id: true },
        });

        if (!card) {
            return NextResponse.json({ error: "Szó nem található" }, { status: 404 });
        }

        await prisma.wordPair.delete({ where: { id: cardId } });
        return NextResponse.json({ message: "Szó törölve" });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Nem sikerült törölni" }, { status: 500 });
    }
}
