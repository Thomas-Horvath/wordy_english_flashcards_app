"use client";

import AlertModal from "@/app/components/AlertModal";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();
  const { setLoggedIn } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || "Hiba történt");
        return;
      }
      setLoggedIn(true);

      // egyszerűen redirecteljünk
      router.push("/");
    } catch (err) {
      console.error("Login error:", err);
      setMessage("Hálózati hiba");
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-neutral-900 px-2">
      <div className="w-full max-w-md bg-neutral-800 rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center text-white mb-6">
          Bejelentkezés
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm text-gray-300 mb-1">E-mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (message) {
                  setMessage("");
                }
              }}
              required
              className="w-full px-4 py-2 rounded-lg bg-neutral-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="pelda@email.com"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">Jelszó</label>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (message) {
                  setMessage("");
                }
              }}
              required
              className="w-full px-4 py-2 rounded-lg bg-neutral-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="cursor-pointer  px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium"
          >
            Belépés
          </button>
        </form>

        <p className="text-gray-400 text-sm text-center mt-6">
          Nincs még fiókod?{" "}
          <a href="/register" className="text-blue-400 hover:underline">
            Regisztráció
          </a>
        </p>

        <AlertModal
          open={Boolean(message)}
          message={message}
          onClose={() => setMessage("")}
        />
      </div>
    </main>
  );
}
