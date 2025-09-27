import { getUserFromCookies } from "@/lib/auth";
import Link from "next/link";
import BackupButton from "../../components/BackUpButton";
import SignOutButton from "./SignOutButton";
import AuthGuard from "@/app/components/AuthGuard";

export default async function ProfilPage() {
  const user = await getUserFromCookies();

  if (!user) {
    return (

      <main className="flex items-center justify-center min-h-screen">
        <p>
          Nem vagy bejelentkezve.{" "}
          <Link href="/login" className="text-blue-500">Bejelentkezés</Link>
        </p>
      </main>
    )
  }



  return (
    <AuthGuard>
      <main className="min-h-screen py-24 px-2">
        <div className="max-w-[1200px] mx-auto bg-neutral-900 text-white px-4 py-10 rounded-xl shadow-lg">
          <h1 className="text-4xl font-bold mb-8 text-center">⚙️ Beállítások</h1>

          {/* Felhasználói adatok */}
          <section className="mb-8 bg-neutral-800 p-6 rounded-xl shadow">
            <h2 className="text-2xl font-semibold mb-4">Felhasználói fiók</h2>
            <p><span className="font-semibold">Név:</span> {user.name}</p>
            <p><span className="font-semibold">Email:</span> {user.email}</p>
            <p><span className="font-semibold">Regisztráció:</span> {new Date(user.createdAt).toLocaleDateString("hu-HU")}</p>

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



          {/* Fiókkezelés */}
          <section className="bg-neutral-800 p-6 rounded-xl shadow mb-8">
            <h2 className="text-2xl font-semibold mb-4">Fiókkezelés</h2>
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <SignOutButton />
              <Link href={"/newpassword"} className="inline-block w-fit cursor-pointer  px-4 py-2 bg-indigo-600 rounded hover:bg-indigo-500">
                Jelszó módosítása
              </Link>
            </div>
          </section>


          {/* Backup */}
          <section className="bg-neutral-800 p-6 rounded-xl shadow ">
            <h2 className="text-2xl font-semibold mb-4">Adatkezelés</h2>
            <BackupButton />
          </section>
        </div>
      </main>

    </AuthGuard>
  );
}
