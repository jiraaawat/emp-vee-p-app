import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { leaveRequests, employees } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { serializeLeaveRequest } from "@/lib/db/serializers";
import { notifyApproval } from "@/lib/notifications";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { status } = await request.json();

    if (!status || !["approved", "rejected"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const [updated] = await db
      .update(leaveRequests)
      .set({ status })
      .where(eq(leaveRequests.id, id))
      .returning();

    if (!updated) {
      return NextResponse.json({ error: "Leave request not found" }, { status: 404 });
    }

    const employee = await db.query.employees.findFirst({
      where: eq(employees.id, updated.employeeId),
    });

    if (employee?.lineUserId && status !== "pending") {
      await notifyApproval(
        employee.lineUserId,
        "ลา",
        status,
        `${updated.startDate} ถึง ${updated.endDate}`
      );
    }

    return NextResponse.json(serializeLeaveRequest(updated));
  } catch (error) {
    console.error("PATCH /api/requests/leave/[id] error:", error);
    return NextResponse.json({ error: "Failed to update leave request" }, { status: 500 });
  }
}
