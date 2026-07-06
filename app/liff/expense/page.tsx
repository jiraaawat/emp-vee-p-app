"use client";

import { useState, useEffect } from "react";
import { useLiff } from "../liff-provider";
import { LiffPageLayout } from "../components/liff-page-layout";
import { LiffNotLinked } from "../components/liff-not-linked";
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
import { useCreateExpenseRequest } from "@/hooks/use-expense-requests";
import { useEmployeeByLineUserId } from "@/hooks/use-employees";
import { Wallet } from "lucide-react";

export default function LiffExpensePage() {
  const { profile, ready } = useLiff();
  const { data: employee } = useEmployeeByLineUserId(profile?.userId);
  const create = useCreateExpenseRequest();
  const [form, setForm] = useState({
    employeeId: "",
    expenseDate: "",
    category: "food" as const,
    amount: "",
    description: "",
    project: "",
  });

  useEffect(() => {
    if (employee) {
      setForm((prev) => ({ ...prev, employeeId: employee.id, project: employee.project }));
    }
  }, [employee]);

  if (!ready) {
    return <div className="min-h-screen flex items-center justify-center text-on-surface-variant">กำลังโหลด...</div>;
  }

  if (!employee) {
    return <LiffNotLinked />;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    create.mutate({ ...form, amount: Number(form.amount) } as any, {
      onSuccess: () => {
        setForm({ employeeId: employee.id, expenseDate: "", category: "food", amount: "", description: "", project: employee.project });
      },
    });
  };

  return (
    <LiffPageLayout
      title="เบิกเงิน"
      subtitle={employee.fullName}
      icon={Wallet}
      iconColor="text-tertiary"
      iconBg="bg-tertiary/10"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
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
        <div>
          <Label className="text-on-surface-variant">จำนวนเงิน</Label>
          <Input type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} className="bg-surface-container border-border text-on-surface" />
        </div>
        <div>
          <Label className="text-on-surface-variant">โครงการ</Label>
          <Input value={form.project} onChange={(e) => setForm({ ...form, project: e.target.value })} className="bg-surface-container border-border text-on-surface" />
        </div>
        <div>
          <Label className="text-on-surface-variant">รายละเอียด</Label>
          <Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="bg-surface-container border-border text-on-surface" />
        </div>
        <Button type="submit" disabled={create.isPending} className="w-full h-12 bg-gradient-to-b from-primary to-primary-container text-on-primary text-lg font-semibold hover:shadow-[0_0_20px_rgba(208,188,255,0.4)]">
          ส่งคำขอเบิกเงิน
        </Button>
      </form>

      {create.isSuccess && (
        <p className="text-center text-secondary text-sm mt-4">ส่งคำขอสำเร็จ</p>
      )}
    </LiffPageLayout>
  );
}
