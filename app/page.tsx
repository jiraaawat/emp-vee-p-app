"use client";

import { LayoutWrapper } from "@/components/layout-wrapper";
import { BentoCard } from "@/components/bento-card";
import { StatusBadge } from "@/components/status-badge";
import { useEmployees } from "@/hooks/use-employees";
import { useAttendance } from "@/hooks/use-attendance";
import { useOtRequests } from "@/hooks/use-ot-requests";
import { useExpenseRequests } from "@/hooks/use-expense-requests";
import { useLeaveRequests } from "@/hooks/use-leave-requests";
import { Users, Clock, FileText, CheckSquare, TrendingUp, Activity, Sparkles } from "lucide-react";

export default function DashboardPage() {
  const { data: employees = [] } = useEmployees();
  const { data: attendance = [] } = useAttendance();
  const { data: otRequests = [] } = useOtRequests();
  const { data: expenseRequests = [] } = useExpenseRequests();
  const { data: leaveRequests = [] } = useLeaveRequests();

  const activeEmployees = employees.filter((e) => e.status === "active").length;
  const pendingApprovals =
    otRequests.filter((r) => r.status === "pending").length +
    expenseRequests.filter((r) => r.status === "pending").length +
    leaveRequests.filter((r) => r.status === "pending").length;

  const today = new Date().toISOString().split("T")[0];
  const todayAttendance = attendance.filter((a) => a.workDate === today);
  const presentToday = todayAttendance.filter((a) => a.status === "present").length;

  const recentRequests = [...otRequests, ...expenseRequests, ...leaveRequests]
    .sort((a, b) => new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime())
    .slice(0, 5);

  const stats = [
    {
      label: "พนักงานทั้งหมด",
      value: employees.length,
      sub: `${activeEmployees} active`,
      icon: Users,
      gradient: "from-primary/20 to-primary/5",
      accent: "text-primary",
      border: "border-primary/20",
    },
    {
      label: "คำขอรออนุมัติ",
      value: pendingApprovals,
      sub: "ต้องตรวจสอบ",
      icon: CheckSquare,
      gradient: "from-tertiary/20 to-tertiary/5",
      accent: "text-tertiary",
      border: "border-tertiary/20",
    },
    {
      label: "เข้างานวันนี้",
      value: presentToday,
      sub: today,
      icon: Clock,
      gradient: "from-secondary/20 to-secondary/5",
      accent: "text-secondary",
      border: "border-secondary/20",
    },
    {
      label: "คำขอใหม่ล่าสุด",
      value: recentRequests.length,
      sub: "รายการ",
      icon: Activity,
      gradient: "from-emerald-500/20 to-emerald-500/5",
      accent: "text-emerald-400",
      border: "border-emerald-500/20",
    },
  ];

  return (
    <LayoutWrapper>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 mb-6">
        {stats.map((stat) => (
          <BentoCard key={stat.label} className="relative overflow-hidden group">
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-40 group-hover:opacity-60 transition-opacity`} />
            <div className="relative">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-2 rounded-lg bg-surface-container border ${stat.border}`}>
                  <stat.icon className={`w-5 h-5 ${stat.accent}`} />
                </div>
                <span className={`text-xs font-mono ${stat.accent} flex items-center gap-1`}>
                  <TrendingUp className="w-3 h-3" /> {stat.sub}
                </span>
              </div>
              <p className="text-xs text-on-surface-variant uppercase tracking-wider mb-1">{stat.label}</p>
              <p className="font-heading text-3xl font-bold text-on-surface">{stat.value}</p>
            </div>
          </BentoCard>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-5">
        <BentoCard className="lg:col-span-2">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-secondary/10">
              <Sparkles className="w-5 h-5 text-secondary" />
            </div>
            <div>
              <h3 className="font-heading text-lg font-semibold text-on-surface">กิจกรรมล่าสุด</h3>
              <p className="text-xs text-on-surface-variant">คำขอ OT, เบิกเงิน, ลา ล่าสุด</p>
            </div>
          </div>

          <div className="space-y-3">
            {recentRequests.length === 0 ? (
              <p className="text-on-surface-variant text-sm">ไม่มีกิจกรรมล่าสุด</p>
            ) : (
              recentRequests.map((req) => (
                <div
                  key={req.id}
                  className="flex items-center justify-between p-4 rounded-xl bg-surface-container/50 border border-white/5 hover:border-white/10 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-surface-container-high">
                      <FileText className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-on-surface">
                        {"category" in req
                          ? `เบิกเงิน: ${req.description}`
                          : "leaveType" in req
                          ? `แจ้งลา: ${req.reason}`
                          : `ขอ OT: ${req.description}`}
                      </p>
                      <p className="text-xs text-on-surface-variant">
                        {new Date(req.requestedAt).toLocaleString("th-TH")}
                      </p>
                    </div>
                  </div>
                  <StatusBadge status={req.status} />
                </div>
              ))
            )}
          </div>
        </BentoCard>

        <BentoCard glass>
          <div className="mb-4">
            <h3 className="font-heading text-lg font-semibold text-on-surface">Line OA</h3>
            <p className="text-xs text-on-surface-variant">จัดการ Rich Menu และ Webhook</p>
          </div>
          <div className="space-y-3">
            <button
              onClick={async () => {
                const res = await fetch("/api/line/richmenu", { method: "POST" });
                const data = await res.json();
                alert(data.success ? "สร้าง Rich Menu สำเร็จ" : `Error: ${data.error}`);
              }}
              className="w-full py-2.5 px-3 rounded-xl bg-secondary/10 text-secondary border border-secondary/20 text-sm font-medium hover:bg-secondary/20 transition-colors"
            >
              สร้าง Rich Menu
            </button>
            <button
              onClick={async () => {
                const res = await fetch("/api/line/richmenu", { method: "DELETE" });
                const data = await res.json();
                alert(data.success ? "ลบ Rich Menu สำเร็จ" : `Error: ${data.error}`);
              }}
              className="w-full py-2.5 px-3 rounded-xl bg-error/10 text-error border border-error/20 text-sm font-medium hover:bg-error/20 transition-colors"
            >
              ลบ Rich Menu
            </button>
            <div className="pt-3 border-t border-white/5">
              <p className="text-xs text-on-surface-variant mb-1">Webhook URL:</p>
              <code className="text-[10px] text-primary break-all">
                {typeof window !== "undefined" ? `${window.location.origin}/api/line/webhook` : ""}
              </code>
            </div>
          </div>
        </BentoCard>
      </div>
    </LayoutWrapper>
  );
}
