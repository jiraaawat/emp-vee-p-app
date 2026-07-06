import type {
  Employee,
  Attendance,
  OtRequest,
  ExpenseRequest,
  LeaveRequest,
} from "./types";

async function fetchJson<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options?.headers as Record<string, string>),
  };

  const res = await fetch(path, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "Unknown error");
    throw new Error(`API ${res.status}: ${text}`);
  }

  return res.json() as Promise<T>;
}

// Employees
export async function getEmployees(): Promise<Employee[]> {
  return fetchJson<Employee[]>("/api/employees");
}

export async function getEmployeeById(id: string): Promise<Employee | undefined> {
  return fetchJson<Employee | undefined>(`/api/employees/${id}`);
}

export async function getEmployeeByLineUserId(lineUserId: string): Promise<Employee | undefined> {
  const { employee } = await fetchJson<{ employee?: Employee }>(
    `/api/employees?lineUserId=${encodeURIComponent(lineUserId)}`
  );
  return employee;
}

export async function createEmployee(data: Omit<Employee, "id">): Promise<Employee> {
  return fetchJson<Employee>("/api/employees", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateEmployee(
  id: string,
  data: Partial<Employee>
): Promise<Employee> {
  return fetchJson<Employee>(`/api/employees/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function linkLineAccount(
  employeeId: string,
  lineUserId: string
): Promise<Employee> {
  return fetchJson<Employee>("/api/line/link", {
    method: "POST",
    body: JSON.stringify({ employeeId, lineUserId }),
  });
}

// Attendance
export async function getAttendance(): Promise<Attendance[]> {
  return fetchJson<Attendance[]>("/api/attendance");
}

export async function clockIn(employeeId: string): Promise<Attendance> {
  return fetchJson<Attendance>("/api/attendance/clock", {
    method: "POST",
    body: JSON.stringify({ employeeId, type: "in" }),
  });
}

export async function clockOut(employeeId: string, note?: string): Promise<Attendance> {
  return fetchJson<Attendance>("/api/attendance/clock", {
    method: "POST",
    body: JSON.stringify({ employeeId, type: "out", note }),
  });
}

// OT Requests
export async function getOtRequests(): Promise<OtRequest[]> {
  return fetchJson<OtRequest[]>("/api/requests/ot");
}

export async function createOtRequest(
  data: Omit<OtRequest, "id" | "requestedAt">
): Promise<OtRequest> {
  return fetchJson<OtRequest>("/api/requests/ot", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateOtRequest(
  id: string,
  status: OtRequest["status"]
): Promise<OtRequest> {
  return fetchJson<OtRequest>(`/api/requests/ot/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

// Expense Requests
export async function getExpenseRequests(): Promise<ExpenseRequest[]> {
  return fetchJson<ExpenseRequest[]>("/api/requests/expense");
}

export async function createExpenseRequest(
  data: Omit<ExpenseRequest, "id" | "requestedAt">
): Promise<ExpenseRequest> {
  return fetchJson<ExpenseRequest>("/api/requests/expense", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateExpenseRequest(
  id: string,
  status: ExpenseRequest["status"]
): Promise<ExpenseRequest> {
  return fetchJson<ExpenseRequest>(`/api/requests/expense/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

// Leave Requests
export async function getLeaveRequests(): Promise<LeaveRequest[]> {
  return fetchJson<LeaveRequest[]>("/api/requests/leave");
}

export async function createLeaveRequest(
  data: Omit<LeaveRequest, "id" | "requestedAt">
): Promise<LeaveRequest> {
  return fetchJson<LeaveRequest>("/api/requests/leave", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateLeaveRequest(
  id: string,
  status: LeaveRequest["status"]
): Promise<LeaveRequest> {
  return fetchJson<LeaveRequest>(`/api/requests/leave/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}
