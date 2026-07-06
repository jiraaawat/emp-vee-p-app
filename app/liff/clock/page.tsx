"use client";

import { useState, useEffect, useMemo } from "react";
import { useLiff } from "../liff-provider";
import { LiffPageLayout } from "../components/liff-page-layout";
import { LiffNotLinked } from "../components/liff-not-linked";
import { LiffLoading } from "../components/liff-loading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useClockIn, useClockOut, useAttendance } from "@/hooks/use-attendance";
import { useEmployeeByLineUserId } from "@/hooks/use-employees";
import { Clock, MapPin, CheckCircle2 } from "lucide-react";

function formatTime(time?: string | null) {
  if (!time) return "-";
  return time.slice(0, 5);
}

function durationText(start?: string | null, end?: string | null) {
  if (!start || !end) return "-";
  const [sh, sm] = start.split(":").map(Number);
  const [eh, em] = end.split(":").map(Number);
  const startMin = sh * 60 + sm;
  const endMin = eh * 60 + em;
  const diff = Math.max(0, endMin - startMin);
  const h = Math.floor(diff / 60);
  const m = diff % 60;
  return `${h} ชม. ${m} น.`;
}

export default function LiffClockPage() {
  const { profile, ready } = useLiff();
  const { data: employee, isLoading: employeeLoading } = useEmployeeByLineUserId(profile?.userId);
  const { data: attendanceRows = [], isLoading: attendanceLoading } = useAttendance();
  const clockIn = useClockIn();
  const clockOut = useClockOut();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [location, setLocation] = useState<GeolocationPosition | null>(null);
  const [note, setNote] = useState("");

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(setLocation);
    }
  }, []);

  const today = useMemo(
    () => currentTime.toLocaleDateString("en-CA", { timeZone: "Asia/Bangkok" }),
    [currentTime]
  );

  const todayRecord = useMemo(() => {
    if (!employee) return undefined;
    return attendanceRows.find((a) => a.employeeId === employee.id && a.workDate === today);
  }, [attendanceRows, employee, today]);

  const isClockedIn = !!todayRecord?.clockInAt && !todayRecord?.clockOutAt;
  const isClockedOut = !!todayRecord?.clockOutAt;

  if (!ready || !profile?.userId) {
    return <LiffLoading />;
  }

  if (employeeLoading || attendanceLoading) {
    return <LiffLoading />;
  }

  if (!employee) {
    return <LiffNotLinked />;
  }

  const handleClockOut = () => {
    if (!window.confirm("ยืนยันการออกงาน?")) return;
    clockOut.mutate({ employeeId: employee.id, note: note || undefined });
  };

  return (
    <LiffPageLayout
      title="เข้า-ออกงาน"
      subtitle={employee.fullName}
      icon={Clock}
      iconColor="text-secondary"
      iconBg="bg-secondary/10"
    >
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-secondary/10 mb-4">
          <Clock className="w-10 h-10 text-secondary" />
        </div>
        <p className="text-5xl font-mono font-bold text-on-surface mb-2">
          {currentTime.toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" })}
        </p>
        <p className="text-sm text-on-surface-variant">
          {currentTime.toLocaleDateString("th-TH", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </p>
        {location && (
          <p className="text-xs text-on-surface-variant mt-4 flex items-center justify-center gap-1">
            <MapPin className="w-3 h-3" />
            {location.coords.latitude.toFixed(4)}, {location.coords.longitude.toFixed(4)}
          </p>
        )}
      </div>

      {(isClockedIn || isClockedOut) && (
        <div className="bento-card p-4 mb-5">
          <div className="flex items-center gap-3 mb-3">
            <CheckCircle2 className={`w-5 h-5 ${isClockedOut ? "text-primary" : "text-secondary"}`} />
            <p className="font-medium text-on-surface">
              {isClockedOut ? "ออกงานแล้ววันนี้" : "เข้างานแล้ว"}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-on-surface-variant">เข้างาน</p>
              <p className="font-semibold text-on-surface">{formatTime(todayRecord?.clockInAt)}</p>
            </div>
            <div>
              <p className="text-on-surface-variant">ออกงาน</p>
              <p className="font-semibold text-on-surface">{formatTime(todayRecord?.clockOutAt)}</p>
            </div>
            {isClockedOut && (
              <div className="col-span-2">
                <p className="text-on-surface-variant">รวมเวลาทำงาน</p>
                <p className="font-semibold text-on-surface">
                  {durationText(todayRecord?.clockInAt, todayRecord?.clockOutAt)}
                </p>
              </div>
            )}
            {todayRecord?.note && (
              <div className="col-span-2">
                <p className="text-on-surface-variant">หมายเหตุ</p>
                <p className="font-semibold text-on-surface">{todayRecord.note}</p>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <Button
          onClick={() => clockIn.mutate(employee.id)}
          disabled={clockIn.isPending || isClockedIn || isClockedOut}
          className="h-16 bg-gradient-to-b from-secondary to-secondary-container text-on-secondary text-lg font-semibold hover:shadow-[0_0_20px_rgba(76,215,246,0.4)] disabled:opacity-50"
        >
          {isClockedIn || isClockedOut ? "เข้างานแล้ว" : "เข้างาน"}
        </Button>
        <Button
          onClick={handleClockOut}
          disabled={clockOut.isPending || !todayRecord?.clockInAt || isClockedOut}
          variant="outline"
          className="h-16 border-border text-on-surface text-lg font-semibold hover:bg-surface-container-high disabled:opacity-50"
        >
          {isClockedOut ? "ออกงานแล้ว" : "ออกงาน"}
        </Button>
      </div>

      {isClockedIn && (
        <div className="mt-5">
          <Label className="text-on-surface-variant">หมายเหตุการออกงาน (optional)</Label>
          <Input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="เช่น ออกงานนอกสถานที่"
            className="bg-surface-container border-border text-on-surface mt-1"
          />
        </div>
      )}

      {(clockIn.isSuccess || clockOut.isSuccess) && (
        <p className="text-center text-secondary text-sm mt-4">บันทึกเวลาสำเร็จ</p>
      )}
    </LiffPageLayout>
  );
}
