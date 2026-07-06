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
  Menu,
  X,
  LogOut,
  Briefcase,
  MessageSquare,
} from "lucide-react";

const navItems = [
  { href: "/", label: "ภาพรวม", icon: LayoutDashboard },
  { href: "/employees", label: "พนักงาน", icon: Users },
  { href: "/attendance", label: "เข้า-ออก", icon: Clock },
  { href: "/requests", label: "คำขอ", icon: FileText },
  { href: "/approvals", label: "อนุมัติ", icon: CheckSquare },
  { href: "/tickets", label: "แจ้งปัญหา", icon: MessageSquare },
  { href: "/reports", label: "รายงาน", icon: BarChart3 },
];

export function MobileNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
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
    <>
      <nav className="md:hidden flex justify-between items-center px-4 h-16 w-full bg-surface/90 backdrop-blur-xl border-b border-white/5 fixed top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-secondary to-secondary-container flex items-center justify-center">
            <Briefcase className="w-4 h-4 text-on-secondary" />
          </div>
          <span className="font-heading text-lg font-bold text-secondary">EmpVee</span>
        </div>
        <button onClick={() => setOpen(!open)} className="text-on-surface p-2 rounded-lg hover:bg-surface-container">
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </nav>

      {open && (
        <div className="md:hidden fixed inset-0 top-16 z-40 bg-background/98 backdrop-blur-xl">
          <nav className="flex flex-col p-4 space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`
                    flex items-center gap-3 py-3 px-4 text-sm font-medium rounded-xl transition-all
                    ${
                      isActive
                        ? "bg-secondary/10 text-secondary border border-secondary/20"
                        : "text-on-surface-variant hover:bg-surface-container-high/50 hover:text-on-surface"
                    }
                  `}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className="flex items-center gap-3 py-3 px-4 text-sm font-medium text-on-surface-variant hover:text-error hover:bg-error/5 rounded-xl transition-all mt-2"
            >
              <LogOut className="w-5 h-5" />
              <span>ออกจากระบบ</span>
            </button>
          </nav>
        </div>
      )}
    </>
  );
}
