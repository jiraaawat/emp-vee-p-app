const LINE_API_BASE = "https://api.line.me/v2/bot";
const LINE_DATA_API_BASE = "https://api-data.line.me/v2/bot";

function getToken(): string | null {
  const token = process.env.LINE_CHANNEL_ACCESS_TOKEN;
  if (!token || token === "dummy_token") return null;
  return token;
}

async function lineFetch(
  path: string,
  options: {
    method?: "GET" | "POST" | "DELETE";
    body?: any;
    contentType?: string;
    baseUrl?: string;
  } = {}
) {
  const token = getToken();
  if (!token) {
    console.log("[LINE MOCK]", options.method || "POST", path, options.body);
    return { success: true, mock: true };
  }

  const baseUrl = options.baseUrl || LINE_API_BASE;
  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`,
  };

  if (options.contentType) {
    headers["Content-Type"] = options.contentType;
  } else if (options.body) {
    headers["Content-Type"] = "application/json";
  }

  const body =
    options.contentType === "image/png" && options.body instanceof ArrayBuffer
      ? options.body
      : options.body
      ? JSON.stringify(options.body)
      : undefined;

  const res = await fetch(`${baseUrl}${path}`, {
    method: options.method || "POST",
    headers,
    body,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "Unknown error");
    throw new Error(`LINE API ${res.status}: ${text}`);
  }

  if (res.status === 204) return undefined;
  const contentLength = res.headers.get("content-length");
  if (contentLength === "0") return undefined;
  return res.json();
}

export async function pushMessage(to: string, message: any) {
  return lineFetch("/message/push", {
    body: { to, messages: [message] },
  });
}

export async function replyMessage(replyToken: string, message: any) {
  return lineFetch("/message/reply", {
    body: { replyToken, messages: [message] },
  });
}

export async function createRichMenu(richMenuObject: any): Promise<{ richMenuId: string }> {
  return lineFetch("/richmenu", { body: richMenuObject }) as Promise<{ richMenuId: string }>;
}

export async function setRichMenuImage(richMenuId: string, imageBuffer: ArrayBuffer) {
  return lineFetch(`/richmenu/${richMenuId}/content`, {
    baseUrl: LINE_DATA_API_BASE,
    contentType: "image/png",
    body: imageBuffer,
  });
}

export async function setDefaultRichMenu(richMenuId: string) {
  return lineFetch(`/user/all/richmenu/${richMenuId}`, { method: "POST" });
}

export async function cancelDefaultRichMenu() {
  return lineFetch("/user/all/richmenu", { method: "DELETE" });
}

export async function deleteRichMenu(richMenuId: string) {
  return lineFetch(`/richmenu/${richMenuId}`, { method: "DELETE" });
}

export function createLiffUrl(path: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://your-domain.com";
  return `${baseUrl}${path}`;
}

export async function validateLineSignature(
  body: string,
  signature: string,
  secret: string
): Promise<boolean> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(body));
  const bytes = new Uint8Array(sig);
  const expected = btoa(String.fromCharCode(...bytes));
  return signature === expected;
}
