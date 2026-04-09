"use client";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  // A guard a központi auth állapotot figyeli.
  // Itt fontos, hogy csak explicit `false` esetén irányítsunk át,
  // ne minden "falsy" értéknél, mert a `null` csak betöltési állapot.
  const { loggedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loggedIn === false) {
      router.replace("/login");
    }
  }, [loggedIn, router]);

  // Maga a guard nem renderel külön UI-t, csak a redirect viselkedést kezeli.
  return <>{children}</>;
}
