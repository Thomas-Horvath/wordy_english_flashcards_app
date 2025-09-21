"use client";

import { useState, useEffect } from "react";

type WordPair = { en: string; hu: string };

export default function Card({
  word,
  startLang,
}: {
  word: WordPair;
  startLang: "en" | "hu";
}) {
  const [rotation, setRotation] = useState(0);
  const [frontText, setFrontText] = useState(word.en);
  const [backText, setBackText] = useState(word.hu);

  // ha új szó érkezik (új mount is lehet), induljon angol oldalról
  useEffect(() => {
    setRotation(0);
  }, [word.en, word.hu]);

  // ha új szó érkezik → reset és startLang szerint állítjuk a tartalmat
  useEffect(() => {
    if (startLang === "en") {
      setFrontText(word.en);
      setBackText(word.hu);
    } else {
      setFrontText(word.hu);
      setBackText(word.en);
    }
    setRotation(0); // mindig az első oldalról indul
  }, [word, startLang]);

  return (
    <div
      className="w-[min(90vw,400px)] h-[50vh] [perspective:1000px] cursor-pointer"
      onClick={() => setRotation((r) => r + 180)} // mindig ugyanabba az irányba fordul a kártya
    >
      <div
        className="relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d]"
        style={{ transform: `rotateY(${rotation}deg)` }}
      >
        {/* Front (angol) */}
        <div className="absolute inset-0 grid place-items-center rounded-xl bg-neutral-800 text-white text-3xl [backface-visibility:hidden]">
          {frontText}
        </div>

        {/* Back (magyar) */}
        <div className="absolute inset-0 grid place-items-center rounded-xl bg-neutral-800 text-white text-3xl [backface-visibility:hidden] [transform:rotateY(180deg)]">
          {backText}
        </div>
      </div>
    </div>
  );
}
