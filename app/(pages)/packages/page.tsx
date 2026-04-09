
"use client";
import Spinner from "@/app/components/Spinner";
import { useAuth } from "@/app/context/AuthContext";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaPlay, FaEdit, FaTrash } from "react-icons/fa";
import ConfirmModal from "./ConfirmModal";


type Pack = {
  id: number;
  name: string;
  _count: { cards: number };
};

export default function PackagesPage() {
  const [packs, setPacks] = useState<Pack[]>([]);
  const [loading, setLoading] = useState(true);
  const { loggedIn } = useAuth();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);



  useEffect(() => {
    (async () => {
      if (!loggedIn) {
        setLoading(false);
        return;
      }
      const res = await fetch("/api/groups", { credentials: "include" });

      if (res.ok) {
        const data = await res.json();
        setPacks(data);
      }
      setLoading(false);
    })();
  }, [loggedIn]);



  const requestDelete = (id: number) => {
    setDeleteId(id);
    setConfirmOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    const res = await fetch(`/api/groups/${deleteId}`, { method: "DELETE" });
    if (res.ok) {
      setPacks((prev) => prev.filter((p) => p.id !== deleteId));
    } else {
      alert("Hiba történt a törlés során");
    }
    setConfirmOpen(false);
    setDeleteId(null);
  };

  if (loggedIn === null || loading) return <Spinner />;

  if (!loggedIn) {
    // ha nincs user, átirányítjuk loginra
    return (
      <main className="flex items-center justify-center min-h-screen">
        <p>Nem vagy bejelentkezve. <Link href="/login" className="text-blue-500">Bejelentkezés</Link></p>
      </main>
    );
  }

  return (
    <main className="pt-24 mx-auto max-w-3xl p-6">
      <h1 className="mb-14 text-3xl sm:text-5xl font-bold">📚 Szócsomagjaid</h1>


      {packs.length === 0 && (
        <div className="text-center text-neutral-400">
          Még nincs szócsomagod. Kattints az alábbi gombra egy új létrehozásához!
        </div>
      )}

      <ul className="space-y-3">
        {packs.map((p) => (
          <li
            key={p.id}
            className="flex flex-col sm:flex-row gap-6 items-center justify-between rounded-xl border border-neutral-600 bg-neutral-900 px-4 py-3 hover:bg-neutral-800"
          >
            <div className="flex flex-col justify-center items-center sm:items-start">
              <span className="text-md font-bold tracking-wider text-blue-500">
                {p.name}
              </span>
              <span className="ms-1 text-sm text-neutral-400">
                {p._count.cards} szó
              </span>
            </div>

            <div className="flex gap-3">
              <Link
                href={`/cards/${p.id}`}
                className="rounded-lg bg-blue-600 px-4 py-2 text-white text-sm font-medium hover:bg-blue-500 transition"
              >
                <FaPlay />
              </Link>

              <Link
                href={`/packages/edit/${p.id}`}
                className="rounded-lg border border-neutral-500 px-4 py-2 text-sm text-neutral-300 hover:bg-green-600 hover:text-white transition"
              >
                <FaEdit />
              </Link>

              <button
                onClick={() => requestDelete(p.id)}
                className="rounded-lg border border-red-500 px-4 py-2 text-sm text-red-400 hover:bg-red-600 hover:text-white transition cursor-pointer"
              >
                <FaTrash />
              </button>
            </div>
          </li>
        ))}
      </ul>

      <div className="flex justify-center">
        <Link
          href="/packages/create"
          className="mt-10 inline-block rounded-lg bg-green-600 px-6 py-3 text-white font-medium hover:bg-green-500 transition"
        >
          + Új szócsomag
        </Link>
      </div>


      {confirmOpen && (
        <ConfirmModal
          message="Biztosan törölni szeretnéd ezt a szócsomagot?"
          onCancel={() => setConfirmOpen(false)}
          onConfirm={handleDelete}
        />
      )
      }
    </main>
  );
}

