import { prisma } from "@/lib/prisma";

export async function getUserFromRequest(req: Request) {
  const auth = req.headers.get("authorization");
  if (!auth?.startsWith("Bearer ")) return null;
  const token = auth.substring(7);

  const session = await prisma.session.findUnique({
    where: { token },
    include: { user: true },
  });

  if (!session) return null;
  if (session.expiresAt < new Date()) {
    // ha lejárt, töröljük
    await prisma.session.delete({ where: { id: session.id } });
    return null;
  }

  return session.user;
}
