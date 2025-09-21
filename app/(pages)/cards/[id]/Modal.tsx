"use client";

import Link from "next/link";
import React from "react";

type ModalProps = {
    title: string;
    onRestart: () => void;
    onRestartReversed: () => void;

};

export default function Modal({
    title,
    onRestart,
    onRestartReversed
}: ModalProps) {
    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <div className="bg-neutral-800 text-white rounded-lg p-6 w-[90%] max-w-md shadow-lg">
                <h2 className="text-2xl font-bold mb-6 text-center">{title}</h2>
                <div className="flex flex-col gap-3">
                    <button
                        className="px-4 py-2 rounded bg-indigo-600 hover:bg-indigo-500"
                        onClick={onRestart}
                    >
                        🔄 Újrakezdem (ugyanazzal a nyelvvel)
                    </button>
                    <button
                        className="px-4 py-2 rounded bg-purple-600 hover:bg-purple-500"
                        onClick={onRestartReversed}
                    >
                        🔃 Újrakezdem (fordított nyelvvel)
                    </button>



                    <Link href="/packages" className="px-4 py-2 rounded bg-red-600 hover:bg-red-500 text-center">🚪 Kilépek</Link>


                </div>
            </div>
        </div>
    );
}
