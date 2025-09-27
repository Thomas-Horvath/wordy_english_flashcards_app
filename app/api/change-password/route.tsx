import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  const { oldPassword, newPassword } = await req.json();

  // Token kinyerése a cookie-ból
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return NextResponse.json({ error: "Nincs bejelentkezve" }, { status: 401 });
  }

  // Keresd meg a sessiont és a usert
  const session = await prisma.session.findUnique({
    where: { token },
    include: { user: true },
  });

  if (!session || session.expiresAt < new Date()) {
    return NextResponse.json({ error: "Session lejárt vagy nem érvényes" }, { status: 401 });
  }

  const user = session.user;

  // Ellenőrzés: régi jelszó helyes-e
  const valid = await bcrypt.compare(oldPassword, user.password);
  if (!valid) {
    return NextResponse.json({ error: "Hibás régi jelszó" }, { status: 400 });
  }

  // Új jelszó hashelése
  const hashed = await bcrypt.hash(newPassword, 10);

  // Frissítsük a felhasználó jelszavát
  await prisma.user.update({
    where: { id: user.id },
    data: { password: hashed },
  });

  // Biztonsági okból: töröljük az összes korábbi sessiont
  await prisma.session.deleteMany({
    where: { userId: user.id },
  });

  // Töröljük a tokent a böngészőből is
  const res = NextResponse.json({ success: true });
  res.cookies.delete("token");

  return res;
}
