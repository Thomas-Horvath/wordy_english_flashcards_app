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
       
          <button
            onClick={signOut}
            className="w-fit px-4 py-2 bg-red-600 rounded hover:bg-red-500 cursor-pointer"
          >
            Kijelentkezés
          </button>
     
  );
}
