"use client";

import Link from "next/link";
import { useLiff } from "./liff-provider";
import { Clock, FileText, Wallet, Umbrella, BarChart3, UserCircle } from "lucide-react";

const menuItems = [
  { href: "/liff/clock", label: "เข้า-ออกงาน", icon: Clock, color: "text-secondary" },
  { href: "/liff/ot", label: "ขอ OT", icon: FileText, color: "text-primary" },
  { href: "/liff/expense", label: "เบิกเงิน", icon: Wallet, color: "text-tertiary" },
  { href: "/liff/leave", label: "แจ้งลา", icon: Umbrella, color: "text-secondary" },
  { href: "/liff/status", label: "สถานะคำขอ", icon: BarChart3, color: "text-primary" },
  { href: "/liff/link", label: "ผูกบัญชี", icon: UserCircle, color: "text-on-surface-variant" },
];

export default function LiffMenuPage() {
  const { profile, ready, error } = useLiff();

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center text-on-surface-variant">
        กำลังโหลด...
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="font-heading text-2xl font-bold text-primary mb-2">EmpVee</h1>
          <p className="text-sm text-on-surface-variant">HR Workflow</p>
          {profile && (
            <p className="text-xs text-on-surface-variant mt-2">สวัสดี, {profile.displayName}</p>
          )}
          {error && (
            <p className="text-xs text-error mt-2">{error}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="bento-card p-6 flex flex-col items-center justify-center gap-3 neon-border-hover"
            >
              <item.icon className={`w-8 h-8 ${item.color}`} />
              <span className="text-sm font-medium text-on-surface text-center">{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
