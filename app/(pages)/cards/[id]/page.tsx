import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import CardPlayer from "./CardPlayer"; // klienses komponens

type WordPair = { id: number; en: string; hu: string };

function shuffle<T>(arr: T[]): T[] {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

export default async function Page({ params }: { params: { id: string } }) {
    const { id } = await params;  // 👈 await-eljük a params-ot
    const groupId = Number(id);
    if (Number.isNaN(groupId)) return notFound();

    const cards = await prisma.wordPair.findMany({
        where: { groupId },
        select: { id: true, en: true, hu: true },
        orderBy: { id: "asc" },
    });

    if (cards.length === 0) {
        return (
            <main className="flex items-center justify-center min-h-screen bg-neutral-900 text-white">
                Nincs adat ehhez a csomaghoz…
            </main>
        );
    }

    const randomized: WordPair[] = shuffle(cards);
    return <CardPlayer initialWords={randomized} />;
}
