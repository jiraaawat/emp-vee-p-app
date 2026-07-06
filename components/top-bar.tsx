"use client";

import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ShieldCheck, LogOut, UserCircle, Loader2 } from "lucide-react";

const pageTitles: Record<string, string> = {
  "/": "ภาพรวม",
  "/employees": "จัดการพนักงาน",
  "/attendance": "เข้า-ออกงาน",
  "/requests": "ส่งคำขอ",
  "/approvals": "อนุมัติคำขอ",
  "/reports": "รายงานสรุป",
};

export function TopBar() {
  const pathname = usePathname();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  const title = pageTitles[pathname] || "EmpVee HR";

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.replace("/login");
      router.refresh();
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <header className="hidden md:flex items-center justify-between h-16 px-6 mb-8">
      <div>
        <div className="flex items-center gap-2 text-xs font-medium text-on-surface-variant uppercase tracking-wider mb-1">
          <ShieldCheck className="w-3.5 h-3.5 text-secondary" />
          <span>HR Admin Portal</span>
        </div>
        <h1 className="font-heading text-2xl font-bold text-on-surface">{title}</h1>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-surface-container border border-white/5">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary-container flex items-center justify-center">
            <UserCircle className="w-4 h-4 text-on-primary" />
          </div>
          <div className="text-sm">
            <p className="font-medium text-on-surface">HR Admin</p>
            <p className="text-xs text-on-surface-variant">Demo User</p>
          </div>
        </div>

        <Button
          variant="outline"
          size="icon"
          onClick={handleLogout}
          disabled={loggingOut}
          className="border-border text-on-surface-variant hover:text-error hover:border-error/30 hover:bg-error/5"
        >
          {loggingOut ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogOut className="w-4 h-4" />}
        </Button>
      </div>
    </header>
  );
}
