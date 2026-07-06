import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getAuthCookieName, getSessionCookieName } from "@/lib/auth";

export async function POST() {
  const cookieStore = await cookies();
  cookieStore.set(getAuthCookieName(), "", { maxAge: 0, path: "/" });
  cookieStore.set(getSessionCookieName(), "", { maxAge: 0, path: "/" });
  return NextResponse.json({ success: true });
}
