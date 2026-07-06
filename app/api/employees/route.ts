import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { employees } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { serializeEmployee } from "@/lib/db/serializers";

export async function GET(request: NextRequest) {
  try {
    const lineUserId = request.nextUrl.searchParams.get("lineUserId");

    if (lineUserId) {
      const employee = await db.query.employees.findFirst({
        where: eq(employees.lineUserId, lineUserId),
      });
      return NextResponse.json({ employee: employee ? serializeEmployee(employee) : null });
    }

    const rows = await db.select().from(employees);
    return NextResponse.json(rows.map(serializeEmployee));
  } catch (error) {
    console.error("GET /api/employees error:", error);
    return NextResponse.json({ error: "Failed to fetch employees" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const [row] = await db.insert(employees).values(body).returning();
    return NextResponse.json(serializeEmployee(row), { status: 201 });
  } catch (error) {
    console.error("POST /api/employees error:", error);
    return NextResponse.json({ error: "Failed to create employee" }, { status: 500 });
  }
}
