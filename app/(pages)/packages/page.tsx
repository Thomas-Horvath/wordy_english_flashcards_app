
// import Link from "next/link";
// import { prisma } from "@/lib/prisma";
// import PackageItem from "./PackageItem";


// export const dynamic = "force-dynamic"; // egyszerűség kedvéért


// export default async function PackagesPage() {
//   const packs = await prisma.wordGroup.findMany({
//     orderBy: { id: "asc" },
//     select: { id: true, name: true, _count: { select: { cards: true } } },
//   });


//   return (
//     <main className="pt-24 mx-auto max-w-3xl p-6 ">

//       <h1 className="mb-14 text-5xl font-bold ">📚 Szócsomagjaid</h1>

//       <ul className="space-y-3">
//         {packs.map((p) => (
//           <PackageItem
//             key={p.id}
//             id={p.id}
//             name={p.name}
//             count={p._count.cards}
//           />
//         ))}
//       </ul>



//       <div className="flex justify-center">
//         <Link
//           href="/packages/create"
//           className="mt-10 inline-block rounded-lg bg-green-600 px-6 py-3 text-white font-medium hover:bg-green-500 transition"
//         >
//           + Új szócsomag
//         </Link>
//       </div>
//     </main >
//   );
// }


"use client";

import Spinner from "@/app/components/Spinner";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaPlay, FaEdit, FaTrash } from "react-icons/fa";

type Pack = {
  id: number;
  name: string;
  _count: { cards: number };
};

export default function PackagesPage() {
  const [packs, setPacks] = useState<Pack[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      const res = await fetch("/api/groups", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        setPacks(data);
      }
      setLoading(false);
    })();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Biztosan törlöd a szócsomagot?")) return;

    const res = await fetch(`/api/groups/${id}`, { method: "DELETE" });
    if (res.ok) {
      setPacks((prev) => prev.filter((p) => p.id !== id));
    } else {
      alert("Hiba történt a törlés során");
    }
  };

  if (loading) return <Spinner />;

  return (
    <main className="pt-24 mx-auto max-w-3xl p-6">
      <h1 className="mb-14 text-3xl sm:text-5xl font-bold">📚 Szócsomagjaid</h1>

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
                className="rounded-lg bg-indigo-600 px-4 py-2 text-white text-sm font-medium hover:bg-indigo-500 transition"
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
                onClick={() => handleDelete(p.id)}
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
    </main>
  );
}

