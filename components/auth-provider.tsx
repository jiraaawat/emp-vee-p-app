"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getCookie } from "@/lib/cookies";
import { Loader2 } from "lucide-react";

const PUBLIC_PATHS = ["/login", "/liff", "/api", "_next", "favicon.ico"];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const isPublic = PUBLIC_PATHS.some(
      (p) => pathname === p || pathname.startsWith(`${p}/`)
    );

    if (isPublic) {
      setReady(true);
      return;
    }

    const session = getCookie("hr-session");
    if (!session) {
      router.replace("/login");
      return;
    }

    setReady(true);
  }, [pathname, router]);

  if (!ready) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3 bg-background text-on-surface-variant">
        <Loader2 className="w-8 h-8 animate-spin text-secondary" />
        <p className="text-sm">กำลังตรวจสอบสิทธิ์...</p>
      </div>
    );
  }

  return <>{children}</>;
}
