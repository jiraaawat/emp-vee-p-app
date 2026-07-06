import { pushMessage } from "./line";

export async function notifyApproval(lineUserId: string, requestType: string, status: string, details: string) {
  if (!lineUserId) return;

  const statusText = status === "approved" ? "อนุมัติแล้ว" : "ถูกปฏิเสธ";
  const emoji = status === "approved" ? "✅" : "❌";

  try {
    await pushMessage(lineUserId, {
      type: "text",
      text: `${emoji} คำขอ${requestType}ของคุณ${statusText}\n\n${details}`,
    });
  } catch (error) {
    console.error("Failed to send approval notification:", error);
  }
}

export async function notifyRequestSubmitted(managerLineUserId: string, requestType: string, employeeName: string) {
  if (!managerLineUserId) return;

  try {
    await pushMessage(managerLineUserId, {
      type: "text",
      text: `📋 ได้รับคำขอ${requestType}จาก ${employeeName}\nกรุณาเข้าไปอนุมัติที่แอป HR`,
    });
  } catch (error) {
    console.error("Failed to send request submitted notification:", error);
  }
}
