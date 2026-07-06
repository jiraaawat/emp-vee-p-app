"use client";

import { createColumnHelper } from "@tanstack/react-table";
import { LayoutWrapper } from "@/components/layout-wrapper";
import { BentoCard } from "@/components/bento-card";
import { DataTable } from "@/components/tables/data-table";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { useAttendance, useClockIn, useClockOut } from "@/hooks/use-attendance";
import { useEmployees } from "@/hooks/use-employees";
import { Attendance } from "@/lib/types";
import { Clock, LogIn, LogOut } from "lucide-react";

const columnHelper = createColumnHelper<Attendance & { employeeName?: string }>();

const getColumns = (employeeMap: Map<string, string>) => [
  columnHelper.accessor("employeeId", {
    header: "พนักงาน",
    cell: (info) => employeeMap.get(info.getValue()) || info.getValue(),
  }),
  columnHelper.accessor("workDate", {
    header: "วันที่",
    cell: (info) => new Date(info.getValue()).toLocaleDateString("th-TH"),
  }),
  columnHelper.accessor("clockInAt", {
    header: "เข้า",
    cell: (info) => info.getValue() || "-",
  }),
  columnHelper.accessor("clockOutAt", {
    header: "ออก",
    cell: (info) => info.getValue() || "-",
  }),
  columnHelper.accessor("status", {
    header: "สถานะ",
    cell: (info) => <StatusBadge status={info.getValue()} />,
  }),
  columnHelper.accessor("note", {
    header: "หมายเหตุ",
    cell: (info) => info.getValue() || "-",
  }),
];

export default function AttendancePage() {
  const { data: attendance = [], isLoading } = useAttendance();
  const { data: employees = [] } = useEmployees();
  const clockIn = useClockIn();
  const clockOut = useClockOut();

  const employeeMap = new Map(employees.map((e) => [e.id, e.fullName]));
  const columns = getColumns(employeeMap);

  const today = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Bangkok" });
  const todayRecords = attendance.filter((a) => a.workDate === today);
  const presentCount = todayRecords.filter((a) => a.status === "present").length;
  const absentCount = todayRecords.filter((a) => a.status === "absent").length;
  const leaveCount = todayRecords.filter((a) => a.status === "leave").length;

  const tableData = attendance.map((a) => ({ ...a, employeeName: employeeMap.get(a.employeeId) }));

  return (
    <LayoutWrapper>
<div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <BentoCard>
          <p className="text-xs text-on-surface-variant uppercase tracking-wider mb-1">มาทำงาน</p>
          <p className="font-heading text-2xl font-bold text-secondary">{presentCount}</p>
        </BentoCard>
        <BentoCard>
          <p className="text-xs text-on-surface-variant uppercase tracking-wider mb-1">ขาดงาน</p>
          <p className="font-heading text-2xl font-bold text-error">{absentCount}</p>
        </BentoCard>
        <BentoCard>
          <p className="text-xs text-on-surface-variant uppercase tracking-wider mb-1">ลา</p>
          <p className="font-heading text-2xl font-bold text-primary">{leaveCount}</p>
        </BentoCard>
        <BentoCard className="flex flex-col justify-center gap-2">
          <Button
            onClick={() => clockIn.mutate("1")}
            disabled={clockIn.isPending}
            className="w-full bg-gradient-to-b from-primary to-primary-container text-on-primary hover:shadow-[0_0_15px_rgba(208,188,255,0.4)]"
          >
            <LogIn className="w-4 h-4 mr-2" />
            Clock In
          </Button>
          <Button
            onClick={() => clockOut.mutate({ employeeId: "1" })}
            disabled={clockOut.isPending}
            variant="outline"
            className="w-full border-border text-on-surface hover:bg-surface-container-high"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Clock Out
          </Button>
        </BentoCard>
      </div>

      <BentoCard>
        {isLoading ? (
          <div className="h-32 flex items-center justify-center text-on-surface-variant">
            กำลังโหลด...
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={tableData}
            searchColumn="employeeName"
            searchPlaceholder="ค้นหาพนักงาน..."
          />
        )}
      </BentoCard>
    </LayoutWrapper>
  );
}
