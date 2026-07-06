"use client";

import { createColumnHelper } from "@tanstack/react-table";
import { LayoutWrapper } from "@/components/layout-wrapper";
import { BentoCard } from "@/components/bento-card";
import { DataTable } from "@/components/tables/data-table";
import { StatusBadge } from "@/components/status-badge";
import { useEmployees } from "@/hooks/use-employees";
import { Employee } from "@/lib/types";

const columnHelper = createColumnHelper<Employee>();

const columns = [
  columnHelper.accessor("employeeCode", {
    header: "รหัสพนักงาน",
    cell: (info) => <span className="font-mono text-sm">{info.getValue()}</span>,
  }),
  columnHelper.accessor("fullName", {
    header: "ชื่อ-สกุล",
  }),
  columnHelper.accessor("department", {
    header: "แผนก",
  }),
  columnHelper.accessor("project", {
    header: "โครงการ",
  }),
  columnHelper.accessor("workStartTime", {
    header: "เวลาทำงาน",
    cell: (info) => {
      const row = info.row.original;
      return (
        <span className="font-mono text-sm text-on-surface-variant">
          {row.workStartTime} - {row.workEndTime}
        </span>
      );
    },
  }),
  columnHelper.accessor("status", {
    header: "สถานะ",
    cell: (info) => <StatusBadge status={info.getValue()} />,
  }),
];

export default function EmployeesPage() {
  const { data: employees = [], isLoading } = useEmployees();

  return (
    <LayoutWrapper>
<BentoCard>
        {isLoading ? (
          <div className="h-32 flex items-center justify-center text-on-surface-variant">
            กำลังโหลด...
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={employees}
            searchColumn="fullName"
            searchPlaceholder="ค้นหาพนักงาน..."
          />
        )}
      </BentoCard>
    </LayoutWrapper>
  );
}
