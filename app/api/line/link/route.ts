import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { employees } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { serializeEmployee } from "@/lib/db/serializers";

export async function POST(request: NextRequest) {
  try {
    const { employeeId, lineUserId } = await request.json();

    if (!employeeId || !lineUserId) {
      return NextResponse.json(
        { error: "employeeId and lineUserId are required" },
        { status: 400 }
      );
    }

    const existing = await db.query.employees.findFirst({
      where: eq(employees.lineUserId, lineUserId),
    });

    if (existing && existing.id !== employeeId) {
      return NextResponse.json(
        { error: "Line account already linked to another employee" },
        { status: 409 }
      );
    }

    const [updated] = await db
      .update(employees)
      .set({ lineUserId })
      .where(eq(employees.id, employeeId))
      .returning();

    if (!updated) {
      return NextResponse.json({ error: "Employee not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, employee: serializeEmployee(updated) });
  } catch (error) {
    console.error("Link error:", error);
    return NextResponse.json({ error: "Failed to link account" }, { status: 500 });
  }
}
