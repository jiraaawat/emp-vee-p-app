"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useLiff } from "../liff-provider";
import { LiffPageLayout } from "../components/liff-page-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEmployees } from "@/hooks/use-employees";
import { UserCircle, Search, Check, ChevronDown, AlertCircle } from "lucide-react";

export default function LiffLinkPage() {
  const router = useRouter();
  const { profile, ready, error: liffError, liff } = useLiff();
  const { data: employees = [], isLoading } = useEmployees();
  const [employeeId, setEmployeeId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [linked, setLinked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const selected = useMemo(
    () => employees.find((e) => e.id === employeeId) || null,
    [employeeId, employees]
  );

  const availableEmployees = useMemo(
    () => employees.filter((e) => !e.lineUserId),
    [employees]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return availableEmployees;
    return availableEmployees.filter(
      (e) =>
        e.fullName.toLowerCase().includes(q) ||
        e.employeeCode.toLowerCase().includes(q) ||
        e.department.toLowerCase().includes(q)
    );
  }, [query, availableEmployees]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLink = async () => {
    if (!employeeId || !profile?.userId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/line/link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ employeeId, lineUserId: profile.userId }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setLinked(true);
      } else {
        setError(data.error || `ผูกบัญชีไม่สำเร็จ (${res.status})`);
      }
    } catch (err) {
      setError("เกิดข้อผิดพลาด กรุณาลองอีกครั้ง");
    } finally {
      setLoading(false);
    }
  };

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center text-on-surface-variant">
        กำลังโหลด LIFF...
      </div>
    );
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
        <p className="text-on-surface-variant mb-4">กรุณาเข้าสู่ระบบ LINE เพื่อผูกบัญชี</p>
        <Button
          onClick={() => liff?.login({ redirectUri: window.location.href })}
          className="bg-primary text-on-primary"
        >
          เข้าสู่ระบบ LINE
        </Button>
      </div>
    );
  }

  useEffect(() => {
    if (!linked) return;
    const timer = setTimeout(() => {
      router.replace("/liff");
    }, 1500);
    return () => clearTimeout(timer);
  }, [linked, router]);

  if (linked) {
    return (
      <div className="min-h-screen p-6 bg-background">
        <div className="max-w-md mx-auto bento-card p-6 text-center mt-20">
          <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
            <Check className="w-6 h-6 text-primary" />
          </div>
          <p className="text-secondary font-medium text-lg">ผูกบัญชีสำเร็จ!</p>
          <p className="text-sm text-on-surface-variant mt-2">
            กำลังพากลับไปหน้าเมนู...
          </p>
        </div>
      </div>
    );
  }

  return (
    <LiffPageLayout
      title="ผูกบัญชี"
      subtitle={profile.displayName}
      icon={UserCircle}
      iconColor="text-primary"
      iconBg="bg-primary/10"
    >
      <div className="space-y-4">
        <div>
          <p className="text-sm text-on-surface-variant mb-2">ค้นหาและเลือกพนักงานของคุณ</p>
          <div className="relative" ref={containerRef}>
            <div
              className="flex items-center gap-2 bg-surface-container border border-border rounded-lg px-3 py-2 cursor-text"
              onClick={() => setOpen(true)}
            >
              <Search className="w-4 h-4 text-on-surface-variant shrink-0" />
              {selected ? (
                <div className="flex-1 min-w-0 text-left">
                  <p className="text-sm font-medium text-on-surface truncate">{selected.fullName}</p>
                  <p className="text-xs text-on-surface-variant truncate">
                    รหัส {selected.employeeCode} · {selected.department}
                  </p>
                </div>
              ) : (
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="พิมพ์ชื่อหรือรหัสพนักงาน"
                  className="border-0 bg-transparent p-0 shadow-none focus-visible:ring-0 text-sm text-on-surface placeholder:text-on-surface-variant"
                  onFocus={() => setOpen(true)}
                />
              )}
              <ChevronDown className="w-4 h-4 text-on-surface-variant shrink-0" />
            </div>

            {open && (
              <div className="absolute z-50 mt-1 w-full bg-surface-container-high border border-border rounded-lg shadow-lg max-h-72 overflow-auto">
                {!selected && (
                  <div className="p-2 border-b border-border">
                    <Input
                      autoFocus
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="พิมพ์ชื่อหรือรหัสพนักงาน"
                      className="bg-surface-container border-border text-sm"
                    />
                  </div>
                )}
                {isLoading ? (
                  <div className="p-4 text-center text-sm text-on-surface-variant">กำลังโหลด...</div>
                ) : filtered.length === 0 ? (
                  <div className="p-4 text-center text-sm text-on-surface-variant">ไม่พบพนักงาน</div>
                ) : (
                  <ul className="py-1">
                    {filtered.map((e) => (
                      <li
                        key={e.id}
                        className="px-3 py-2 hover:bg-primary/10 cursor-pointer flex items-center justify-between"
                        onClick={() => {
                          setEmployeeId(e.id);
                          setQuery("");
                          setOpen(false);
                        }}
                      >
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-on-surface truncate">{e.fullName}</p>
                          <p className="text-xs text-on-surface-variant truncate">
                            รหัส {e.employeeCode} · {e.department}
                          </p>
                        </div>
                        {employeeId === e.id && <Check className="w-4 h-4 text-primary shrink-0 ml-2" />}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        </div>

        {selected && (
          <div className="bg-surface-container-low rounded-lg p-3 text-sm">
            <span className="text-on-surface-variant">พนักงานที่เลือก:</span>{" "}
            <span className="font-medium text-on-surface">{selected.fullName}</span>
            <span className="text-on-surface-variant"> (รหัส {selected.employeeCode})</span>
          </div>
        )}

        {error && (
          <div className="flex items-start gap-2 text-destructive text-sm">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <Button
          onClick={handleLink}
          disabled={!employeeId || !profile?.userId || loading}
          className="w-full h-12 bg-gradient-to-b from-primary to-primary-container text-on-primary text-lg font-semibold hover:shadow-[0_0_20px_rgba(208,188,255,0.4)]"
        >
          {loading ? "กำลังผูกบัญชี..." : "ผูกบัญชี"}
        </Button>
      </div>
    </LiffPageLayout>
  );
}
