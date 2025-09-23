// app/profil/ProfilClient.tsx (CLIENT COMPONENT)
"use client";

import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";

export default function SignOutButton() {
  const router = useRouter();
   const { setLoggedIn } = useAuth();

  const signOut = async () => {
    await fetch("/api/logout", { method: "POST", credentials: "include" });
    setLoggedIn(false);
    router.push("/");
  };

  return (
        <section className="bg-neutral-800 p-6 rounded-xl shadow mb-8">
          <h2 className="text-2xl font-semibold mb-4">Fiókkezelés</h2>
          <button
            onClick={signOut}
            className="px-4 py-2 bg-red-600 rounded hover:bg-red-500 cursor-pointer"
          >
            Kijelentkezés
          </button>
        </section>
  );
}
