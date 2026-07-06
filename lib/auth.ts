import { jwtVerify } from "jose";
import { cookies } from "next/headers";

const COOKIE_NAME = "hr-auth-token";
const SESSION_COOKIE = "hr-session";

export function getAuthSecret() {
  return new TextEncoder().encode(process.env.HR_JWT_SECRET || "empvee-demo-secret-min-32-bytes-long!!");
}

export async function verifyAuth() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return null;
    const { payload } = await jwtVerify(token, getAuthSecret());
    return payload as { username: string; role: string };
  } catch {
    return null;
  }
}

export function getSessionCookieName() {
  return SESSION_COOKIE;
}

export function getAuthCookieName() {
  return COOKIE_NAME;
}
