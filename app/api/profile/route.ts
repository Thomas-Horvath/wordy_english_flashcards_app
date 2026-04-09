import { NextResponse } from "next/server";
import { isLoggedIn } from "@/lib/auth";

export async function GET() {
  // Ez az endpoint szándékosan nagyon egyszerű:
  // csak azt mondja meg a kliensnek, hogy a jelenlegi cookie
  // alapján érvényes-e még a session.
  const loggedIn = await isLoggedIn();

  // A kliens ebből építi fel a központi auth állapotot.
  return NextResponse.json({ loggedIn });
}
