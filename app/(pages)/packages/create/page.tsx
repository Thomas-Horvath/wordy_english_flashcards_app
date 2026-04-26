"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import AlertModal from "@/app/components/AlertModal";

export default function NewPackagePage() {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
   const { loggedIn } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("A csomag neve kötelező.");
      return;
    }

    setError("");
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
        setError(err.error || "Hiba a létrehozás közben");
      }
    } catch {
      setError("Nem sikerült létrehozni a csomagot. Próbáld újra.");
    } finally {
      setLoading(false);
    }
  };


  if (!loggedIn) {
    return (
      <main className="min-h-screen bg-neutral-900">
        <AlertModal
          open
          message="Nem vagy bejelentkezve."
          closeHref="/login"
        />
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
              onChange={(e) => {
                setName(e.target.value);
                if (error) {
                  setError("");
                }
              }}
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

      <AlertModal
        open={Boolean(error)}
        message={error}
        onClose={() => setError("")}
      />
    </main>
  );
}
