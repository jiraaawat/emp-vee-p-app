import { NextRequest, NextResponse } from "next/server";
import { pushMessage } from "@/lib/line";

export async function POST(request: NextRequest) {
  try {
    const { to, message } = await request.json();

    if (!to || !message) {
      return NextResponse.json(
        { error: "to and message are required" },
        { status: 400 }
      );
    }

    const result = await pushMessage(to, message);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Push error:", error);
    return NextResponse.json({ error: "Failed to push message" }, { status: 500 });
  }
}
