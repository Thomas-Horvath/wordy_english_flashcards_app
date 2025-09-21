import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";

export async function GET() {
  try {
    // A db fájl helye – figyelj, hogy ugyanaz legyen, mint a schema.prisma-ban!
    const dbPath = path.join(process.cwd(), "prisma", "flashcardsDb.db");
    
    if (!fs.existsSync(dbPath)) {
      return NextResponse.json({ error: "Database file not found" }, { status: 404 });
    }

    // Olvasd be a fájlt
    const fileBuffer = fs.readFileSync(dbPath);

    // Add vissza letöltésre
    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        "Content-Disposition": `attachment; filename="backup-${Date.now()}.db"`,
        "Content-Type": "application/octet-stream",
      },
    });
  } catch (err) {
    console.error("Backup error:", err);
    return NextResponse.json({ error: "Failed to create backup" }, { status: 500 });
  }
}
