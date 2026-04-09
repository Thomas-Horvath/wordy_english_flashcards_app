import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

export async function isLoggedIn(): Promise<boolean> {
  // Minden auth ellenőrzés elején kitakarítjuk a már lejárt sessionöket,
  // így az adatbázis nem tart meg felesleges rekordokat.
  await prisma.session.deleteMany({
    where: { expiresAt: { lt: new Date() } },
  });

  // A kliensoldali session tokent HTTP-only cookie-ban tároljuk.
  // Innen olvassuk ki a jelenlegi kéréshez tartozó tokent.
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) return false;

  // Megnézzük, létezik-e ehhez a tokenhez tartozó session.
  const session = await prisma.session.findUnique({
    where: { token },
    select: { expiresAt: true },
  });

  if (!session) return false;

  // Ha a session időközben lejárt, azonnal töröljük és hamisat adunk vissza.
  if (session.expiresAt < new Date()) {
    await prisma.session.delete({ where: { token } });
    return false;
  }

  // Csak ebben az ágban tekintjük ténylegesen bejelentkezettnek a felhasználót.
  return true;
}

export async function getUserFromCookies() {
  // Ugyanaz a logika, mint az `isLoggedIn()` esetén,
  // csak itt nem egy boolean eredményre, hanem a teljes user objektumra van szükségünk.
  await prisma.session.deleteMany({
    where: { expiresAt: { lt: new Date() } },
  });

  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) return null;

  // A session mellé a user rekordot is betöltjük,
  // mert ezt a helper jellemzően profilhoz vagy védett adatlekéréshez kell.
  const session = await prisma.session.findUnique({
    where: { token },
    include: { user: true },
  });

  if (!session) return null;

  if (session.expiresAt < new Date()) {
    await prisma.session.delete({ where: { token } });
    return null;
  }

  // Sikeres ellenőrzés esetén visszaadjuk a felhasználót.
  return session.user;
}
