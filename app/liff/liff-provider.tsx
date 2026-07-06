"use client";

import { useEffect, useState, createContext, useContext } from "react";
import type { Liff } from "@line/liff";

type LiffContextType = {
  liff: Liff | null;
  profile: Awaited<ReturnType<Liff["getProfile"]>> | null;
  ready: boolean;
  error: string | null;
};

const LiffContext = createContext<LiffContextType>({
  liff: null,
  profile: null,
  ready: false,
  error: null,
});

export function useLiff() {
  return useContext(LiffContext);
}

export function LiffProvider({ children }: { children: React.ReactNode }) {
  const [liff, setLiff] = useState<Liff | null>(null);
  const [profile, setProfile] = useState<Awaited<ReturnType<Liff["getProfile"]>> | null>(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function init() {
      try {
        const liffModule = await import("@line/liff");
        const liff = liffModule.default;

        const liffId = process.env.NEXT_PUBLIC_LIFF_ID || process.env.LIFF_ID;
        if (!liffId || liffId === "dummy_liff_id") {
          setError("LIFF ID not configured");
          setReady(true);
          return;
        }

        await liff.init({ liffId });

        if (!mounted) return;

        setLiff(liff);

        if (liff.isLoggedIn()) {
          const profile = await liff.getProfile();
          setProfile(profile);
        }

        setReady(true);
      } catch (err) {
        console.error("LIFF init error:", err);
        if (mounted) {
          setError("Failed to initialize LIFF");
          setReady(true);
        }
      }
    }

    init();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <LiffContext.Provider value={{ liff, profile, ready, error }}>
      {children}
    </LiffContext.Provider>
  );
}
