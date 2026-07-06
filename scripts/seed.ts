import { db } from "../lib/db";
import {
  employees,
  attendance,
  otRequests,
  expenseRequests,
  leaveRequests,
} from "../lib/db/schema";

const now = new Date();

const seedEmployees = [
  { id: "1", employeeCode: "10180", fullName: "Mr.Nopparat Krasaesom", department: "Technical Service", project: "VW03", managerId: "3", workStartTime: "08:00", workEndTime: "17:00", status: "active" as const, lineUserId: "U001nopparat", createdAt: now },
  { id: "2", employeeCode: "10105", fullName: "Mr.Krittitee Rodsathit", department: "Technical Service", project: "PPE1", managerId: "3", workStartTime: "08:00", workEndTime: "17:00", status: "active" as const, lineUserId: "U002krittitee", createdAt: now },
  { id: "3", employeeCode: "10001", fullName: "K.Cooper", department: "Management", project: "All", managerId: null, workStartTime: "08:00", workEndTime: "17:00", status: "active" as const, lineUserId: null, createdAt: now },
  { id: "4", employeeCode: "10002", fullName: "Dr.Athtawoot", department: "Management", project: "All", managerId: null, workStartTime: "08:00", workEndTime: "17:00", status: "active" as const, lineUserId: null, createdAt: now },
  { id: "5", employeeCode: "10210", fullName: "Somchai Jaidee", department: "Installation", project: "VW03", managerId: "3", workStartTime: "08:00", workEndTime: "17:00", status: "active" as const, lineUserId: null, createdAt: now },
  { id: "6", employeeCode: "10215", fullName: "Prasert Wong", department: "Installation", project: "PPE1", managerId: "3", workStartTime: "08:00", workEndTime: "17:00", status: "active" as const, lineUserId: null, createdAt: now },
  { id: "7", employeeCode: "10300", fullName: "Malee Srisuk", department: "HR", project: "Office", managerId: "4", workStartTime: "08:00", workEndTime: "17:00", status: "active" as const, lineUserId: null, createdAt: now },
];

const seedAttendance = [
  { id: "a1", employeeId: "1", workDate: "2026-05-21", clockInAt: "08:00", clockOutAt: "21:00", status: "present" as const, note: null, createdAt: now, updatedAt: now },
  { id: "a2", employeeId: "1", workDate: "2026-05-22", clockInAt: "08:05", clockOutAt: "17:00", status: "present" as const, note: null, createdAt: now, updatedAt: now },
  { id: "a3", employeeId: "1", workDate: "2026-05-23", clockInAt: null, clockOutAt: null, status: "absent" as const, note: null, createdAt: now, updatedAt: now },
  { id: "a4", employeeId: "1", workDate: "2026-05-24", clockInAt: null, clockOutAt: null, status: "absent" as const, note: null, createdAt: now, updatedAt: now },
  { id: "a5", employeeId: "1", workDate: "2026-05-25", clockInAt: null, clockOutAt: null, status: "leave" as const, note: "Vacation Leave", createdAt: now, updatedAt: now },
  { id: "a6", employeeId: "1", workDate: "2026-05-26", clockInAt: null, clockOutAt: null, status: "leave" as const, note: "Vacation Leave", createdAt: now, updatedAt: now },
  { id: "a7", employeeId: "1", workDate: "2026-05-27", clockInAt: null, clockOutAt: null, status: "leave" as const, note: "Vacation Leave", createdAt: now, updatedAt: now },
  { id: "a8", employeeId: "1", workDate: "2026-05-28", clockInAt: null, clockOutAt: null, status: "leave" as const, note: "Vacation Leave", createdAt: now, updatedAt: now },
  { id: "a9", employeeId: "1", workDate: "2026-05-29", clockInAt: null, clockOutAt: null, status: "leave" as const, note: "Vacation Leave", createdAt: now, updatedAt: now },
  { id: "a10", employeeId: "1", workDate: "2026-05-30", clockInAt: null, clockOutAt: null, status: "absent" as const, note: null, createdAt: now, updatedAt: now },
  { id: "a11", employeeId: "1", workDate: "2026-05-31", clockInAt: null, clockOutAt: null, status: "absent" as const, note: null, createdAt: now, updatedAt: now },
  { id: "a12", employeeId: "2", workDate: "2026-05-21", clockInAt: "08:00", clockOutAt: "17:00", status: "present" as const, note: null, createdAt: now, updatedAt: now },
  { id: "a13", employeeId: "2", workDate: "2026-05-22", clockInAt: "07:48", clockOutAt: "17:00", status: "present" as const, note: null, createdAt: now, updatedAt: now },
  { id: "a14", employeeId: "2", workDate: "2026-05-23", clockInAt: null, clockOutAt: null, status: "absent" as const, note: null, createdAt: now, updatedAt: now },
  { id: "a15", employeeId: "2", workDate: "2026-05-24", clockInAt: null, clockOutAt: null, status: "absent" as const, note: null, createdAt: now, updatedAt: now },
  { id: "a16", employeeId: "2", workDate: "2026-05-25", clockInAt: null, clockOutAt: null, status: "leave" as const, note: "Vacation Leave", createdAt: now, updatedAt: now },
  { id: "a17", employeeId: "2", workDate: "2026-05-26", clockInAt: "07:50", clockOutAt: "17:00", status: "present" as const, note: null, createdAt: now, updatedAt: now },
  { id: "a18", employeeId: "2", workDate: "2026-05-27", clockInAt: "08:00", clockOutAt: "17:11", status: "present" as const, note: null, createdAt: now, updatedAt: now },
  { id: "a19", employeeId: "2", workDate: "2026-05-28", clockInAt: "08:00", clockOutAt: "17:00", status: "present" as const, note: null, createdAt: now, updatedAt: now },
  { id: "a20", employeeId: "2", workDate: "2026-05-29", clockInAt: "08:00", clockOutAt: "17:11", status: "present" as const, note: null, createdAt: now, updatedAt: now },
  { id: "a21", employeeId: "2", workDate: "2026-05-30", clockInAt: null, clockOutAt: null, status: "absent" as const, note: null, createdAt: now, updatedAt: now },
  { id: "a22", employeeId: "2", workDate: "2026-05-31", clockInAt: null, clockOutAt: null, status: "absent" as const, note: null, createdAt: now, updatedAt: now },
];

