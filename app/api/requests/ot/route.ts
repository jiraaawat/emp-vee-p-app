import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { otRequests } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { serializeOtRequest } from "@/lib/db/serializers";

export async function GET(request: NextRequest) {
  try {
    const employeeId = request.nextUrl.searchParams.get("employeeId");
    const rows = employeeId
      ? await db.select().from(otRequests).where(eq(otRequests.employeeId, employeeId))
      : await db.select().from(otRequests);
    return NextResponse.json(rows.map(serializeOtRequest));
  } catch (error) {
    console.error("GET /api/requests/ot error:", error);
    return NextResponse.json({ error: "Failed to fetch OT requests" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const [row] = await db.insert(otRequests).values(body).returning();
    return NextResponse.json(serializeOtRequest(row), { status: 201 });
  } catch (error) {
    console.error("POST /api/requests/ot error:", error);
    return NextResponse.json({ error: "Failed to create OT request" }, { status: 500 });
  }
}
