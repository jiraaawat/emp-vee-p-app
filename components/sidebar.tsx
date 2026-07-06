"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  Users,
  Clock,
  FileText,
  CheckSquare,
  BarChart3,
  LogOut,
  Briefcase,
} from "lucide-react";

const navItems = [
  { href: "/", label: "ภาพรวม", icon: LayoutDashboard },
  { href: "/employees", label: "พนักงาน", icon: Users },
  { href: "/attendance", label: "เข้า-ออกงาน", icon: Clock },
  { href: "/requests", label: "ส่งคำขอ", icon: FileText },
  { href: "/approvals", label: "อนุมัติ", icon: CheckSquare },
  { href: "/reports", label: "รายงาน", icon: BarChart3 },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

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
    <aside className="hidden md:flex flex-col h-full fixed left-0 top-0 w-64 z-50 bg-sidebar/95 backdrop-blur-2xl border-r border-white/5 shadow-2xl shadow-black/50">
      <div className="px-5 py-6 mb-4 flex items-center gap-3">
        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-secondary to-secondary-container flex items-center justify-center shadow-[0_0_20px_rgba(76,215,246,0.25)]">
          <Briefcase className="w-5 h-5 text-on-secondary" />
        </div>
        <div>
          <h1 className="font-heading text-lg font-bold text-on-surface leading-tight">
            EmpVee
          </h1>
          <p className="text-[10px] text-on-surface-variant font-medium tracking-wide uppercase">
            HR Workflow
          </p>
        </div>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex items-center gap-3 py-2.5 px-4 text-sm font-medium rounded-xl transition-all group relative
                ${
                  isActive
                    ? "bg-gradient-to-r from-secondary/15 to-transparent text-secondary border border-secondary/20 shadow-[0_0_15px_rgba(76,215,246,0.1)]"
                    : "text-on-surface-variant hover:bg-surface-container-high/50 hover:text-on-surface"
                }
              `}
            >
              <item.icon className={`w-[18px] h-[18px] ${isActive ? "text-secondary" : "group-hover:text-on-surface"}`} />
              <span>{item.label}</span>
              {isActive && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full bg-secondary" />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-white/5">
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="flex items-center gap-3 w-full py-2.5 px-4 text-sm font-medium text-on-surface-variant hover:text-error hover:bg-error/5 rounded-xl transition-all"
        >
          {loggingOut ? (
            <span className="w-[18px] h-[18px] border-2 border-current border-t-transparent rounded-full animate-spin" />
          ) : (
            <LogOut className="w-[18px] h-[18px]" />
          )}
          <span>ออกจากระบบ</span>
        </button>
      </div>
    </aside>
  );
}
