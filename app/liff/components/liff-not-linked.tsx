"use client";

import Link from "next/link";
import { UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function LiffNotLinked() {
  return (
    <div className="min-h-screen bg-background p-6 flex items-center justify-center">
      <div className="max-w-md mx-auto text-center space-y-5 bento-card p-8">
        <div className="w-16 h-16 rounded-2xl bg-surface-container flex items-center justify-center mx-auto">
          <UserCircle className="w-8 h-8 text-on-surface-variant" />
        </div>
        <div>
          <h2 className="font-heading text-lg font-semibold text-on-surface mb-1">
            ยังไม่ได้ผูกบัญชี
          </h2>
          <p className="text-sm text-on-surface-variant">
            บัญชี LINE นี้ยังไม่ได้ผูกกับพนักงานในระบบ
          </p>
        </div>
        <Link href="/liff/link">
          <Button className="w-full h-12 bg-gradient-to-b from-primary to-primary-container text-on-primary text-lg font-semibold hover:shadow-[0_0_20px_rgba(208,188,255,0.4)]">
            ผูกบัญชีพนักงาน
          </Button>
        </Link>
      </div>
    </div>
  );
}
