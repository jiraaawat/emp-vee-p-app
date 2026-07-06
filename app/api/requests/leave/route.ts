import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { leaveRequests } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { serializeLeaveRequest } from "@/lib/db/serializers";

export async function GET(request: NextRequest) {
  try {
    const employeeId = request.nextUrl.searchParams.get("employeeId");
    const rows = employeeId
      ? await db.select().from(leaveRequests).where(eq(leaveRequests.employeeId, employeeId))
      : await db.select().from(leaveRequests);
    return NextResponse.json(rows.map(serializeLeaveRequest));
  } catch (error) {
    console.error("GET /api/requests/leave error:", error);
    return NextResponse.json({ error: "Failed to fetch leave requests" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const [row] = await db.insert(leaveRequests).values(body).returning();
    return NextResponse.json(serializeLeaveRequest(row), { status: 201 });
  } catch (error) {
    console.error("POST /api/requests/leave error:", error);
    return NextResponse.json({ error: "Failed to create leave request" }, { status: 500 });
  }
}