const seedOtRequests = [
  { id: "ot1", employeeId: "1", otDate: "2026-05-21", startTime: "17:00", endTime: "21:00", rateType: "1.5" as const, project: "VW03", description: "Technical service", status: "approved" as const, requestedAt: new Date("2026-05-21T09:00:00+00:00") },
  { id: "ot2", employeeId: "2", otDate: "2026-05-22", startTime: "17:01", endTime: "19:00", rateType: "1.5" as const, project: "PPE1", description: "Technical service", status: "pending" as const, requestedAt: new Date("2026-05-22T09:30:00+00:00") },
  { id: "ot3", employeeId: "2", otDate: "2026-05-27", startTime: "17:11", endTime: "20:00", rateType: "1.5" as const, project: "PPE1", description: "Technical service", status: "pending" as const, requestedAt: new Date("2026-05-27T09:15:00+00:00") },
];

const seedExpenseRequests = [
  { id: "ex1", employeeId: "1", expenseDate: "2026-05-21", category: "food" as const, amount: "120.00", description: "OT Dinner", project: "VW03", status: "approved" as const, requestedAt: new Date("2026-05-21T10:00:00+00:00") },
  { id: "ex2", employeeId: "1", expenseDate: "2026-05-21", category: "travel" as const, amount: "60.00", description: "Taxi", project: "VW03", status: "approved" as const, requestedAt: new Date("2026-05-21T10:05:00+00:00") },
  { id: "ex3", employeeId: "2", expenseDate: "2026-05-22", category: "food" as const, amount: "120.00", description: "Lunch", project: "PPE1", status: "pending" as const, requestedAt: new Date("2026-05-22T10:30:00+00:00") },
  { id: "ex4", employeeId: "2", expenseDate: "2026-05-26", category: "allowance" as const, amount: "120.00", description: "Provincial allowance", project: "PPE1", status: "pending" as const, requestedAt: new Date("2026-05-26T11:00:00+00:00") },
];

const seedLeaveRequests = [
  { id: "lv1", employeeId: "1", leaveType: "annual" as const, startDate: "2026-05-25", endDate: "2026-05-29", totalDays: 5, reason: "Vacation", status: "approved" as const, requestedAt: new Date("2026-05-20T08:00:00+00:00") },
  { id: "lv2", employeeId: "2", leaveType: "annual" as const, startDate: "2026-05-25", endDate: "2026-05-25", totalDays: 1, reason: "Personal", status: "approved" as const, requestedAt: new Date("2026-05-23T08:00:00+00:00") },
  { id: "lv3", employeeId: "5", leaveType: "sick" as const, startDate: "2026-06-02", endDate: "2026-06-03", totalDays: 2, reason: "Fever", status: "pending" as const, requestedAt: new Date("2026-06-01T08:00:00+00:00") },
];

async function main() {
  console.log("Seeding employees...");
  await db.insert(employees).values(seedEmployees).onConflictDoNothing({ target: employees.id });

  console.log("Seeding attendance...");
  await db.insert(attendance).values(seedAttendance).onConflictDoNothing({ target: attendance.id });

  console.log("Seeding OT requests...");
  await db.insert(otRequests).values(seedOtRequests).onConflictDoNothing({ target: otRequests.id });

  console.log("Seeding expense requests...");
  await db.insert(expenseRequests).values(seedExpenseRequests).onConflictDoNothing({ target: expenseRequests.id });

  console.log("Seeding leave requests...");
  await db.insert(leaveRequests).values(seedLeaveRequests).onConflictDoNothing({ target: leaveRequests.id });

  console.log("Seed completed.");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  });
