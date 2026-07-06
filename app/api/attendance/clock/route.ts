import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { attendance } from "@/lib/db/schema";
import { and, eq } from "drizzle-orm";
import { serializeAttendance } from "@/lib/db/serializers";

export async function POST(request: NextRequest) {
  try {
    const { employeeId, type, note } = await request.json();

    if (!employeeId || (type !== "in" && type !== "out")) {
      return NextResponse.json(
        { error: "employeeId and type ('in' | 'out') are required" },
        { status: 400 }
      );
    }

    const today = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Bangkok" });
    const nowTime = new Date().toTimeString().slice(0, 5);

    let record = await db.query.attendance.findFirst({
      where: and(eq(attendance.employeeId, employeeId), eq(attendance.workDate, today)),
    });

    if (type === "in") {
      if (record) {
        const [updated] = await db
          .update(attendance)
          .set({ clockInAt: nowTime, status: "present" })
          .where(eq(attendance.id, record.id))
          .returning();
        record = updated;
      } else {
        const [created] = await db
          .insert(attendance)
          .values({
            employeeId,
            workDate: today,
            clockInAt: nowTime,
            status: "present",
          })
          .returning();
        record = created;
      }
    } else {
      if (!record) {
        return NextResponse.json(
          { error: "No clock-in record found for today" },
          { status: 400 }
        );
      }
      const [updated] = await db
        .update(attendance)
        .set({ clockOutAt: nowTime, note: note || null })
        .where(eq(attendance.id, record.id))
        .returning();
      record = updated;
    }

    return NextResponse.json(serializeAttendance(record));
  } catch (error) {
    console.error("POST /api/attendance/clock error:", error);
    return NextResponse.json({ error: "Failed to clock in/out" }, { status: 500 });
  }
}
