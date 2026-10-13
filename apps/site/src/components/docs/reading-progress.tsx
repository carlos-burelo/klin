"use client";

import { useEffect, useState } from "react";

/** Barra fina de progreso de lectura (solo docs, cero layout shift). */
export function ReadingProgress() {
  const [pct, setPct] = useState(0);

  useEffect(() => {
    function onScroll() {
      const el = document.documentElement;
      const max = el.scrollHeight - el.clientHeight;
      setPct(max > 0 ? Math.min(1, el.scrollTop / max) : 0);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-50 h-0.5 bg-transparent"
    >
      <div
        className="h-full bg-primary transition-[width]"
        style={{ width: `${Math.round(pct * 100)}%` }}
      />
    </div>
  );
}
