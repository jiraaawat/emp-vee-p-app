"use client";

import { useState } from "react";
import { LayoutWrapper } from "@/components/layout-wrapper";
import { BentoCard } from "@/components/bento-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateOtRequest } from "@/hooks/use-ot-requests";
import { useCreateExpenseRequest } from "@/hooks/use-expense-requests";
import { useCreateLeaveRequest } from "@/hooks/use-leave-requests";
import { useEmployees } from "@/hooks/use-employees";
import { FileText } from "lucide-react";

export default function RequestsPage() {
  const [activeTab, setActiveTab] = useState<"ot" | "expense" | "leave">("ot");
  const { data: employees = [] } = useEmployees();

  return (
    <LayoutWrapper>
<div className="flex gap-2 mb-6">
        {[
          { key: "ot", label: "ขอ OT" },
          { key: "expense", label: "เบิกเงิน" },
          { key: "leave", label: "แจ้งลา" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`
              px-4 py-2 rounded-lg text-sm font-medium transition-all
              ${
                activeTab === tab.key
                  ? "bg-secondary/10 text-secondary border border-secondary/20"
                  : "bg-surface-container text-on-surface-variant border border-transparent hover:text-on-surface"
              }
            `}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <BentoCard className="max-w-2xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-primary/10">
            <FileText className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-heading text-lg font-semibold text-on-surface">
              {activeTab === "ot" && "ฟอร์มขอ OT"}
              {activeTab === "expense" && "ฟอร์มเบิกเงิน"}
              {activeTab === "leave" && "ฟอร์มแจ้งลา"}
            </h3>
          </div>
        </div>

        {activeTab === "ot" && <OtForm employees={employees} />}
        {activeTab === "expense" && <ExpenseForm employees={employees} />}
        {activeTab === "leave" && <LeaveForm employees={employees} />}
      </BentoCard>
    </LayoutWrapper>
  );
}

function EmployeeSelect({ employees, value, onChange }: { employees: any[]; value: string; onChange: (v: string) => void }) {
  return (
    <Select value={value} onValueChange={(v) => onChange(v || "")}>
      <SelectTrigger className="bg-surface-container border-border text-on-surface">
        <SelectValue placeholder="เลือกพนักงาน" />
      </SelectTrigger>
      <SelectContent className="bg-surface-container-high border-border">
        {employees.map((e) => (
          <SelectItem key={e.id} value={e.id} className="text-on-surface focus:bg-surface-container">
            {e.fullName}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function OtForm({ employees }: { employees: any[] }) {
  const create = useCreateOtRequest();
  const [form, setForm] = useState({
    employeeId: "",
    otDate: "",
    startTime: "",
    endTime: "",
    rateType: "1.5",
    project: "",
    description: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    create.mutate(form as any, {
      onSuccess: () => {
        setForm({ employeeId: "", otDate: "", startTime: "", endTime: "", rateType: "1.5", project: "", description: "" });
      },
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label className="text-on-surface-variant">พนักงาน</Label>
        <EmployeeSelect employees={employees} value={form.employeeId} onChange={(v) => setForm({ ...form, employeeId: v })} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-on-surface-variant">วันที่</Label>
          <Input type="date" value={form.otDate} onChange={(e) => setForm({ ...form, otDate: e.target.value })} className="bg-surface-container border-border text-on-surface" />
        </div>
        <div>
          <Label className="text-on-surface-variant">อัตรา</Label>
          <Select value={form.rateType} onValueChange={(v) => setForm({ ...form, rateType: v || "1.5" })}>
            <SelectTrigger className="bg-surface-container border-border text-on-surface">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-surface-container-high border-border">
              <SelectItem value="1.5" className="text-on-surface">1.5x</SelectItem>
              <SelectItem value="2" className="text-on-surface">2x</SelectItem>
              <SelectItem value="3" className="text-on-surface">3x</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-on-surface-variant">เริ่ม</Label>
          <Input type="time" value={form.startTime} onChange={(e) => setForm({ ...form, startTime: e.target.value })} className="bg-surface-container border-border text-on-surface" />
        </div>
        <div>
          <Label className="text-on-surface-variant">ถึง</Label>
          <Input type="time" value={form.endTime} onChange={(e) => setForm({ ...form, endTime: e.target.value })} className="bg-surface-container border-border text-on-surface" />
        </div>
      </div>
      <div>
        <Label className="text-on-surface-variant">โครงการ</Label>
        <Input value={form.project} onChange={(e) => setForm({ ...form, project: e.target.value })} className="bg-surface-container border-border text-on-surface" />
      </div>
      <div>
        <Label className="text-on-surface-variant">รายละเอียด</Label>
        <Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="bg-surface-container border-border text-on-surface" />
      </div>
      <Button type="submit" disabled={create.isPending} className="bg-gradient-to-b from-primary to-primary-container text-on-primary hover:shadow-[0_0_15px_rgba(208,188,255,0.4)]">
        ส่งคำขอ OT
      </Button>
    </form>
  );
}

function ExpenseForm({ employees }: { employees: any[] }) {
  const create = useCreateExpenseRequest();
  const [form, setForm] = useState({
    employeeId: "",
    expenseDate: "",
    category: "food",
    amount: "",
    description: "",
    project: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    create.mutate({ ...form, amount: Number(form.amount) } as any, {
      onSuccess: () => {
        setForm({ employeeId: "", expenseDate: "", category: "food", amount: "", description: "", project: "" });
      },
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label className="text-on-surface-variant">พนักงาน</Label>
        <EmployeeSelect employees={employees} value={form.employeeId} onChange={(v) => setForm({ ...form, employeeId: v })} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-on-surface-variant">วันที่</Label>
          <Input type="date" value={form.expenseDate} onChange={(e) => setForm({ ...form, expenseDate: e.target.value })} className="bg-surface-container border-border text-on-surface" />
        </div>
        <div>
          <Label className="text-on-surface-variant">ประเภท</Label>
          <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: (v || "food") as any })}>
            <SelectTrigger className="bg-surface-container border-border text-on-surface">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-surface-container-high border-border">
              <SelectItem value="travel" className="text-on-surface">ค่าเดินทาง</SelectItem>
              <SelectItem value="food" className="text-on-surface">ค่าอาหาร</SelectItem>
              <SelectItem value="allowance" className="text-on-surface">เบี้ยเลี้ยง</SelectItem>
              <SelectItem value="other" className="text-on-surface">อื่นๆ</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-on-surface-variant">จำนวนเงิน</Label>
          <Input type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} className="bg-surface-container border-border text-on-surface" />
        </div>
        <div>
          <Label className="text-on-surface-variant">โครงการ</Label>
          <Input value={form.project} onChange={(e) => setForm({ ...form, project: e.target.value })} className="bg-surface-container border-border text-on-surface" />
        </div>
      </div>
      <div>
        <Label className="text-on-surface-variant">รายละเอียด</Label>
        <Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="bg-surface-container border-border text-on-surface" />
      </div>
      <Button type="submit" disabled={create.isPending} className="bg-gradient-to-b from-primary to-primary-container text-on-primary hover:shadow-[0_0_15px_rgba(208,188,255,0.4)]">
        ส่งคำขอเบิกเงิน
      </Button>
    </form>
  );
}

function LeaveForm({ employees }: { employees: any[] }) {
  const create = useCreateLeaveRequest();
  const [form, setForm] = useState({
    employeeId: "",
    leaveType: "annual",
    startDate: "",
    endDate: "",
    reason: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const start = new Date(form.startDate);
    const end = new Date(form.endDate);
    const totalDays = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1);
    create.mutate({ ...form, totalDays } as any, {
      onSuccess: () => {
        setForm({ employeeId: "", leaveType: "annual", startDate: "", endDate: "", reason: "" });
      },
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label className="text-on-surface-variant">พนักงาน</Label>
        <EmployeeSelect employees={employees} value={form.employeeId} onChange={(v) => setForm({ ...form, employeeId: v })} />
      </div>
      <div>
        <Label className="text-on-surface-variant">ประเภทการลา</Label>
        <Select value={form.leaveType} onValueChange={(v) => setForm({ ...form, leaveType: (v || "annual") as any })}>
          <SelectTrigger className="bg-surface-container border-border text-on-surface">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-surface-container-high border-border">
            <SelectItem value="annual" className="text-on-surface">ลาพักร้อน</SelectItem>
            <SelectItem value="sick" className="text-on-surface">ลาป่วย</SelectItem>
            <SelectItem value="personal" className="text-on-surface">ลากิจ</SelectItem>
            <SelectItem value="unpaid" className="text-on-surface">ลาไม่รับค่าจ้าง</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-on-surface-variant">ตั้งแต่</Label>
          <Input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} className="bg-surface-container border-border text-on-surface" />
        </div>
        <div>
          <Label className="text-on-surface-variant">ถึง</Label>
          <Input type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} className="bg-surface-container border-border text-on-surface" />
        </div>
      </div>
      <div>
        <Label className="text-on-surface-variant">เหตุผล</Label>
        <Input value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} className="bg-surface-container border-border text-on-surface" />
      </div>
      <Button type="submit" disabled={create.isPending} className="bg-gradient-to-b from-primary to-primary-container text-on-primary hover:shadow-[0_0_15px_rgba(208,188,255,0.4)]">
        ส่งคำขอลา
      </Button>
    </form>
  );
}
