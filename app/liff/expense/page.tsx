"use client";

import { useState, useEffect } from "react";
import { useLiff } from "../liff-provider";
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
import { Wallet, UserCircle } from "lucide-react";
import Link from "next/link";

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
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center space-y-4">
          <UserCircle className="w-12 h-12 text-on-surface-variant mx-auto" />
          <p className="text-on-surface-variant">บัญชี LINE นี้ยังไม่ได้ผูกกับพนักงาน</p>
          <Link href="/liff/link">
            <Button className="w-full h-12 bg-gradient-to-b from-primary to-primary-container text-on-primary text-lg font-semibold">
              ผูกบัญชีพนักงาน
            </Button>
          </Link>
        </div>
      </div>
    );
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
    <div className="min-h-screen p-6">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-6">
          <Wallet className="w-10 h-10 text-tertiary mx-auto mb-2" />
          <h1 className="font-heading text-2xl font-bold text-primary">เบิกเงิน</h1>
          <p className="text-sm text-on-surface-variant">{employee.fullName}</p>
        </div>

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
          <Button type="submit" disabled={create.isPending} className="w-full h-12 bg-gradient-to-b from-primary to-primary-container text-on-primary text-lg font-semibold">
            ส่งคำขอเบิกเงิน
          </Button>
        </form>

        {create.isSuccess && (
          <p className="text-center text-secondary text-sm mt-4">ส่งคำขอสำเร็จ</p>
        )}
      </div>
    </div>
  );
}
