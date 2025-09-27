import { NextResponse } from "next/server";
import { isLoggedIn } from "@/lib/auth";

export async function GET() {
  const loggedIn = await isLoggedIn();
  // console.log(loggedIn)
  return NextResponse.json({ loggedIn });
}
