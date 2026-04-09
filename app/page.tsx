

"use client";
import Link from "next/link";
import { useAuth } from "./context/AuthContext";


export default function HomePage() {
  const { loggedIn } = useAuth();


  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-neutral-900 text-white px-4">
      <section className="text-center max-w-2xl">
        <h1 className="text-5xl font-extrabold mb-4">
          Tanulj <span className="text-blue-600">angol</span> szavakat könnyedén
        </h1>
        <p className="text-lg text-neutral-300 mb-8">
          Gyakorolj szókártyákkal – válassz szócsomagot, pörgesd a kártyákat, és teszteld magad!
        </p>

        {!loggedIn ? (
          <div className="flex gap-4 justify-center">
            <Link
              href="/register"
              className="rounded-lg bg-blue-600 px-6 py-3 hover:bg-blue-500"
            >
              Regisztráció
            </Link>
            <Link
              href="/login"
              className="rounded-lg bg-neutral-700 px-6 py-3 hover:bg-neutral-600"
            >
              Bejelentkezés
            </Link>
          </div>
        ) : (
          <Link
            href="/packages"
            className="rounded-lg bg-blue-600 px-6 py-3 hover:bg-blue-500"
          >
            📚 Kezdjük a gyakorlást
          </Link>
        )}
      </section>
    </main>
  );
}

