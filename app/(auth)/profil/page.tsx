import { getUserFromCookies } from "@/lib/auth"; // ezt írtuk meg korábban
import Link from "next/link";
import BackupButton from "../../components/BackUpButton";
import SignOutButton from "./SignOutButton";

export default async function ProfilPage() {
  const user = await getUserFromCookies();

  if (!user) {
    // ha nincs user, átirányítjuk loginra
    return (
      <main className="flex items-center justify-center min-h-screen">
        <p>Nem vagy bejelentkezve. <Link href="/login">Bejelentkezés</Link></p>
      </main>
    );
  }


  return (
    <main className=" min-h-screen py-24 px-2">
      <div className="max-w-[1200px] mx-auto bg-neutral-900 text-white px-4 py-10 rounded-xl shadow-lg">
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
        </section>

        {/* Alapbeállítások */}
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
        <SignOutButton />

        {/* Backup */}
        <section className="bg-neutral-800 p-6 rounded-xl shadow ">
          <h2 className="text-2xl font-semibold mb-4">Adatkezelés</h2>
          <BackupButton />
        </section>
      </div>
    </main>
  );
}
