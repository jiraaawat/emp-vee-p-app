"use client";

import { useLiff } from "../liff-provider";
import { StatusBadge } from "@/components/status-badge";
import { useOtRequests } from "@/hooks/use-ot-requests";
import { useExpenseRequests } from "@/hooks/use-expense-requests";
import { useLeaveRequests } from "@/hooks/use-leave-requests";
import { useEmployeeByLineUserId } from "@/hooks/use-employees";
import { BarChart3, UserCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function LiffStatusPage() {
  const { profile, ready } = useLiff();
  const { data: employee } = useEmployeeByLineUserId(profile?.userId);
  const { data: otRequests = [] } = useOtRequests();
  const { data: expenses = [] } = useExpenseRequests();
  const { data: leaves = [] } = useLeaveRequests();

  if (!ready) {
    return <div className="min-h-screen flex items-center justify-center text-on-surface-variant">กำลังโหลด...</div>;
  }

  if (!employee) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center space-y-4">
          <UserCircle className="w-12 h-12 text-on-surface-variant mx-auto" />
          <p className="text-on-surface-variant">บัญชี LINE นี้ยังไม่ได้ผูกกับพนักงาน</p>
          <Link href="/liff/link">
            <Button className="w-full h-12 bg-gradient-to-b from-primary to-primary-container text-on-primary text-lg font-semibold">
              ผูกบัญชีพนักงาน
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const employeeId = employee.id;

  const allRequests = [
    ...otRequests.filter((r) => r.employeeId === employeeId).map((r) => ({ ...r, type: "OT" as const, label: `OT: ${r.description}` })),
    ...expenses.filter((r) => r.employeeId === employeeId).map((r) => ({ ...r, type: "เบิกเงิน" as const, label: `เบิกเงิน: ${r.description}` })),
    ...leaves.filter((r) => r.employeeId === employeeId).map((r) => ({ ...r, type: "ลา" as const, label: `ลา: ${r.reason}` })),
  ].sort((a, b) => new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime());

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-6">
          <BarChart3 className="w-10 h-10 text-primary mx-auto mb-2" />
          <h1 className="font-heading text-2xl font-bold text-primary">สถานะคำขอ</h1>
          <p className="text-sm text-on-surface-variant">{employee.fullName}</p>
        </div>

        <div className="space-y-3">
          {allRequests.length === 0 ? (
            <p className="text-center text-on-surface-variant py-8">ไม่มีคำขอ</p>
          ) : (
            allRequests.map((req) => (
              <div
                key={req.id}
                className="bento-card p-4 flex items-center justify-between"
              >
                <div>
                  <p className="text-sm font-medium text-on-surface">{req.label}</p>
                  <p className="text-xs text-on-surface-variant">
                    {new Date(req.requestedAt).toLocaleDateString("th-TH")}
                  </p>
                </div>
                <StatusBadge status={req.status} />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
