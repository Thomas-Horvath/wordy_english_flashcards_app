"use client";

import { useState } from "react";

export default function RegisterPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setMessage("A két jelszó nem egyezik");
            return;
        }

        try {
            const res = await fetch("/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                setMessage(data.error || "Hiba történt");
                return;
            }

            setMessage("Sikeres regisztráció! Most már beléphetsz.");
            window.location.href = "/login";
        } catch (err) {
            console.error("Register error:", err);
            setMessage("Hálózati hiba");
        }
    };

    return (
        <main className="flex items-center justify-center min-h-screen bg-neutral-900 px-2">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-md bg-neutral-800 p-8 rounded-xl"
            >
                <h1 className="text-2xl font-bold text-white mb-6 text-center">
                    Regisztráció
                </h1>

                <input
                    type="email"
                    placeholder="E-mail"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full mb-4 px-4 py-2 rounded bg-neutral-700 text-white"
                    required
                />

                <input
                    type="password"
                    placeholder="Jelszó"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full mb-4 px-4 py-2 rounded bg-neutral-700 text-white"
                    required
                />

                <input
                    type="password"
                    placeholder="Jelszó megerősítése"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full mb-6 px-4 py-2 rounded bg-neutral-700 text-white"
                    required
                />
                <p className="text-red-500 text-sm mt-2">{message}</p>
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
    );
}
