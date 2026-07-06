export type Employee = {
  id: string;
  employeeCode: string;
  fullName: string;
  department: string;
  project: string;
  managerId?: string | null;
  workStartTime: string;
  workEndTime: string;
  status: "active" | "resigned";
  lineUserId?: string | null;
};

export type Attendance = {
  id: string;
  employeeId: string;
  workDate: string;
  clockInAt?: string | null;
  clockOutAt?: string | null;
  status: "present" | "absent" | "late" | "leave";
  note?: string | null;
};

export type OtRequest = {
  id: string;
  employeeId: string;
  otDate: string;
  startTime: string;
  endTime: string;
  rateType: "1.5" | "2" | "3";
  project: string;
  description: string;
  status: "pending" | "approved" | "rejected";
  requestedAt: string;
};

export type ExpenseRequest = {
  id: string;
  employeeId: string;
  expenseDate: string;
  category: "travel" | "food" | "allowance" | "other";
  amount: number;
  description: string;
  project: string;
  status: "pending" | "approved" | "rejected";
  requestedAt: string;
};

export type LeaveRequest = {
  id: string;
  employeeId: string;
  leaveType: "annual" | "sick" | "personal" | "unpaid";
  startDate: string;
  endDate: string;
  totalDays: number;
  reason: string;
  status: "pending" | "approved" | "rejected";
  requestedAt: string;
};
