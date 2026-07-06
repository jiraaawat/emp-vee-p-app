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
import { useCreateOtRequest } from "@/hooks/use-ot-requests";
import { useEmployeeByLineUserId } from "@/hooks/use-employees";
import { FileText, UserCircle } from "lucide-react";
import Link from "next/link";

export default function LiffOtPage() {
  const { profile, ready } = useLiff();
  const { data: employee } = useEmployeeByLineUserId(profile?.userId);
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
    create.mutate(form as any, {
      onSuccess: () => {
        setForm({ employeeId: employee.id, otDate: "", startTime: "", endTime: "", rateType: "1.5", project: employee.project, description: "" });
      },
    });
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-6">
          <FileText className="w-10 h-10 text-primary mx-auto mb-2" />
          <h1 className="font-heading text-2xl font-bold text-primary">ขอ OT</h1>
          <p className="text-sm text-on-surface-variant">{employee.fullName}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label className="text-on-surface-variant">วันที่</Label>
            <Input type="date" value={form.otDate} onChange={(e) => setForm({ ...form, otDate: e.target.value })} className="bg-surface-container border-border text-on-surface" />
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
          <div>
            <Label className="text-on-surface-variant">โครงการ</Label>
            <Input value={form.project} onChange={(e) => setForm({ ...form, project: e.target.value })} className="bg-surface-container border-border text-on-surface" />
          </div>
          <div>
            <Label className="text-on-surface-variant">รายละเอียด</Label>
            <Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="bg-surface-container border-border text-on-surface" />
          </div>
          <Button type="submit" disabled={create.isPending} className="w-full h-12 bg-gradient-to-b from-primary to-primary-container text-on-primary text-lg font-semibold">
            ส่งคำขอ OT
          </Button>
        </form>

        {create.isSuccess && (
          <p className="text-center text-secondary text-sm mt-4">ส่งคำขอสำเร็จ</p>
        )}
      </div>
    </div>
  );
}
