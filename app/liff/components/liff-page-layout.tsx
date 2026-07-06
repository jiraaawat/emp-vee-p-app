"use client";

import Link from "next/link";
import { ChevronLeft, User } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useLiff } from "../liff-provider";
import { BentoCard } from "@/components/bento-card";

interface LiffPageLayoutProps {
  title: string;
  subtitle?: string;
  icon: LucideIcon;
  iconColor?: string;
  iconBg?: string;
  children: React.ReactNode;
}

export function LiffPageLayout({
  title,
  subtitle,
  icon: Icon,
  iconColor = "text-primary",
  iconBg = "bg-primary/10",
  children,
}: LiffPageLayoutProps) {
  const { profile, ready } = useLiff();

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-md mx-auto px-4 h-14 flex items-center justify-between">
          <Link
            href="/liff"
            className="p-2 -ml-2 rounded-lg hover:bg-surface-container transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-on-surface-variant" />
          </Link>
          <span className="font-heading font-semibold text-on-surface">{title}</span>
          <div className="flex items-center gap-1.5 text-xs text-on-surface-variant">
            <User className="w-4 h-4" />
            <span className="max-w-[80px] truncate">
              {ready ? profile?.displayName || "Guest" : "..."}
            </span>
          </div>
        </div>
      </header>

      <main className="px-4 py-5 pb-10 max-w-md mx-auto">
        <BentoCard>
          <div className="flex items-center gap-3 mb-6">
            <div className={`p-2.5 rounded-xl ${iconBg}`}>
              <Icon className={`w-6 h-6 ${iconColor}`} />
            </div>
            <div>
              <h1 className="font-heading text-xl font-semibold text-on-surface">{title}</h1>
              {subtitle && <p className="text-xs text-on-surface-variant">{subtitle}</p>}
            </div>
          </div>
          {children}
        </BentoCard>
      </main>
    </div>
  );
}
