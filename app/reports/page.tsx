"use client";

import { LayoutWrapper } from "@/components/layout-wrapper";
import { BentoCard } from "@/components/bento-card";
import { useAttendance } from "@/hooks/use-attendance";
import { useOtRequests } from "@/hooks/use-ot-requests";
import { useExpenseRequests } from "@/hooks/use-expense-requests";
import { useLeaveRequests } from "@/hooks/use-leave-requests";
import { useEmployees } from "@/hooks/use-employees";
import { FileText } from "lucide-react";

export default function ReportsPage() {
  const { data: attendance = [] } = useAttendance();
  const { data: otRequests = [] } = useOtRequests();
  const { data: expenses = [] } = useExpenseRequests();
  const { data: leaves = [] } = useLeaveRequests();
  const { data: employees = [] } = useEmployees();

  const employeeMap = new Map(employees.map((e) => [e.id, e.fullName]));

  // Group by employee
  const reportData = employees.map((emp) => {
    const empAttendance = attendance.filter((a) => a.employeeId === emp.id);
    const empOt = otRequests.filter((o) => o.employeeId === emp.id && o.status === "approved");
    const empExpenses = expenses.filter((e) => e.employeeId === emp.id && e.status === "approved");
    const empLeaves = leaves.filter((l) => l.employeeId === emp.id && l.status === "approved");

    const otHours = empOt.reduce((sum, o) => {
      const start = new Date(`2000-01-01T${o.startTime}`);
      const end = new Date(`2000-01-01T${o.endTime}`);
      return sum + (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    }, 0);

    const otFood = empExpenses
      .filter((e) => e.category === "food")
      .reduce((sum, e) => sum + e.amount, 0);
    const travel = empExpenses
      .filter((e) => e.category === "travel")
      .reduce((sum, e) => sum + e.amount, 0);
    const allowance = empExpenses
      .filter((e) => e.category === "allowance")
      .reduce((sum, e) => sum + e.amount, 0);
    const other = empExpenses
      .filter((e) => e.category === "other")
      .reduce((sum, e) => sum + e.amount, 0);

    return {
      ...emp,
      daysPresent: empAttendance.filter((a) => a.status === "present").length,
      daysLeave: empAttendance.filter((a) => a.status === "leave").length,
      otHours: otHours.toFixed(2),
      otFood,
      travel,
      allowance,
      other,
      total: otFood + travel + allowance + other,
      leaveDays: empLeaves.reduce((sum, l) => sum + l.totalDays, 0),
    };
  });

  return (
    <LayoutWrapper>
<BentoCard>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-primary/10">
            <FileText className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-heading text-lg font-semibold text-on-surface">
              Employees Earning Summary Report
            </h3>
            <p className="text-xs text-on-surface-variant">21/Apr/2026 - 20/May/2026</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-lowest border-b border-white/5 text-on-surface-variant text-xs uppercase tracking-wider">
                <th className="p-3 font-medium">รหัส</th>
                <th className="p-3 font-medium">ชื่อ</th>
                <th className="p-3 font-medium text-center">มาทำงาน</th>
                <th className="p-3 font-medium text-center">ลา</th>
                <th className="p-3 font-medium text-right">ชั่วโมง OT</th>
                <th className="p-3 font-medium text-right">OT Food</th>
                <th className="p-3 font-medium text-right">เดินทาง</th>
                <th className="p-3 font-medium text-right">เบี้ยเลี้ยง</th>
                <th className="p-3 font-medium text-right">อื่นๆ</th>
                <th className="p-3 font-medium text-right">รวม</th>
              </tr>
            </thead>
            <tbody>
              {reportData.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-white/5 hover:bg-surface-container/30 transition-colors"
                >
                  <td className="p-3 text-sm font-mono text-on-surface">{row.employeeCode}</td>
                  <td className="p-3 text-sm text-on-surface">{row.fullName}</td>
                  <td className="p-3 text-sm text-center text-on-surface">{row.daysPresent}</td>
                  <td className="p-3 text-sm text-center text-on-surface">{row.daysLeave}</td>
                  <td className="p-3 text-sm text-right font-mono text-on-surface">{row.otHours}</td>
                  <td className="p-3 text-sm text-right font-mono text-secondary">{row.otFood.toFixed(2)}</td>
                  <td className="p-3 text-sm text-right font-mono text-on-surface">{row.travel.toFixed(2)}</td>
                  <td className="p-3 text-sm text-right font-mono text-on-surface">{row.allowance.toFixed(2)}</td>
                  <td className="p-3 text-sm text-right font-mono text-on-surface">{row.other.toFixed(2)}</td>
                  <td className="p-3 text-sm text-right font-mono font-bold text-primary">{row.total.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex justify-end">
          <button className="px-4 py-2 rounded-lg bg-secondary/10 text-secondary border border-secondary/20 text-sm font-medium hover:bg-secondary/20 transition-colors">
            Export Excel
          </button>
        </div>
      </BentoCard>
    </LayoutWrapper>
  );
}
