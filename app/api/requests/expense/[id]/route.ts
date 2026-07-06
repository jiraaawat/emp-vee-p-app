import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { expenseRequests, employees } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { serializeExpenseRequest } from "@/lib/db/serializers";
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
      .update(expenseRequests)
      .set({ status })
      .where(eq(expenseRequests.id, id))
      .returning();

    if (!updated) {
      return NextResponse.json({ error: "Expense request not found" }, { status: 404 });
    }

    const employee = await db.query.employees.findFirst({
      where: eq(employees.id, updated.employeeId),
    });

    if (employee?.lineUserId && status !== "pending") {
      await notifyApproval(
        employee.lineUserId,
        "เบิกเงิน",
        status,
        `${updated.description} ${updated.amount} บาท`
      );
    }

    return NextResponse.json(serializeExpenseRequest(updated));
  } catch (error) {
    console.error("PATCH /api/requests/expense/[id] error:", error);
    return NextResponse.json({ error: "Failed to update expense request" }, { status: 500 });
  }
}
