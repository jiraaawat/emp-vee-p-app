import { NextRequest, NextResponse } from "next/server";
import { replyMessage, createLiffUrl, validateLineSignature } from "@/lib/line";
import { db } from "@/lib/db";
import { employees } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get("x-line-signature") || "";
    const secret = process.env.LINE_CHANNEL_SECRET || "";

    if (!secret) {
      return NextResponse.json({ error: "LINE_CHANNEL_SECRET not set" }, { status: 500 });
    }

    const valid = await validateLineSignature(body, signature, secret);
    if (!valid) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const events = JSON.parse(body).events || [];

    for (const event of events) {
      try {
        if (event.type === "message" && event.message.type === "text") {
          const userId = event.source.userId;
          const text = event.message.text.trim();
          const replyToken = event.replyToken;

          const employee = await db.query.employees.findFirst({
            where: eq(employees.lineUserId, userId),
          });

          if (text === "เข้างาน" || text === "Clock In") {
            if (!employee) {
              await replyMessage(replyToken, {
                type: "text",
                text: "กรุณาผูกบัญชีก่อนใช้งาน",
              });
              continue;
            }
            await replyMessage(replyToken, {
              type: "text",
              text: `👋 สวัสดี ${employee.fullName}\nกรุณาเปิด LIFF เพื่อบันทึกเวลาเข้างาน`,
            });
          } else if (text === "ออกงาน" || text === "Clock Out") {
            await replyMessage(replyToken, {
              type: "text",
              text: "กรุณาเปิด LIFF เพื่อบันทึกเวลาออกงาน",
            });
          } else if (text === "เมนู" || text === "Menu") {
            await replyMessage(replyToken, {
              type: "flex",
              altText: "เมนูหลัก",
              contents: {
                type: "bubble",
                hero: {
                  type: "box",
                  layout: "vertical",
                  contents: [
                    {
                      type: "text",
                      text: "EmpVee Menu",
                      weight: "bold",
                      size: "xl",
                      color: "#d0bcff",
                    },
                  ],
                  backgroundColor: "#081425",
                  paddingAll: "20px",
                },
                body: {
                  type: "box",
                  layout: "vertical",
                  spacing: "md",
                  contents: [
                    createMenuButton("⏰ เข้า-ออกงาน", createLiffUrl("/liff/clock")),
                    createMenuButton("📝 ขอ OT", createLiffUrl("/liff/ot")),
                    createMenuButton("💰 เบิกเงิน", createLiffUrl("/liff/expense")),
                    createMenuButton("🏖️ แจ้งลา", createLiffUrl("/liff/leave")),
                    createMenuButton("📊 สถานะคำขอ", createLiffUrl("/liff/status")),
                  ],
                },
              },
            });
          } else {
            await replyMessage(replyToken, {
              type: "text",
              text: `พิมพ์ "เมนู" เพื่อเปิดใช้งาน\nหรือเปิด LIFF: ${createLiffUrl("/liff")}`,
            });
          }
        }

        if (event.type === "follow") {
          const replyToken = event.replyToken;
          await replyMessage(replyToken, {
            type: "text",
            text: `ยินดีต้อนรับสู่ EmpVee!\nกรุณาผูกบัญชีพนักงานที่ ${createLiffUrl("/liff/link")}`,
          });
        }
      } catch (eventError) {
        // Log per-event errors but still return 200 to LINE to avoid retries.
        console.error("Webhook event error:", eventError);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

function createMenuButton(label: string, uri: string) {
  return {
    type: "button",
    style: "primary",
    color: "#d0bcff",
    action: {
      type: "uri",
      label,
      uri,
    },
    height: "sm",
  };
}
