"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Users, Lock, Eye, EyeOff, Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "เข้าสู่ระบบล้มเหลว");
      }

      router.replace("/");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* ambient glow */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/20 blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-secondary/15 blur-[120px]" />

      <div className="relative w-full max-w-md">
        <div className="glass-card rounded-2xl p-8 md:p-10 shadow-2xl shadow-black/50">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-secondary to-secondary-container flex items-center justify-center mb-4 shadow-[0_0_30px_rgba(76,215,246,0.3)]">
              <Users className="w-8 h-8 text-on-secondary" />
            </div>
            <h1 className="font-heading text-3xl font-bold text-on-surface mb-1">
              EmpVee <span className="text-secondary">HR</span>
            </h1>
            <p className="text-sm text-on-surface-variant">เข้าสู่ระบบจัดการพนักงาน</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label className="text-on-surface-variant text-sm">ชื่อผู้ใช้</Label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
                <Input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="hradmin"
                  className="pl-10 h-12 bg-surface-container border-border text-on-surface placeholder:text-on-surface-variant/50"
                  autoComplete="username"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-on-surface-variant text-sm">รหัสผ่าน</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="pl-10 pr-10 h-12 bg-surface-container border-border text-on-surface placeholder:text-on-surface-variant/50"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="rounded-lg bg-error/10 border border-error/20 text-error text-sm px-4 py-3">
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={loading || !username || !password}
              className="w-full h-12 bg-gradient-to-r from-secondary to-secondary-container text-on-secondary font-semibold text-lg hover:shadow-[0_0_25px_rgba(76,215,246,0.4)] disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "เข้าสู่ระบบ"}
            </Button>
          </form>

          <p className="text-center text-xs text-on-surface-variant/60 mt-6">
            Demo account: hradmin / empvee2026
          </p>
        </div>
      </div>
    </div>
  );
}
