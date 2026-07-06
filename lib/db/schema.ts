import {
  pgTable,
  varchar,
  text,
  timestamp,
  date,
  time,
  integer,
  numeric,
  pgEnum,
  uniqueIndex,
} from "drizzle-orm/pg-core";

export const employeeStatusEnum = pgEnum("employee_status", ["active", "resigned"]);
export const attendanceStatusEnum = pgEnum("attendance_status", ["present", "absent", "late", "leave"]);
export const requestStatusEnum = pgEnum("request_status", ["pending", "approved", "rejected"]);
export const otRateEnum = pgEnum("ot_rate", ["1.5", "2", "3"]);
export const expenseCategoryEnum = pgEnum("expense_category", ["travel", "food", "allowance", "other"]);
export const leaveTypeEnum = pgEnum("leave_type", ["annual", "sick", "personal", "unpaid"]);

export const employees = pgTable(
  "employees",
  {
    id: varchar("id", { length: 36 })
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    employeeCode: varchar("employee_code", { length: 20 }).notNull().unique(),
    fullName: varchar("full_name", { length: 255 }).notNull(),
    department: varchar("department", { length: 100 }).notNull(),
    project: varchar("project", { length: 100 }).notNull(),
    managerId: varchar("manager_id", { length: 36 }),
    workStartTime: varchar("work_start_time", { length: 5 }).notNull(),
    workEndTime: varchar("work_end_time", { length: 5 }).notNull(),
    status: employeeStatusEnum("status").notNull().default("active"),
    lineUserId: varchar("line_user_id", { length: 100 }).unique(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [uniqueIndex("employees_line_user_id_idx").on(table.lineUserId)]
);

export const attendance = pgTable(
  "attendance",
  {
    id: varchar("id", { length: 36 })
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    employeeId: varchar("employee_id", { length: 36 })
      .notNull()
      .references(() => employees.id),
    workDate: date("work_date").notNull(),
    clockInAt: time("clock_in_at"),
    clockOutAt: time("clock_out_at"),
    status: attendanceStatusEnum("status").notNull().default("absent"),
    note: text("note"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [uniqueIndex("attendance_employee_date_idx").on(table.employeeId, table.workDate)]
);

export const otRequests = pgTable("ot_requests", {
  id: varchar("id", { length: 36 })
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  employeeId: varchar("employee_id", { length: 36 })
    .notNull()
    .references(() => employees.id),
  otDate: date("ot_date").notNull(),
  startTime: time("start_time").notNull(),
  endTime: time("end_time").notNull(),
  rateType: otRateEnum("rate_type").notNull(),
  project: varchar("project", { length: 100 }).notNull(),
  description: text("description").notNull(),
  status: requestStatusEnum("status").notNull().default("pending"),
  requestedAt: timestamp("requested_at", { withTimezone: true }).defaultNow().notNull(),
});

export const expenseRequests = pgTable("expense_requests", {
  id: varchar("id", { length: 36 })
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  employeeId: varchar("employee_id", { length: 36 })
    .notNull()
    .references(() => employees.id),
  expenseDate: date("expense_date").notNull(),
  category: expenseCategoryEnum("category").notNull(),
  amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
  description: text("description").notNull(),
  project: varchar("project", { length: 100 }).notNull(),
  status: requestStatusEnum("status").notNull().default("pending"),
  requestedAt: timestamp("requested_at", { withTimezone: true }).defaultNow().notNull(),
});

export const leaveRequests = pgTable("leave_requests", {
  id: varchar("id", { length: 36 })
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  employeeId: varchar("employee_id", { length: 36 })
    .notNull()
    .references(() => employees.id),
  leaveType: leaveTypeEnum("leave_type").notNull(),
  startDate: date("start_date").notNull(),
  endDate: date("end_date").notNull(),
  totalDays: integer("total_days").notNull(),
  reason: text("reason").notNull(),
  status: requestStatusEnum("status").notNull().default("pending"),
  requestedAt: timestamp("requested_at", { withTimezone: true }).defaultNow().notNull(),
});

export const tickets = pgTable("tickets", {
  id: varchar("id", { length: 36 })
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  lineUserId: varchar("line_user_id", { length: 100 }).notNull(),
  lineDisplayName: varchar("line_display_name", { length: 255 }),
  correctEmployeeCode: varchar("correct_employee_code", { length: 20 }),
  correctFullName: varchar("correct_full_name", { length: 255 }),
  reason: varchar("reason", { length: 50 }),
  note: text("note"),
  status: varchar("status", { length: 20 }).notNull().default("open"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export type Employee = typeof employees.$inferSelect;
export type NewEmployee = typeof employees.$inferInsert;
export type Ticket = typeof tickets.$inferSelect;
export type NewTicket = typeof tickets.$inferInsert;
export type Attendance = typeof attendance.$inferSelect;
export type NewAttendance = typeof attendance.$inferInsert;
export type OtRequest = typeof otRequests.$inferSelect;
export type NewOtRequest = typeof otRequests.$inferInsert;
export type ExpenseRequest = typeof expenseRequests.$inferSelect;
export type NewExpenseRequest = typeof expenseRequests.$inferInsert;
export type LeaveRequest = typeof leaveRequests.$inferSelect;
export type NewLeaveRequest = typeof leaveRequests.$inferInsert;
