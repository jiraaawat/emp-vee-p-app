import type {
  Employee as DbEmployee,
  Attendance as DbAttendance,
  OtRequest as DbOtRequest,
  ExpenseRequest as DbExpenseRequest,
  LeaveRequest as DbLeaveRequest,
} from "./schema";

import type {
  Employee,
  Attendance,
  OtRequest,
  ExpenseRequest,
  LeaveRequest,
} from "@/lib/types";

export function serializeEmployee(row: DbEmployee): Employee {
  return {
    ...row,
    managerId: row.managerId ?? undefined,
    lineUserId: row.lineUserId ?? undefined,
  };
}

export function serializeAttendance(row: DbAttendance): Attendance {
  return {
    ...row,
    clockInAt: row.clockInAt ?? undefined,
    clockOutAt: row.clockOutAt ?? undefined,
    note: row.note ?? undefined,
  };
}

export function serializeOtRequest(row: DbOtRequest): OtRequest {
  return {
    ...row,
    requestedAt: row.requestedAt instanceof Date ? row.requestedAt.toISOString() : row.requestedAt,
  };
}

export function serializeExpenseRequest(row: DbExpenseRequest): ExpenseRequest {
  return {
    ...row,
    amount: Number(row.amount),
    requestedAt: row.requestedAt instanceof Date ? row.requestedAt.toISOString() : row.requestedAt,
  };
}

export function serializeLeaveRequest(row: DbLeaveRequest): LeaveRequest {
  return {
    ...row,
    requestedAt: row.requestedAt instanceof Date ? row.requestedAt.toISOString() : row.requestedAt,
  };
}
