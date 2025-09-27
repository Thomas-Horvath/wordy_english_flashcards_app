"use client";

import { useState } from "react";

import Card from "@/app/(pages)/cards/[id]/Card";

import Modal from "./Modal";

type WordPair = { en: string; hu: string };

export default function CardPlayer({ initialWords }: { initialWords: WordPair[] }) {
    const [index, setIndex] = useState(0);
    const [words, setWords] = useState<WordPair[]>(shuffle(initialWords));
    const [startLang, setStartLang] = useState<"en" | "hu">("en"); // alap: angol
    const [showModal, setShowModal] = useState(false);


    const total = words.length;
    const remaining = total - index - 1;
    // progress százalék
    const progress = Math.round(((index + 1 ) / total) * 100);

    function shuffle<T>(arr: T[]): T[] {
        const a = [...arr];
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    }

    const next = () => {
        if (index < words.length - 1) {
            setIndex((i) => i + 1);
        } else {
            setShowModal(true);
        }
    };
    const restart = (reverse = false) => {
        setWords(shuffle(initialWords)); // újrakeverés
        setIndex(0);
        if (reverse) {
            setStartLang((prev) => (prev === "en" ? "hu" : "en"));
        }
        setShowModal(false);
    };

    // mindig legeneráljuk az adott kártyához a front/back párost
    const current = words[index];
    const front = startLang === "en" ? current.en : current.hu;
    const back = startLang === "en" ? current.hu : current.en;



    return (
        <main className="flex flex-col items-center justify-center min-h-screen bg-neutral-900 gap-2 pt-24">
            {/* ✅ Progress kijelzés */}
            <div className="w-full max-w-md text-center  mb-16 px-4">
                <div className="flex justify-between text-gray-300 text-sm mb-2">
                    <span>✅ {index + 1} / {total} szó</span>
                    <span>📚 {remaining >= 0 ? remaining : 0} szó van még hátra</span>
                </div>

                <div className="w-full h-3 bg-neutral-700 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-indigo-500 transition-all duration-500"
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>
            </div>




            {/* key={index} → a Card újramountol, ezért mindig angol oldalról indul */}
            <Card key={index} front={front} back={back} frontLang={startLang} />

            <button
                onClick={next}
                className="mt-10 px-6 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white"
            >
                Következő ➡️
            </button>




            {showModal && (
                <Modal
                    title="🎉 Vége a csomagnak!"
                    onRestart={() => restart(false)}
                    onRestartReversed={() => restart(true)}
                />
            )}


        </main>
    );
}
