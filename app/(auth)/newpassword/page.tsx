"use client";

import AuthGuard from "@/app/components/AuthGuard";
import { useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import Link from "next/link";

export default function RegisterPage() {
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const { loggedIn } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            setError("A két jelszó nem egyezik");
            return;
        }

        try {
            const res = await fetch("/api/change-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ oldPassword, newPassword }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "Hiba történt");
                return;
            }
            setError("");
            setMessage("Sikeres  jelszó változtatás! Jelentkezz be újra.");
            setTimeout(() => {
                window.location.href = "/login"
            }, 1500)
        } catch (err) {
            console.error("Register error:", err);
            setMessage("");
            setError("Hálózati hiba");
        }
    };


    if (!loggedIn) {
        // ha nincs user, átirányítjuk loginra
        return (
            <main className="flex items-center justify-center min-h-screen">
                <p>Nem vagy bejelentkezve. <Link href="/login" className="text-blue-500">Bejelentkezés</Link></p>
            </main>
        );
    }

    return (
        <AuthGuard>
            <main className="flex items-center justify-center min-h-screen bg-neutral-900 px-2">
                <form
                    onSubmit={handleSubmit}
                    className="w-full max-w-md bg-neutral-800 p-8 rounded-xl"
                >
                    <h1 className="text-2xl font-bold text-white mb-6 text-center">
                        Jelszó módosítása
                    </h1>

                    <input
                        type="password"
                        placeholder="Régi jeelszó"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        className="w-full mb-4 px-4 py-2 rounded bg-neutral-700 text-white"
                        required
                    />

                    <input
                        type="password"
                        placeholder="Új jelszó"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full mb-4 px-4 py-2 rounded bg-neutral-700 text-white"
                        required
                    />

                    <input
                        type="password"
                        placeholder="Új jelszó megerősítése"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full mb-6 px-4 py-2 rounded bg-neutral-700 text-white"
                        required
                    />
                    {error && <p className="text-red-500 text-sm my-2">{error}</p>}
                    {message && <p className="text-green-500 text-sm my-2">{message}</p>}

                    <button
                        type="submit"
                        className="w-full bg-indigo-600 hover:bg-indigo-500 py-2 rounded text-white"
                    >
                        Regisztráció
                    </button>

                    <p className="text-gray-400 text-sm text-center mt-6">
                        Van már fiókod?{" "}
                        <a href="/login" className="text-indigo-400 hover:underline">
                            Bejelentkezés
                        </a>
                    </p>
                </form>
            </main>
        </AuthGuard>
    );
}
