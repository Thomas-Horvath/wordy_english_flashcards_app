"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/app/context/AuthContext";

export default function NewPackagePage() {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
   const { loggedIn } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    try {
      const res = await fetch("/api/groups/new", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      });

      if (res.ok) {
        router.push("/packages"); // siker után vissza a listához
      } else {
        const err = await res.json();
        alert(err.error || "Hiba a létrehozás közben");
      }
    } finally {
      setLoading(false);
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
    <main className="pt-24 px-2  min-h-screen ">
      <div className="max-w-lg mx-auto  p-14 bg-neutral-900 text-white rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold mb-6">➕ Új szócsomag</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-2">Csomag neve</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg px-4 py-2 bg-neutral-800 text-white border border-neutral-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="pl. Állatok"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="cursor-pointer w-full rounded-lg bg-indigo-600 px-4 py-2 font-medium hover:bg-indigo-500 disabled:opacity-50"
          >
            {loading ? "Mentés..." : "Csomag létrehozása"}
          </button>
        </form>
      </div>
    </main>
  );
}
