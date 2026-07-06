export const queryKeys = {
  employees: ["employees"] as const,
  employee: (id: string) => ["employees", id] as const,
  attendance: ["attendance"] as const,
  otRequests: ["otRequests"] as const,
  expenseRequests: ["expenseRequests"] as const,
  leaveRequests: ["leaveRequests"] as const,
};
