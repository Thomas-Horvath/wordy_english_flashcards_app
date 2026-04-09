"use client";

import Link from "next/link";
import React from "react";

// Ez a modal most már egy általános célú, újrahasznosítható felugró ablak:
// ugyanaz a komponens kezeli a gyakorlás eleji nyelvválasztást
// és a gyakorlás végi újrakezdési lehetőségeket is.
type ModalProps = {
    title: string;
    primaryLabel: string;
    secondaryLabel: string;
    onPrimary: () => void;
    onSecondary: () => void;
    exitLabel?: string;
    exitHref?: string;
};

export default function Modal({
    title,
    primaryLabel,
    secondaryLabel,
    onPrimary,
    onSecondary,
    exitLabel,
    exitHref
}: ModalProps) {
    return (
        // A teljes képernyős, sötét overlay a háttér tompítására szolgál,
        // hogy a fókusz egyértelműen a modal tartalmára kerüljön.
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <div className="bg-neutral-800 text-white rounded-lg p-6 w-[90%] max-w-md shadow-lg">
                <h2 className="text-2xl font-bold mb-6 text-center">{title}</h2>
                <div className="flex flex-col gap-3">
                    {/* Elsődleges művelet:
                        kezdéskor például "Angol -> Magyar",
                        befejezéskor például "Újrakezdem". */}
                    <button
                        className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-500"
                        onClick={onPrimary}
                    >
                        {primaryLabel}
                    </button>

                    {/* Másodlagos művelet:
                        kezdéskor a másik induló nyelv,
                        befejezéskor pedig a fordított nyelvi irányú újrakezdés. */}
                    <button
                        className="px-4 py-2 rounded bg-purple-600 hover:bg-purple-500"
                        onClick={onSecondary}
                    >
                        {secondaryLabel}
                    </button>

                    {/* Kilépési link csak akkor jelenik meg,
                        ha a hívó komponens ténylegesen ad hozzá feliratot és célt. */}
                    {exitLabel && exitHref && (
                        <Link href={exitHref} className="px-4 py-2 rounded bg-red-600 hover:bg-red-500 text-center">
                            {exitLabel}
                        </Link>
                    )}

                </div>
            </div>
        </div>
    );
}
