import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";



export async function isLoggedIn(): Promise<boolean> {
  // takarítás: töröljük a lejárt sessionöket
  await prisma.session.deleteMany({
    where: { expiresAt: { lt: new Date() } },
  });
  // Cookie-ból vesszük ki a tokent
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) return false;

  const session = await prisma.session.findUnique({
    where: { token },
    select: { expiresAt: true },
  });

  if (!session) return false;

  // Ha lejárt, töröljük és false-t adunk vissza
  if (session.expiresAt < new Date()) {
    await prisma.session.delete({ where: { token } });
    return false;
  }

  return true;
}



export async function getUserFromCookies() {
  // takarítás: töröljük a lejárt sessionöket
  await prisma.session.deleteMany({
    where: { expiresAt: { lt: new Date() } },
  });
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) return null;

  const session = await prisma.session.findUnique({
    where: { token },
    include: { user: true },
  });

  if (!session) return null;

  if (session.expiresAt < new Date()) {
    await prisma.session.delete({ where: { token } });
    return null;
  }

  return session.user;
}