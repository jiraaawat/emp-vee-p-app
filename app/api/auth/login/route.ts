import { NextRequest, NextResponse } from "next/server";
import { SignJWT } from "jose";
import { cookies } from "next/headers";
import { getAuthSecret, getAuthCookieName, getSessionCookieName } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    const demoUser = process.env.HR_DEMO_USERNAME || "hradmin";
    const demoPass = process.env.HR_DEMO_PASSWORD || "empvee2026";

    if (username !== demoUser || password !== demoPass) {
      return NextResponse.json({ error: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง" }, { status: 401 });
    }

    const token = await new SignJWT({ username, role: "hr" })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("8h")
      .sign(getAuthSecret());

    const cookieStore = await cookies();
    const isProd = process.env.NODE_ENV === "production";

    cookieStore.set(getAuthCookieName(), token, {
      httpOnly: true,
      secure: isProd,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 8,
    });

    cookieStore.set(getSessionCookieName(), "1", {
      httpOnly: false,
      secure: isProd,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 8,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "เข้าสู่ระบบล้มเหลว" }, { status: 500 });
  }
}
