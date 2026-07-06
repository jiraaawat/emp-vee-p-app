"use client";

import { useLiff } from "../liff-provider";
import { LiffPageLayout } from "../components/liff-page-layout";
import { LiffNotLinked } from "../components/liff-not-linked";
import { LiffLoading } from "../components/liff-loading";
import { StatusBadge } from "@/components/status-badge";
import { useOtRequests } from "@/hooks/use-ot-requests";
import { useExpenseRequests } from "@/hooks/use-expense-requests";
import { useLeaveRequests } from "@/hooks/use-leave-requests";
import { useEmployeeByLineUserId } from "@/hooks/use-employees";
import { BarChart3, FileText, Wallet, Umbrella } from "lucide-react";

const typeMeta = {
  OT: { icon: FileText, color: "text-primary", bg: "bg-primary/10" },
  เบิกเงิน: { icon: Wallet, color: "text-tertiary", bg: "bg-tertiary/10" },
  ลา: { icon: Umbrella, color: "text-secondary", bg: "bg-secondary/10" },
};

export default function LiffStatusPage() {
  const { profile, ready } = useLiff();
  const { data: employee, isLoading: employeeLoading } = useEmployeeByLineUserId(profile?.userId);
  const { data: otRequests = [] } = useOtRequests();
  const { data: expenses = [] } = useExpenseRequests();
  const { data: leaves = [] } = useLeaveRequests();

  if (!ready || !profile?.userId) {
    return <LiffLoading />;
  }

  if (employeeLoading) {
    return <LiffLoading />;
  }

  if (!employee) {
    return <LiffNotLinked />;
  }

  const employeeId = employee.id;

  const allRequests = [
    ...otRequests.filter((r) => r.employeeId === employeeId).map((r) => ({ ...r, type: "OT" as const, label: `OT: ${r.description}` })),
    ...expenses.filter((r) => r.employeeId === employeeId).map((r) => ({ ...r, type: "เบิกเงิน" as const, label: `เบิกเงิน: ${r.description}` })),
    ...leaves.filter((r) => r.employeeId === employeeId).map((r) => ({ ...r, type: "ลา" as const, label: `ลา: ${r.reason}` })),
  ].sort((a, b) => new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime());

  return (
    <LiffPageLayout
      title="สถานะคำขอ"
      subtitle={employee.fullName}
      icon={BarChart3}
      iconColor="text-primary"
      iconBg="bg-primary/10"
    >
      <div className="space-y-3">
        {allRequests.length === 0 ? (
          <p className="text-center text-on-surface-variant py-8">ไม่มีคำขอ</p>
        ) : (
          allRequests.map((req) => {
            const meta = typeMeta[req.type];
            const Icon = meta.icon;
            return (
              <div
                key={req.id}
                className="flex items-center justify-between p-4 rounded-xl bg-surface-container/50 border border-white/5 hover:border-white/10 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`p-2 rounded-lg ${meta.bg}`}>
                    <Icon className={`w-4 h-4 ${meta.color}`} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-on-surface truncate">{req.label}</p>
                    <p className="text-xs text-on-surface-variant">
                      {new Date(req.requestedAt).toLocaleDateString("th-TH")}
                    </p>
                  </div>
                </div>
                <StatusBadge status={req.status} />
              </div>
            );
          })
        )}
      </div>
    </LiffPageLayout>
  );
}
