"use client";

import { useState, useEffect } from "react";
import { useLiff } from "../liff-provider";
import { Button } from "@/components/ui/button";
import { useClockIn, useClockOut } from "@/hooks/use-attendance";
import { useEmployeeByLineUserId } from "@/hooks/use-employees";
import { Clock, MapPin, UserCircle } from "lucide-react";
import Link from "next/link";

export default function LiffClockPage() {
  const { profile, ready } = useLiff();
  const { data: employee } = useEmployeeByLineUserId(profile?.userId);
  const clockIn = useClockIn();
  const clockOut = useClockOut();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [location, setLocation] = useState<GeolocationPosition | null>(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(setLocation);
    }
  }, []);

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

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-md mx-auto">
        <h1 className="font-heading text-2xl font-bold text-primary mb-2 text-center">เข้า-ออกงาน</h1>
        <p className="text-center text-on-surface-variant mb-8">
          {employee.fullName}
        </p>

        <div className="bento-card p-8 mb-6 text-center">
          <Clock className="w-12 h-12 text-secondary mx-auto mb-4" />
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

        <div className="grid grid-cols-2 gap-4">
          <Button
            onClick={() => clockIn.mutate(employee.id)}
            disabled={clockIn.isPending}
            className="h-16 bg-gradient-to-b from-secondary to-secondary-container text-on-secondary text-lg font-semibold hover:shadow-[0_0_20px_rgba(76,215,246,0.4)]"
          >
            เข้างาน
          </Button>
          <Button
            onClick={() => clockOut.mutate(employee.id)}
            disabled={clockOut.isPending}
            variant="outline"
            className="h-16 border-border text-on-surface text-lg font-semibold hover:bg-surface-container-high"
          >
            ออกงาน
          </Button>
        </div>

        {(clockIn.isSuccess || clockOut.isSuccess) && (
          <p className="text-center text-secondary text-sm mt-4">บันทึกเวลาสำเร็จ</p>
        )}
      </div>
    </div>
  );
}
