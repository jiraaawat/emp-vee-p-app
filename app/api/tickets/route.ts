import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { tickets } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { verifyAuth } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { lineUserId, lineDisplayName, correctEmployeeCode, correctFullName, reason, note } = body;

    if (!lineUserId) {
      return NextResponse.json({ error: "lineUserId is required" }, { status: 400 });
    }

    const [ticket] = await db
      .insert(tickets)
      .values({
        lineUserId,
        lineDisplayName: lineDisplayName || null,
        correctEmployeeCode: correctEmployeeCode || null,
        correctFullName: correctFullName || null,
        reason: reason || null,
        note: note || null,
      })
      .returning();

    return NextResponse.json({ success: true, ticket }, { status: 201 });
  } catch (error) {
    console.error("POST /api/tickets error:", error);
    return NextResponse.json({ error: "Failed to create ticket" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const auth = await verifyAuth();
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const rows = await db.select().from(tickets).orderBy(desc(tickets.createdAt));
    return NextResponse.json({ tickets: rows });
  } catch (error) {
    console.error("GET /api/tickets error:", error);
    return NextResponse.json({ error: "Failed to fetch tickets" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const auth = await verifyAuth();
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, status } = await request.json();
    if (!id || !status) {
      return NextResponse.json({ error: "id and status are required" }, { status: 400 });
    }

    const [updated] = await db
      .update(tickets)
      .set({ status })
      .where(eq(tickets.id, id))
      .returning();

    if (!updated) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, ticket: updated });
  } catch (error) {
    console.error("PATCH /api/tickets error:", error);
    return NextResponse.json({ error: "Failed to update ticket" }, { status: 500 });
  }
}
