"use client";

import { useState } from "react";
import Card from "@/app/(pages)/cards/[id]/Card";
import Modal from "./Modal";

type WordPair = { en: string; hu: string };

export default function CardPlayer({ initialWords }: { initialWords: WordPair[] }) {
    // Az index mutatja, hogy a megkevert listában éppen melyik kártyán állunk.
    const [index, setIndex] = useState(0);

    // A szavakat nem rögtön induláskor töltjük be, hanem csak akkor,
    // amikor a felhasználó kiválasztotta a kezdő nyelvet a nyitó modalban.
    const [words, setWords] = useState<WordPair[]>([]);

    // Ez tárolja, melyik oldal legyen a kártya eleje:
    // "en" esetén angolról indulunk, "hu" esetén magyarról.
    const [startLang, setStartLang] = useState<"en" | "hu">("en");

    // A kezdő modal addig látszik, amíg a felhasználó nem dönt a kezdő nyelvről.
    const [showStartModal, setShowStartModal] = useState(true);

    // Ez a befejező modal állapota, ami akkor nyílik meg,
    // amikor a felhasználó az utolsó kártyán is tovább lép.
    const [showModal, setShowModal] = useState(false);

    // A progress UI számításai.
    const total = words.length;
    const remaining = total - index - 1;
    const progress = total > 0 ? Math.round(((index + 1) / total) * 100) : 0;

    // Fisher-Yates keverés:
    // minden új gyakorlásnál új sorrendben jelennek meg a kártyák,
    // hogy ne mindig ugyanabban a mintában tanuljon a felhasználó.
    function shuffle<T>(arr: T[]): T[] {
        const a = [...arr];
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    }

    // A gyakorlás tényleges kezdése itt történik.
    // A választott nyelvet elmentjük, megkeverjük a kapott szavakat,
    // az indexet nullázzuk, majd bezárjuk a kezdő modalt.
    const startSession = (lang: "en" | "hu") => {
        setStartLang(lang);
        setWords(shuffle(initialWords));
        setIndex(0);
        setShowStartModal(false);
    };

    // Következő kártyára lépés.
    // Ha még van hátralévő elem, csak növeljük az indexet.
    // Ha ez volt az utolsó kártya, akkor a befejező modal jelenik meg.
    const next = () => {
        if (index < words.length - 1) {
            setIndex((i) => i + 1);
        } else {
            setShowModal(true);
        }
    };

    // Újrakezdés a végén megjelenő modalból.
    // `reverse = false`: marad ugyanaz a nyelvi irány.
    // `reverse = true`: megfordítjuk, melyik oldal legyen az első.
    // Mindkét esetben újrakeverjük a teljes csomagot.
    const restart = (reverse = false) => {
        const nextLang = reverse ? (startLang === "en" ? "hu" : "en") : startLang;
        setStartLang(nextLang);
        setWords(shuffle(initialWords));
        setIndex(0);
        setShowModal(false);
    };

    if (showStartModal) {
        return (
            <main className="flex items-center justify-center min-h-screen bg-neutral-900 pt-24">
                {/* A gyakorlás elején ugyanazt a modal komponenst használjuk,
                   mint a végén, csak más szöveggel és más gombműveletekkel. */}
                <Modal
                    title="Valaszd ki, milyen nyelvrol induljon a gyakorlas"
                    primaryLabel="🇬🇧 Angol -> Magyar"
                    secondaryLabel="🇭🇺 Magyar -> Angol"
                    onPrimary={() => startSession("en")}
                    onSecondary={() => startSession("hu")}
                    exitLabel="🚪 Vissza a csomagokhoz"
                    exitHref="/packages"
                />
            </main>
        );
    }

    // Az aktuális kártya front/back tartalma attól függ,
    // hogy milyen kezdő nyelvet választott a felhasználó.
    const current = words[index];
    const front = startLang === "en" ? current.en : current.hu;
    const back = startLang === "en" ? current.hu : current.en;

    return (
        <main className="flex flex-col items-center justify-center min-h-screen bg-neutral-900 gap-2 pt-24">
            {/* Haladásjelző: hányadik szónál tartunk és mennyi van még hátra. */}
            <div className="w-full max-w-md text-center  mb-16 px-4">
                <div className="flex justify-between text-gray-300 text-sm mb-2">
                    <span>✅ {index + 1} / {total} szó</span>
                    <span>📚 {remaining >= 0 ? remaining : 0} szó van még hátra</span>
                </div>

                <div className="w-full h-3 bg-neutral-700 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-blue-500 transition-all duration-500"
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>
            </div>

            {/* A key={index} miatt minden új kártyánál újra mountolódik a komponens.
               Ez fontos, mert így a forgatási állapot mindig alaphelyzetből indul. */}
            <Card key={index} front={front} back={back} frontLang={startLang} />

            <button
                onClick={next}
                className="mt-10 px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white"
            >
                Következő ➡️
            </button>

            {showModal && (
                // A gyakorlás végi modal innen vezérli az újrakezdést.
                <Modal
                    title="🎉 Vége a csomagnak!"
                    primaryLabel="🔄 Újrakezdem (ugyanazzal a nyelvvel)"
                    secondaryLabel="🔃 Újrakezdem (fordított nyelvvel)"
                    onPrimary={() => restart(false)}
                    onSecondary={() => restart(true)}
                    exitLabel="🚪 Kilépek"
                    exitHref="/packages"
                />
            )}
        </main>
    );
}
