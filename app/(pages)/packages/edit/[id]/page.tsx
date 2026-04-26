"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Spinner from "@/app/components/Spinner";
import { useAuth } from "@/app/context/AuthContext";
import AlertModal from "@/app/components/AlertModal";
import { FaTrash } from "react-icons/fa";
import ConfirmModal from "../../ConfirmModal";

type WordPair = { id?: number; en: string; hu: string };

export default function EditPackagePage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { loggedIn } = useAuth();
  const [name, setName] = useState("");
  const [cards, setCards] = useState<WordPair[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [error, setError] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [confirmIndex, setConfirmIndex] = useState<number | null>(null);


  useEffect(() => {
    if (!params.id) return;

    (async () => {
      try {
        const res = await fetch(`/api/groups/${params.id}`);
        const data = await res.json().catch(() => null);

        if (!res.ok) {
          setLoadError(data?.error || "Nem sikerült betölteni a szócsomagot.");
          return;
        }

        setName(data.name);
        setCards(data.cards);
      } catch {
        setLoadError("Nem sikerült betölteni a szócsomagot.");
      } finally {
        setLoading(false);
      }
    })();
  }, [params.id]);



  const handleCardChange = (index: number, field: "en" | "hu", value: string) => {
    const updated = [...cards];
    updated[index] = { ...updated[index], [field]: value };
    setCards(updated);
    if (error) {
      setError("");
    }
  };

  const addCard = () => {
    setCards([...cards, { en: "", hu: "" }]);
    if (error) {
      setError("");
    }
  };



  const deleteCard = async (id?: number, index?: number) => {
    if (id) {
      // adatbázisból törlés
      const res = await fetch(`/api/cards/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setDeleteError(data?.error || "Nem sikerült törölni a szót.");
        return;
      }
    }
    // kliens oldali törlés (újonnan hozzáadott, még nem mentett szó esetén is működik)
    if (index !== undefined) {
      setCards((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    // 🔹 kiszűrjük az üres sorokat
    const filtered = cards.filter(
      (c) => c.en.trim() !== "" && c.hu.trim() !== ""
    );

    try {
      const res = await fetch(`/api/groups/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, cards: filtered }),
      });

      if (res.ok) {
        router.push("/packages");
        return;
      }

      const data = await res.json().catch(() => null);
      setError(data?.error || "Hiba történt mentés közben.");
    } catch {
      setError("Nem sikerült kapcsolódni a szerverhez. Próbáld újra.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Spinner />;
  }




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
    <main className="pt-24 mx-auto max-w-3xl p-6 text-white">
      <h1 className="mb-8 text-3xl font-bold">✏️ Szócsomag szerkesztése</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Csomag neve */}
        <div>
          <label className="block text-sm font-medium mb-2">Csomag neve</label>
          <input
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (error) {
                setError("");
              }
            }}
            className="w-full rounded-lg bg-neutral-800 px-4 py-2"
          />
        </div>

        {/* Szavak */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Szavak</h2>
          {cards.map((c, i) => (
            <div
              key={c.id ?? i}
              className="flex flex-col sm:flex-row gap-2 sm:gap-4 items-stretch sm:items-center"
            >
              <input
                value={c.en}
                onChange={(e) => handleCardChange(i, "en", e.target.value)}
                placeholder="Angol"
                className="flex-1 rounded-lg bg-neutral-800 px-4 py-2"
              />
              <input
                value={c.hu}
                onChange={(e) => handleCardChange(i, "hu", e.target.value)}
                placeholder="Magyar"
                className="flex-1 rounded-lg bg-neutral-800 px-4 py-2"
              />
              <button
                type="button"
                onClick={() => setConfirmIndex(i)}
                className="cursor-pointer flex items-center justify-center rounded-lg border border-red-500 p-2 text-red-400 hover:bg-red-600 hover:text-white transition w-full sm:w-auto mt-2"
                title="Törlés"
              >
                <FaTrash size={16} />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addCard}
            className="mt-2 rounded-lg bg-green-600 px-4 py-2 text-sm hover:bg-green-500 cursor-pointer"
          >
            + Új szó
          </button>
        </div>

        <div className="flex justify-end gap-4">
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-indigo-600 px-6 py-2 font-medium hover:bg-indigo-500 cursor-pointer"
          >
            {saving ? "Mentés..." : "Mentés"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/packages")}
            className="rounded-lg bg-neutral-700 px-6 py-2 font-medium hover:bg-neutral-600 cursor-pointer"
          >
            Mégse
          </button>
        </div>
      </form>




      {confirmIndex !== null && (
        <ConfirmModal
          message="Biztosan törölni szeretnéd ezt a szót?"
          onCancel={() => setConfirmIndex(null)}
          onConfirm={() => {
            deleteCard(cards[confirmIndex].id, confirmIndex);
            setConfirmIndex(null);
          }}
        />
      )}

      <AlertModal
        open={Boolean(error)}
        message={error}
        onClose={() => setError("")}
      />

      <AlertModal
        open={Boolean(loadError)}
        message={loadError}
        closeHref="/packages"
        onClose={() => setLoadError("")}
      />

      <AlertModal
        open={Boolean(deleteError)}
        message={deleteError}
        onClose={() => setDeleteError("")}
      />
    </main>
  );
}
