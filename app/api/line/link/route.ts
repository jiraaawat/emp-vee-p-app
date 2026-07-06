import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { employees } from "@/lib/db/schema";
import { eq, and, ne } from "drizzle-orm";
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

    // Check if this LINE account is already linked to a different employee.
    const existing = await db.query.employees.findFirst({
      where: eq(employees.lineUserId, lineUserId),
    });

    if (existing && existing.id !== employeeId) {
      return NextResponse.json(
        { error: "บัญชี LINE นี้ผูกกับพนักงานคนอื่นแล้ว" },
        { status: 409 }
      );
    }

    const [updated] = await db
      .update(employees)
      .set({ lineUserId })
      .where(eq(employees.id, employeeId))
      .returning();

    if (!updated) {
      return NextResponse.json({ error: "ไม่พบพนักงาน" }, { status: 404 });
    }

    return NextResponse.json({ success: true, employee: serializeEmployee(updated) });
  } catch (error: any) {
    console.error("Link error:", error);
    const message = error?.message || "Failed to link account";
    // Surface common DB errors without leaking internals.
    if (message.includes("unique")) {
      return NextResponse.json(
        { error: "บัญชี LINE นี้ถูกใช้งานแล้ว" },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
