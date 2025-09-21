import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";


export async function POST(req: Request) {
    const { token } = await req.json();
    if (!token) return NextResponse.json({ error: "Missing token" }, { status: 400 });

    await prisma.session.delete({ where: { token } });
    return NextResponse.json({ message: "Logged out successfully" }, { status: 200 });
}


