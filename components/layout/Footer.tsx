"use client";

import { useMemo } from "react";

export function Footer() {
  const currentYear = useMemo(() => new Date().getFullYear(), []);

  return (
    <footer className="mt-16 py-8 text-center">
      <div className="h-px w-full bg-linear-to-r from-transparent via-border to-transparent mb-8" />
      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/30">
        © {currentYear} — Powered by <span className="text-muted-foreground/60">Keen Enterprises</span>
      </p>
    </footer>
  );
}
