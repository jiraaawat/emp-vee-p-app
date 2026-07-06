"use client";

import Link from "next/link";
import { useLiff } from "./liff-provider";
import { BentoCard } from "@/components/bento-card";
import { Clock, FileText, Wallet, Umbrella, BarChart3, UserCircle, MessageSquare } from "lucide-react";
import { LiffLoading } from "./components/liff-loading";

const menuItems = [
  { href: "/liff/clock", label: "เข้า-ออกงาน", icon: Clock, color: "text-secondary", bg: "bg-secondary/10", border: "border-secondary/20" },
  { href: "/liff/ot", label: "ขอ OT", icon: FileText, color: "text-primary", bg: "bg-primary/10", border: "border-primary/20" },
  { href: "/liff/expense", label: "เบิกเงิน", icon: Wallet, color: "text-tertiary", bg: "bg-tertiary/10", border: "border-tertiary/20" },
  { href: "/liff/leave", label: "แจ้งลา", icon: Umbrella, color: "text-secondary", bg: "bg-secondary/10", border: "border-secondary/20" },
  { href: "/liff/status", label: "สถานะคำขอ", icon: BarChart3, color: "text-primary", bg: "bg-primary/10", border: "border-primary/20" },
  { href: "/liff/ticket", label: "แจ้งปัญหา", icon: MessageSquare, color: "text-tertiary", bg: "bg-tertiary/10", border: "border-tertiary/20" },
  { href: "/liff/link", label: "ผูกบัญชี", icon: UserCircle, color: "text-on-surface-variant", bg: "bg-surface-container", border: "border-white/10" },
];

export default function LiffMenuPage() {
  const { profile, ready, error } = useLiff();

  if (!ready) {
    return <LiffLoading />;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-md mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary-container flex items-center justify-center">
              <span className="text-on-primary font-heading font-bold text-sm">E</span>
            </div>
            <span className="font-heading font-semibold text-on-surface">EmpVee</span>
          </div>
          {profile ? (
            <div className="flex items-center gap-2 text-xs text-on-surface-variant">
              <UserCircle className="w-4 h-4" />
              <span className="max-w-[100px] truncate">{profile.displayName}</span>
            </div>
          ) : (
            <span className="text-xs text-error">{error || "ไม่พบโปรไฟล์"}</span>
          )}
        </div>
      </header>

      <main className="px-4 py-5 pb-10 max-w-md mx-auto space-y-5">
        <BentoCard glass>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-surface-container flex items-center justify-center shrink-0">
              <UserCircle className="w-7 h-7 text-primary" />
            </div>
            <div>
              <p className="text-sm text-on-surface-variant">สวัสดี</p>
              <h1 className="font-heading text-xl font-semibold text-on-surface">
                {profile?.displayName || "ผู้ใช้งาน"}
              </h1>
            </div>
          </div>
        </BentoCard>

        <div>
          <h2 className="text-sm font-medium text-on-surface-variant mb-3">เมนูหลัก</h2>
          <div className="grid grid-cols-2 gap-3">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`bento-card p-5 flex flex-col items-center justify-center gap-3 neon-border-hover group`}
              >
                <div className={`p-2.5 rounded-xl ${item.bg} border ${item.border}`}>
                  <item.icon className={`w-6 h-6 ${item.color}`} />
                </div>
                <span className="text-sm font-medium text-on-surface text-center">{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
