"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import BackupButton from '../../components/BackUpButton';

export default function ProfilPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    (async () => {
      const res = await fetch("/api/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setUser(await res.json());
      } else {
        router.push("/login");
      }
      setLoading(false);
    })();
  }, [router]);

  if (loading) return <p className="text-center">Betöltés...</p>;
  if (!user) return null;

  return (
    <main className="pt-20 min-h-screen bg-neutral-900 text-white px-4 py-10">
      <h1 className="text-4xl font-bold mb-8 text-center">⚙️ Beállítások</h1>

      {/* Felhasználói adatok */}
      <section className="mb-8 bg-neutral-800 p-6 rounded-xl shadow">
        <h2 className="text-2xl font-semibold mb-4">Felhasználói fiók</h2>
        <p><span className="font-semibold">Név:</span> {user.name}</p>
        <p><span className="font-semibold">Email:</span> {user.email}</p>
        <p><span className="font-semibold">Regisztráció:</span> {new Date(user.createdAt).toLocaleDateString("hu-HU")}</p>
        <button className="mt-4 px-4 py-2 bg-indigo-600 rounded hover:bg-indigo-500">
          Jelszó módosítása
        </button>
      </section>

      {/* Szócsomagok */}
      <section className="mb-8 bg-neutral-800 p-6 rounded-xl shadow">
        <h2 className="text-2xl font-semibold mb-4">Szócsomagok</h2>
        <Link
          href="/packages/create"
          className="px-4 py-2 bg-green-600 rounded hover:bg-green-500 inline-block"
        >
          + Új szócsomag
        </Link>
        {/* Itt listáznánk a user csomagjait */}
      </section>

      {/* Beállítások */}
      <section className="mb-8 bg-neutral-800 p-6 rounded-xl shadow">
        <h2 className="text-2xl font-semibold mb-4">Alapbeállítások</h2>
        <div className="flex flex-col gap-3">
          <label>
            <input type="checkbox" /> Véletlensorrend bekapcsolása
          </label>
          <label>
            <input type="radio" name="lang" value="en" defaultChecked /> Angol először
          </label>
          <label>
            <input type="radio" name="lang" value="hu" /> Magyar először
          </label>
        </div>
      </section>

      {/* Fiókkezelés */}
      <section className="bg-neutral-800 p-6 rounded-xl shadow mb-8 ">
        <h2 className="text-2xl font-semibold mb-4">Fiókkezelés</h2>
        <button className="px-4 py-2 bg-red-600 rounded hover:bg-red-500 cursor-pointer">
          Kijelentkezés
        </button>
      </section>


      <section className="bg-neutral-800 p-6 rounded-xl shadow ">
        <h2 className="text-2xl font-semibold mb-4">Fiókkezelés</h2>
       <BackupButton />
      </section>


    </main>
  );
}
