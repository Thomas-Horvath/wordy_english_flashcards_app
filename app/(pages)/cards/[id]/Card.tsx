"use client";

import { useState } from "react";



export default function Card({
  front,
  back,
  frontLang
}: {
  front: string,
  back: string;
  frontLang: "en" | "hu";
}) {
  const [rotation, setRotation] = useState(0);
  const speak = (text: string, lang: string = "en-US") => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    speechSynthesis.speak(utterance);
  };



  return (
    <div
      className="w-[min(90vw,400px)] h-[50vh] [perspective:1000px] cursor-pointer"
      onClick={() => setRotation((r) => r + 180)} // mindig ugyanabba az irányba fordul a kártya
    >
      <div
        className="relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d] "
        style={{ transform: `rotateY(${rotation}deg)` }}
      >
        {/* Front (angol) */}
        <div className="absolute px-2 text-center inset-0 grid place-items-center rounded-xl bg-neutral-800 text-white text-3xl [backface-visibility:hidden]">
          {front}
          {/* Csak akkor, ha a front az angol */}
          {frontLang === "en" && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                speak(front);
              }}
              className=" fixed bottom-3 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg"
            >
              🔊
            </button>
          )}
        </div>

        {/* Back (magyar) */}
        <div className="absolute px-2 text-center inset-0 grid place-items-center rounded-xl bg-neutral-800 text-white text-3xl [backface-visibility:hidden] [transform:rotateY(180deg)]">
          {back}
          {/* Csak akkor, ha a front az angol */}
          {frontLang === "hu" && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                speak(back)
              }}
              className="fixed bottom-3 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg"
            >
              🔊
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
