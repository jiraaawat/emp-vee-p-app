import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { attendance } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { serializeAttendance } from "@/lib/db/serializers";

export async function GET(request: NextRequest) {
  try {
    const employeeId = request.nextUrl.searchParams.get("employeeId");

    const rows = employeeId
      ? await db.select().from(attendance).where(eq(attendance.employeeId, employeeId))
      : await db.select().from(attendance);

    return NextResponse.json(rows.map(serializeAttendance));
  } catch (error) {
    console.error("GET /api/attendance error:", error);
    return NextResponse.json({ error: "Failed to fetch attendance" }, { status: 500 });
  }
}
