import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import CardPlayer from "./CardPlayer"; // klienses komponens
import { getUserFromCookies, isLoggedIn } from "@/lib/auth";
import Link from "next/link";
import AuthGuard from "@/app/components/AuthGuard";

// Ennél az oldalnál fontos, hogy minden kérés friss adatból dolgozzon,
// mert a szókártyák és a bejelentkezési állapot menet közben is változhatnak.
export const dynamic = "force-dynamic";
export const revalidate = 0;

type WordPair = { en: string; hu: string };

export default async function Page({ params }: { params: { id: string } }) {
    // A dinamikus route paramétere a szócsomag azonosítója.
    // Ebből számot képzünk, mert az adatbázis numerikus ID-val dolgozik.
    const { id } = await params;
    const groupId = Number(id);

    // Szerveroldalon is ellenőrizzük, hogy van-e érvényes session.
    // Így már az oldal renderelése előtt eldől, megjelenhet-e a gyakorló felület.
    const loggedIn = await isLoggedIn();
    const user = await getUserFromCookies();

    if (Number.isNaN(groupId)) return notFound();

    // A kiválasztott csomaghoz tartozó szópárokat betöltjük.
    // Itt csak a ténylegesen szükséges mezőket kérjük le: angol és magyar alak.
    if (!loggedIn) {
        // Ha nincs bejelentkezve a felhasználó, nem a gyakorló nézetet adjuk vissza,
        // hanem egy egyszerű állapotképernyőt belépési linkkel.
        return (
            <main className="flex items-center justify-center min-h-screen">
                <p>Nem vagy bejelentkezve. <Link href="/login" className="text-blue-500">Bejelentkezés</Link></p>
            </main>
        );
    }

    if (!user) {
        return notFound();
    }

    const group = await prisma.wordGroup.findFirst({
        where: { id: groupId, userId: user.id },
        select: {
            cards: {
                select: { en: true, hu: true },
                orderBy: { id: "asc" },
            },
        },
    });

    if (!group) return notFound();

    const cards: WordPair[] = group.cards;


    if (cards.length === 0) {
        // Ha a csomag létezik, de nincs benne egyetlen szó sem,
        // a CardPlayer nem tudna mit megjeleníteni, ezért külön üzenetet adunk.
        return (
            <main className="flex items-center justify-center min-h-screen bg-neutral-900 text-white">
                Nincs adat ehhez a csomaghoz…
            </main>
        );
    }


    return (
        // Az AuthGuard kliensoldali védelemként is ott marad.
        // Ez kiegészíti a szerveroldali ellenőrzést, és segít,
        // ha a session az oldal megnyitása után jár le.
        <AuthGuard>
            <CardPlayer initialWords={cards} />
        </AuthGuard>
    );

}
