"use client";

import { useState } from "react";

import Card from "@/app/(pages)/cards/[id]/Card";

import Modal from "./Modal";

type WordPair = { id: number; en: string; hu: string };

export default function CardPlayer({ initialWords }: { initialWords: WordPair[] }) {
    const [index, setIndex] = useState(0);
    const [startLang, setStartLang] = useState<"en" | "hu">("en"); // alap: angol
    const [showModal, setShowModal] = useState(false);
    
   


    const next = () => {
        if (index < initialWords.length - 1) {
            setIndex((i) => i + 1);
        } else {
            setShowModal(true);
        }
    };

    const handleRestart = () => {
        setIndex(0);
        setShowModal(false);
    };

    const handleRestartReversed = () => {
        setIndex(0);
        setStartLang((prev) => (prev === "en" ? "hu" : "en"));
        setShowModal(false);
    };

   

    return (
        <main className="flex flex-col items-center justify-center min-h-screen bg-neutral-900 gap-6">

            {/* key={index} → a Card újramountol, ezért mindig angol oldalról indul */}
            <Card key={index} word={initialWords[index]} startLang={startLang} />

            <button
                onClick={next}
                className="px-6 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white"
            >
                Következő ➡️
            </button>




            {showModal && (
                <Modal
                    title="🎉 Vége a csomagnak!"
                    onRestart={handleRestart}
                    onRestartReversed={handleRestartReversed}
                    
                />
            )}


        </main>
    );
}
