import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { expenseRequests } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { serializeExpenseRequest } from "@/lib/db/serializers";

export async function GET(request: NextRequest) {
  try {
    const employeeId = request.nextUrl.searchParams.get("employeeId");
    const rows = employeeId
      ? await db.select().from(expenseRequests).where(eq(expenseRequests.employeeId, employeeId))
      : await db.select().from(expenseRequests);
    return NextResponse.json(rows.map(serializeExpenseRequest));
  } catch (error) {
    console.error("GET /api/requests/expense error:", error);
    return NextResponse.json({ error: "Failed to fetch expense requests" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const [row] = await db.insert(expenseRequests).values(body).returning();
    return NextResponse.json(serializeExpenseRequest(row), { status: 201 });
  } catch (error) {
    console.error("POST /api/requests/expense error:", error);
    return NextResponse.json({ error: "Failed to create expense request" }, { status: 500 });
  }
}
