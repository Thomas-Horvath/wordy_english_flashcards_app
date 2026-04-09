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
  // A forgatás fokát tároljuk. 0 fok az alaphelyzet, 180 fok a hátoldal.
  // Minden kattintás újabb 180 fokkal fordítja el a kártyát.
  const [rotation, setRotation] = useState(0);

  // A böngésző beépített beszéd API-ját használjuk a kiejtéshez.
  // Alapból angol nyelvkódot adunk át, mert a felolvasás célja itt
  // elsődlegesen az angol szó kiejtésének segítése.
  const speak = (text: string, lang: string = "en-US") => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    speechSynthesis.speak(utterance);
  };

  return (
    <div
      className="w-[min(90vw,400px)] h-[50vh] perspective:[1000px] cursor-pointer"
      // A külső konténeren van a perspektíva, hogy a 3D flip térbelinek hasson.
      // Kattintásra mindig ugyanabba az irányba fordítjuk a kártyát.
      onClick={() => setRotation((r) => r + 180)}
    >
      <div
        className="relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d] "
        style={{ transform: `rotateY(${rotation}deg)` }}
      >
        {/* Az első oldal mindig a "front" prop.
            Hogy ez angol vagy magyar, azt nem ez a komponens dönti el,
            hanem a CardPlayer a kiválasztott kezdő nyelv alapján. */}
        <div className="absolute px-2 text-center inset-0 grid place-items-center rounded-xl bg-neutral-800 text-white text-3xl [backface-visibility:hidden]">
          {front}

          {/* Ha a front az angol oldal, itt jelenítjük meg a hang ikont,
              hogy a felhasználó meg tudja hallgatni a kiejtést. */}
          {frontLang === "en" && (
            <button
              onClick={(e) => {
                // A gomb ne fordítsa meg a kártyát kattintáskor,
                // csak a hang lejátszását indítsa el.
                e.stopPropagation();
                speak(front);
              }}
              className=" fixed bottom-3 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg"
            >
              🔊
            </button>
          )}
        </div>

        {/* A hátoldal 180 fokkal el van fordítva.
            Emiatt akkor válik olvashatóvá, amikor a teljes kártya is elfordul. */}
        <div className="absolute px-2 text-center inset-0 grid place-items-center rounded-xl bg-neutral-800 text-white text-3xl [backface-visibility:hidden] [transform:rotateY(180deg)]">
          {back}

          {/* Ha magyar oldalról indulunk, akkor a hátoldal lesz az angol szó,
              ezért ilyenkor itt tesszük elérhetővé a hangos felolvasást. */}
          {frontLang === "hu" && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                speak(back);
              }}
              className="fixed bottom-3 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg"
            >
              🔊
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
