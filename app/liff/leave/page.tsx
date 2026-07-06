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
import { useCreateLeaveRequest } from "@/hooks/use-leave-requests";
import { useEmployeeByLineUserId } from "@/hooks/use-employees";
import { Umbrella, UserCircle } from "lucide-react";
import Link from "next/link";

export default function LiffLeavePage() {
  const { profile, ready } = useLiff();
  const { data: employee } = useEmployeeByLineUserId(profile?.userId);
  const create = useCreateLeaveRequest();
  const [form, setForm] = useState({
    employeeId: "",
    leaveType: "annual" as const,
    startDate: "",
    endDate: "",
    reason: "",
  });

  useEffect(() => {
    if (employee) {
      setForm((prev) => ({ ...prev, employeeId: employee.id }));
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
    const start = new Date(form.startDate);
    const end = new Date(form.endDate);
    const totalDays = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1);
    create.mutate({ ...form, totalDays } as any, {
      onSuccess: () => {
        setForm({ employeeId: employee.id, leaveType: "annual", startDate: "", endDate: "", reason: "" });
      },
    });
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-6">
          <Umbrella className="w-10 h-10 text-secondary mx-auto mb-2" />
          <h1 className="font-heading text-2xl font-bold text-primary">แจ้งลา</h1>
          <p className="text-sm text-on-surface-variant">{employee.fullName}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
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
          <Button type="submit" disabled={create.isPending} className="w-full h-12 bg-gradient-to-b from-primary to-primary-container text-on-primary text-lg font-semibold">
            ส่งคำขอลา
          </Button>
        </form>

        {create.isSuccess && (
          <p className="text-center text-secondary text-sm mt-4">ส่งคำขอสำเร็จ</p>
        )}
      </div>
    </div>
  );
}
