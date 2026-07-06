"use client";

import { LayoutWrapper } from "@/components/layout-wrapper";
import { BentoCard } from "@/components/bento-card";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { useOtRequests, useUpdateOtRequest } from "@/hooks/use-ot-requests";
import { useExpenseRequests, useUpdateExpenseRequest } from "@/hooks/use-expense-requests";
import { useLeaveRequests, useUpdateLeaveRequest } from "@/hooks/use-leave-requests";
import { useEmployees } from "@/hooks/use-employees";
import { CheckSquare, Check, X } from "lucide-react";

export default function ApprovalsPage() {
  const { data: otRequests = [] } = useOtRequests();
  const { data: expenseRequests = [] } = useExpenseRequests();
  const { data: leaveRequests = [] } = useLeaveRequests();
  const { data: employees = [] } = useEmployees();

  const employeeMap = new Map(employees.map((e) => [e.id, e.fullName]));

  const pendingOt = otRequests.filter((r) => r.status === "pending");
  const pendingExpenses = expenseRequests.filter((r) => r.status === "pending");
  const pendingLeaves = leaveRequests.filter((r) => r.status === "pending");

  const allPending = [
    ...pendingOt.map((r) => ({ ...r, type: "ot" as const })),
    ...pendingExpenses.map((r) => ({ ...r, type: "expense" as const })),
    ...pendingLeaves.map((r) => ({ ...r, type: "leave" as const })),
  ].sort((a, b) => new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime());

  return (
    <LayoutWrapper>
<div className="grid grid-cols-3 gap-4 mb-6">
        <BentoCard>
          <p className="text-xs text-on-surface-variant uppercase tracking-wider mb-1">OT รออนุมัติ</p>
          <p className="font-heading text-2xl font-bold text-tertiary">{pendingOt.length}</p>
        </BentoCard>
        <BentoCard>
          <p className="text-xs text-on-surface-variant uppercase tracking-wider mb-1">เบิกเงินรออนุมัติ</p>
          <p className="font-heading text-2xl font-bold text-tertiary">{pendingExpenses.length}</p>
        </BentoCard>
        <BentoCard>
          <p className="text-xs text-on-surface-variant uppercase tracking-wider mb-1">ลารออนุมัติ</p>
          <p className="font-heading text-2xl font-bold text-tertiary">{pendingLeaves.length}</p>
        </BentoCard>
      </div>

      <BentoCard>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-secondary/10">
            <CheckSquare className="w-5 h-5 text-secondary" />
          </div>
          <h3 className="font-heading text-lg font-semibold text-on-surface">รายการรออนุมัติ</h3>
        </div>

        <div className="space-y-3">
          {allPending.length === 0 ? (
            <p className="text-on-surface-variant text-sm text-center py-8">ไม่มีคำขอรออนุมัติ</p>
          ) : (
            allPending.map((req) => (
              <ApprovalCard
                key={req.id}
                req={req}
                employeeName={employeeMap.get(req.employeeId) || req.employeeId}
              />
            ))
          )}
        </div>
      </BentoCard>
    </LayoutWrapper>
  );
}

function ApprovalCard({
  req,
  employeeName,
}: {
  req: any;
  employeeName: string;
}) {
  const updateOt = useUpdateOtRequest();
  const updateExpense = useUpdateExpenseRequest();
  const updateLeave = useUpdateLeaveRequest();

  const handleApprove = () => {
    if (req.type === "ot") updateOt.mutate({ id: req.id, status: "approved" });
    else if (req.type === "expense") updateExpense.mutate({ id: req.id, status: "approved" });
    else updateLeave.mutate({ id: req.id, status: "approved" });
  };

  const handleReject = () => {
    if (req.type === "ot") updateOt.mutate({ id: req.id, status: "rejected" });
    else if (req.type === "expense") updateExpense.mutate({ id: req.id, status: "rejected" });
    else updateLeave.mutate({ id: req.id, status: "rejected" });
  };

  const title =
    req.type === "ot"
      ? `ขอ OT: ${req.description}`
      : req.type === "expense"
      ? `เบิกเงิน: ${req.description}`
      : `แจ้งลา: ${req.reason}`;

  const subtitle =
    req.type === "ot"
      ? `${req.otDate} | ${req.startTime}-${req.endTime} | ${req.rateType}x`
      : req.type === "expense"
      ? `${req.expenseDate} | ${req.amount} บาท | ${req.category}`
      : `${req.startDate} ถึง ${req.endDate} | ${req.totalDays} วัน`;

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-lg bg-surface-container/50 border border-white/5">
      <div>
        <p className="text-sm font-medium text-on-surface">{employeeName}</p>
        <p className="text-sm text-on-surface font-medium">{title}</p>
        <p className="text-xs text-on-surface-variant">{subtitle}</p>
      </div>
      <div className="flex items-center gap-2">
        <StatusBadge status={req.status} />
        <Button
          size="sm"
          onClick={handleApprove}
          className="bg-secondary/10 text-secondary border border-secondary/20 hover:bg-secondary/20"
        >
          <Check className="w-4 h-4" />
        </Button>
        <Button
          size="sm"
          onClick={handleReject}
          variant="outline"
          className="border-error/20 text-error hover:bg-error/10"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
