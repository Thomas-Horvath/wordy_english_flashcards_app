import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-neutral-900 px-4 pt-24 text-white">
      <div className="mx-auto flex min-h-[calc(100vh-6rem)] max-w-3xl items-center justify-center">
        <section className="w-full rounded-3xl border border-blue-500/30 bg-neutral-800/80 px-8 py-12 text-center shadow-2xl shadow-black/30">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.35em] text-blue-300">
            404
          </p>
          <h1 className="mb-4 text-4xl font-extrabold sm:text-5xl">
            Ez az oldal nem található
          </h1>
       

          <div className="flex flex-col justify-center gap-3 mt-2 sm:flex-row">
            <Link
              href="/"
              className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-500"
            >
              Vissza a főoldalra
            </Link>
            <Link
              href="/packages"
              className="rounded-lg bg-neutral-700 px-6 py-3 font-medium text-white transition hover:bg-neutral-600"
            >
              Szócsomagok
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
