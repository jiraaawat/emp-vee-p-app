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
import { useCreateOtRequest } from "@/hooks/use-ot-requests";
import { useEmployeeByLineUserId } from "@/hooks/use-employees";
import { FileText } from "lucide-react";

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
    return <LiffNotLinked />;
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
    <LiffPageLayout
      title="ขอ OT"
      subtitle={employee.fullName}
      icon={FileText}
      iconColor="text-primary"
      iconBg="bg-primary/10"
    >
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
        <Button type="submit" disabled={create.isPending} className="w-full h-12 bg-gradient-to-b from-primary to-primary-container text-on-primary text-lg font-semibold hover:shadow-[0_0_20px_rgba(208,188,255,0.4)]">
          ส่งคำขอ OT
        </Button>
      </form>

      {create.isSuccess && (
        <p className="text-center text-secondary text-sm mt-4">ส่งคำขอสำเร็จ</p>
      )}
    </LiffPageLayout>
  );
}
