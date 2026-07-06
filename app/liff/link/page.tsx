"use client";

import { useState } from "react";
import { useLiff } from "../liff-provider";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEmployees } from "@/hooks/use-employees";
import { UserCircle } from "lucide-react";

export default function LiffLinkPage() {
  const { profile, ready } = useLiff();
  const { data: employees = [] } = useEmployees();
  const [employeeId, setEmployeeId] = useState("");
  const [linked, setLinked] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!ready) {
    return <div className="min-h-screen flex items-center justify-center text-on-surface-variant">กำลังโหลด...</div>;
  }

  const handleLink = async () => {
    if (!employeeId || !profile?.userId) return;
    setLoading(true);
    try {
      const res = await fetch("/api/line/link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ employeeId, lineUserId: profile.userId }),
      });
      if (res.ok) setLinked(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-6">
          <UserCircle className="w-10 h-10 text-on-surface-variant mx-auto mb-2" />
          <h1 className="font-heading text-2xl font-bold text-primary">ผูกบัญชี</h1>
          <p className="text-sm text-on-surface-variant">{profile?.displayName}</p>
        </div>

        {linked ? (
          <div className="bento-card p-6 text-center">
            <p className="text-secondary font-medium">ผูกบัญชีสำเร็จ!</p>
            <p className="text-sm text-on-surface-variant mt-2">คุณสามารถใช้งานเมนูต่างๆ ได้แล้ว</p>
          </div>
        ) : (
          <div className="bento-card p-6 space-y-4">
            <div>
              <p className="text-sm text-on-surface-variant mb-2">เลือกพนักงานของคุณ</p>
              <Select value={employeeId} onValueChange={(v) => setEmployeeId(v || "")}>
                <SelectTrigger className="bg-surface-container border-border text-on-surface">
                  <SelectValue placeholder="เลือกพนักงาน" />
                </SelectTrigger>
                <SelectContent className="bg-surface-container-high border-border">
                  {employees.map((e) => (
                    <SelectItem key={e.id} value={e.id} className="text-on-surface">
                      {e.employeeCode} - {e.fullName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              onClick={handleLink}
              disabled={!employeeId || loading}
              className="w-full h-12 bg-gradient-to-b from-primary to-primary-container text-on-primary text-lg font-semibold"
            >
              {loading ? "กำลังผูกบัญชี..." : "ผูกบัญชี"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
