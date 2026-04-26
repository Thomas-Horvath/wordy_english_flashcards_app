import { prisma } from "@/lib/prisma";
import CardPlayer from "./CardPlayer"; // klienses komponens
import { getUserFromCookies, isLoggedIn } from "@/lib/auth";
import AlertModal from "@/app/components/AlertModal";
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

    if (Number.isNaN(groupId)) {
        return (
            <main className="min-h-screen bg-neutral-900">
                <AlertModal
                    open
                    message="Érvénytelen szócsomag azonosító."
                    closeHref="/packages"
                />
            </main>
        );
    }

    // A kiválasztott csomaghoz tartozó szópárokat betöltjük.
    // Itt csak a ténylegesen szükséges mezőket kérjük le: angol és magyar alak.
    if (!loggedIn) {
        return (
            <main className="min-h-screen bg-neutral-900">
                <AlertModal
                    open
                    message="Nem vagy bejelentkezve."
                    closeHref="/login"
                />
            </main>
        );
    }

    if (!user) {
        return (
            <main className="min-h-screen bg-neutral-900">
                <AlertModal
                    open
                    message="Nem sikerült azonosítani a felhasználót."
                    closeHref="/login"
                />
            </main>
        );
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

    if (!group) {
        return (
            <main className="min-h-screen bg-neutral-900">
                <AlertModal
                    open
                    message="A szócsomag nem található."
                    closeHref="/packages"
                />
            </main>
        );
    }

    const cards: WordPair[] = group.cards;

    if (cards.length === 0) {
        return (
            <main className="min-h-screen bg-neutral-900">
                <AlertModal
                    open
                    message="Ebben a szócsomagban még nincs egyetlen szó sem."
                    closeHref="/packages"
                />
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
