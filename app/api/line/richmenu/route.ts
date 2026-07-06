import { NextRequest, NextResponse } from "next/server";
import {
  createRichMenu,
  setRichMenuImage,
  setDefaultRichMenu,
  cancelDefaultRichMenu,
} from "@/lib/line";

export async function POST(request: NextRequest) {
  try {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || new URL("/", request.url).origin;

    const richMenuObject = {
      size: { width: 2500, height: 843 },
      selected: false,
      name: "EmpVee Menu",
      chatBarText: "EmpVee Menu",
      areas: [
        { bounds: { x: 0, y: 0, width: 500, height: 843 }, action: { type: "uri", uri: `${appUrl}/liff/clock` } },
        { bounds: { x: 500, y: 0, width: 500, height: 843 }, action: { type: "uri", uri: `${appUrl}/liff/ot` } },
        { bounds: { x: 1000, y: 0, width: 500, height: 843 }, action: { type: "uri", uri: `${appUrl}/liff/expense` } },
        { bounds: { x: 1500, y: 0, width: 500, height: 843 }, action: { type: "uri", uri: `${appUrl}/liff/leave` } },
        { bounds: { x: 2000, y: 0, width: 500, height: 843 }, action: { type: "uri", uri: `${appUrl}/liff/status` } },
      ],
    };

    const { richMenuId } = await createRichMenu(richMenuObject);

    const imageUrl = new URL("/richmenu/richmenu.png", request.url);
    const imageRes = await fetch(imageUrl);
    if (!imageRes.ok) {
      throw new Error(`Failed to load rich menu image: ${imageRes.status}`);
    }
    const imageBuffer = await imageRes.arrayBuffer();

    await setRichMenuImage(richMenuId, imageBuffer);
    await setDefaultRichMenu(richMenuId);

    return NextResponse.json({ success: true, richMenuId, url: `${appUrl}/liff` });
  } catch (error) {
    console.error("Rich menu error:", error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    await cancelDefaultRichMenu();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Rich menu delete error:", error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
