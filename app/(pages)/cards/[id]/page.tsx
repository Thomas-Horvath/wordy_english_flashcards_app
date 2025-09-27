import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import CardPlayer from "./CardPlayer"; // klienses komponens
import { isLoggedIn } from "@/lib/auth";
import Link from "next/link";
import AuthGuard from "@/app/components/AuthGuard";


export const dynamic = "force-dynamic";
export const revalidate = 0;


type WordPair = { en: string; hu: string };


export default async function Page({ params }: { params: { id: string } }) {
    const { id } = await params;  // 👈 await-eljük a params-ot
    const groupId = Number(id);
    const loggedIn = await isLoggedIn();

    if (Number.isNaN(groupId)) return notFound();

   

    const cards: WordPair[] = await prisma.wordPair.findMany({
        where: { groupId },
        select: { en: true, hu: true },
        orderBy: { id: "asc" },
    });

    if (!loggedIn) {
        // ha nincs user, átirányítjuk loginra
        return (
            <main className="flex items-center justify-center min-h-screen">
                <p>Nem vagy bejelentkezve. <Link href="/login" className="text-blue-500">Bejelentkezés</Link></p>
            </main>
        );
    }


    if (cards.length === 0) {
        return (
            <main className="flex items-center justify-center min-h-screen bg-neutral-900 text-white">
                Nincs adat ehhez a csomaghoz…
            </main>
        );
    }


    return (
        <AuthGuard>
            <CardPlayer initialWords={cards} />
        </AuthGuard>
    );

}
