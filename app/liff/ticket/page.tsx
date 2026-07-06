"use client";

import { useState } from "react";
import { useLiff } from "../liff-provider";
import { LiffPageLayout } from "../components/liff-page-layout";
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
import { MessageSquare, Check, AlertCircle } from "lucide-react";

const reasons = [
  { value: "wrong_code", label: "รหัสพนักงานผิด" },
  { value: "wrong_name", label: "ชื่อ-สกุลผิด" },
  { value: "wrong_link", label: "ผูกบัญชีผิด" },
  { value: "other", label: "อื่นๆ" },
];

export default function LiffTicketPage() {
  const { profile, ready, error: liffError, liff } = useLiff();
  const [form, setForm] = useState({
    correctEmployeeCode: "",
    correctFullName: "",
    reason: "",
    note: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!ready) {
    return <div className="min-h-screen flex items-center justify-center text-on-surface-variant">กำลังโหลด...</div>;
  }

  if (liffError) {
    return (
      <div className="min-h-screen flex items-center justify-center text-destructive p-6 text-center">
        {liffError}
      </div>
    );
  }

  if (!profile?.userId) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <p className="text-on-surface-variant mb-4">กรุณาเข้าสู่ระบบ LINE เพื่อส่งข้อมูล</p>
        <Button onClick={() => liff?.login({ redirectUri: window.location.href })} className="bg-primary text-on-primary">
          เข้าสู่ระบบ LINE
        </Button>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lineUserId: profile.userId,
          lineDisplayName: profile.displayName,
          correctEmployeeCode: form.correctEmployeeCode,
          correctFullName: form.correctFullName,
          reason: reasons.find((r) => r.value === form.reason)?.label || form.reason,
          note: form.note,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setSubmitted(true);
      } else {
        setError(data.error || `ส่งไม่สำเร็จ (${res.status})`);
      }
    } catch (err) {
      setError("เกิดข้อผิดพลาด กรุณาลองอีกครั้ง");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen p-6 bg-background">
        <div className="max-w-md mx-auto bento-card p-6 text-center mt-20">
          <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center mx-auto mb-4">
            <Check className="w-6 h-6 text-secondary" />
          </div>
          <p className="text-secondary font-medium text-lg">ส่งข้อมูลเรียบร้อย</p>
          <p className="text-sm text-on-surface-variant mt-2">แอดมินจะตรวจสอบและแก้ไขให้ครับ</p>
        </div>
      </div>
    );
  }

  return (
    <LiffPageLayout
      title="แจ้งปัญหา"
      subtitle={profile.displayName}
      icon={MessageSquare}
      iconColor="text-tertiary"
      iconBg="bg-tertiary/10"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label className="text-on-surface-variant">ชื่อใน LINE</Label>
          <Input value={profile.displayName || ""} disabled className="bg-surface-container border-border text-on-surface opacity-70" />
        </div>
        <div>
          <Label className="text-on-surface-variant">รหัสพนักงานที่ถูกต้อง</Label>
          <Input
            value={form.correctEmployeeCode}
            onChange={(e) => setForm({ ...form, correctEmployeeCode: e.target.value })}
            placeholder="เช่น 10180"
            className="bg-surface-container border-border text-on-surface"
          />
        </div>
        <div>
          <Label className="text-on-surface-variant">ชื่อ-สกุลที่ถูกต้อง</Label>
          <Input
            value={form.correctFullName}
            onChange={(e) => setForm({ ...form, correctFullName: e.target.value })}
            placeholder="ชื่อตามบัตรพนักงาน"
            className="bg-surface-container border-border text-on-surface"
          />
        </div>
        <div>
          <Label className="text-on-surface-variant">ประเภทปัญหา</Label>
          <Select value={form.reason} onValueChange={(v) => setForm({ ...form, reason: v || "" })}>
            <SelectTrigger className="bg-surface-container border-border text-on-surface">
              <SelectValue placeholder="เลือกประเภทปัญหา" />
            </SelectTrigger>
            <SelectContent className="bg-surface-container-high border-border">
              {reasons.map((r) => (
                <SelectItem key={r.value} value={r.value} className="text-on-surface">
                  {r.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-on-surface-variant">หมายเหตุเพิ่มเติม</Label>
          <Input
            value={form.note}
            onChange={(e) => setForm({ ...form, note: e.target.value })}
            placeholder="อธิบายเพิ่มเติม (ถ้ามี)"
            className="bg-surface-container border-border text-on-surface"
          />
        </div>

        {error && (
          <div className="flex items-start gap-2 text-destructive text-sm">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <Button
          type="submit"
          disabled={loading || !form.reason}
          className="w-full h-12 bg-gradient-to-b from-primary to-primary-container text-on-primary text-lg font-semibold hover:shadow-[0_0_20px_rgba(208,188,255,0.4)]"
        >
          {loading ? "กำลังส่ง..." : "ส่งให้แอดมิน"}
        </Button>
      </form>
    </LiffPageLayout>
  );
}
