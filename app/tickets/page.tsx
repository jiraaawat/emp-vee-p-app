"use client";

import { LayoutWrapper } from "@/components/layout-wrapper";
import { BentoCard } from "@/components/bento-card";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { useTickets, useUpdateTicketStatus } from "@/hooks/use-tickets";
import { MessageSquare, RefreshCw } from "lucide-react";

export default function TicketsPage() {
  const { data: tickets = [], isLoading, error, refetch, isFetching } = useTickets();
  const update = useUpdateTicketStatus();

  return (
    <LayoutWrapper>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-tertiary/10">
            <MessageSquare className="w-5 h-5 text-tertiary" />
          </div>
          <div>
            <h1 className="font-heading text-xl font-semibold text-on-surface">แจ้งปัญหาจากพนักงาน</h1>
            <p className="text-xs text-on-surface-variant">ตรวจสอบและอัปเดตสถานะ</p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          disabled={isFetching}
          className="border-border text-on-surface"
        >
          <RefreshCw className={`w-4 h-4 mr-1 ${isFetching ? "animate-spin" : ""}`} />
          รีเฟรช
        </Button>
      </div>

      <BentoCard>
        {isLoading ? (
          <p className="text-on-surface-variant text-center py-8">กำลังโหลด...</p>
        ) : error ? (
          <p className="text-destructive text-center py-8">{error.message}</p>
        ) : tickets.length === 0 ? (
          <p className="text-on-surface-variant text-center py-8">ยังไม่มีการแจ้งปัญหา</p>
        ) : (
          <div className="space-y-3">
            {tickets.map((t) => (
              <div
                key={t.id}
                className="p-4 rounded-xl bg-surface-container/50 border border-white/5 hover:border-white/10 transition-colors"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-on-surface truncate">
                        {t.lineDisplayName || "ไม่ระบุชื่อ"}
                      </p>
                      <span className="text-xs text-on-surface-variant font-mono truncate">{t.lineUserId}</span>
                    </div>
                    <p className="text-sm text-on-surface-variant">
                      {t.reason}
                      {t.correctEmployeeCode && ` · รหัสที่ถูกต้อง: ${t.correctEmployeeCode}`}
                      {t.correctFullName && ` · ชื่อ: ${t.correctFullName}`}
                    </p>
                    {t.note && <p className="text-xs text-on-surface-variant mt-1">{t.note}</p>}
                    <p className="text-xs text-on-surface-variant mt-2">
                      {new Date(t.createdAt).toLocaleString("th-TH")}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <StatusBadge status={t.status} />
                    {t.status === "open" && (
                      <Button
                        size="sm"
                        onClick={() => update.mutate({ id: t.id, status: "resolved" })}
                        disabled={update.isPending}
                        className="bg-secondary text-on-secondary hover:bg-secondary/80"
                      >
                        แก้ไขแล้ว
                      </Button>
                    )}
                    {t.status === "resolved" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => update.mutate({ id: t.id, status: "open" })}
                        disabled={update.isPending}
                        className="border-border text-on-surface"
                      >
                        เปิดใหม่
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </BentoCard>
    </LayoutWrapper>
  );
}
