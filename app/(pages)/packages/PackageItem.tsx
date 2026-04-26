"use client";

import Link from "next/link";
import { useState } from "react";
import { FaPlay, FaEdit, FaTrash } from "react-icons/fa";
import AlertModal from "@/app/components/AlertModal";

type Props = {
    id: number;
    name: string;
    count: number;
};

export default function PackageItem({ id, name, count }: Props) {
    const [deleting, setDeleting] = useState(false);
    const [error, setError] = useState("");

    const handleDelete = async () => {
        if (!confirm("Biztosan törlöd a szócsomagot?")) return;

        setError("");
        setDeleting(true);
        const res = await fetch(`/api/groups/${id}`, {
            method: "DELETE",
        });

        if (res.ok) {
            // egyszerű megoldás → reload
            window.location.reload();
        } else {
            const data = await res.json().catch(() => null);
            setError(data?.error || "Hiba történt a törlés során.");
            setDeleting(false);
        }
    };

    return (
        <>
            <li className="flex flex-col sm:flex-row gap-6 items-center justify-between rounded-xl border border-neutral-600 bg-neutral-900 px-4 py-3 hover:bg-neutral-800">
                <div className="flex flex-col jutsify-center items-center sm:items-start">
                    <span className="text-md font-bold tracking-wider text-blue-500">{name}</span>
                    <span className="ms-1 text-sm text-neutral-400">{count} szó</span>
                </div>

                <div className="flex gap-3">
                    <Link
                        href={`/cards/${id}`}
                        className="rounded-lg bg-indigo-600 px-4 py-2 text-white text-sm font-medium hover:bg-indigo-500 transition"
                    >
                        <FaPlay />
                    </Link>

                    <Link
                        href={`/packages/edit/${id}`}
                        className="rounded-lg border border-neutral-500 px-4 py-2 text-sm text-neutral-300 hover:bg-green-600 hover:text-white transition"
                    >
                        <FaEdit />
                    </Link>

                    <button
                        onClick={handleDelete}
                        disabled={deleting}
                        className="rounded-lg border border-red-500 px-4 py-2 text-sm text-red-400 hover:bg-red-600 hover:text-white transition cursor-pointer disabled:opacity-50"
                    >
                        {deleting ? (
                            <span className="animate-spin">⏳</span>
                        ) : (
                            <FaTrash />
                        )}
                    </button>
                </div>
            </li>

            <AlertModal
                open={Boolean(error)}
                message={error}
                onClose={() => setError("")}
            />
        </>
    );
}
