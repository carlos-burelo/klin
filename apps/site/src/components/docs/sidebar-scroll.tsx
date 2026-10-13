"use client";

import { type ReactNode, useEffect, useRef } from "react";

const KEY = "klin-docs-sidebar-scroll";

/**
 * Contenedor del sidebar que conserva su scroll entre navegaciones
 * (sessionStorage). Con 74 entradas, perder la posición del índice
 * al cambiar de doc es un fastidio real.
 */
export function SidebarScroll({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    try {
      const saved = sessionStorage.getItem(KEY);
      if (saved) el.scrollTop = Number(saved);
    } catch {
      // Sin almacenamiento: el sidebar arranca arriba.
    }
    function save() {
      try {
        sessionStorage.setItem(KEY, String(el?.scrollTop ?? 0));
      } catch {
        // Sin almacenamiento: nada que persistir.
      }
    }
    el.addEventListener("scroll", save, { passive: true });
    return () => el.removeEventListener("scroll", save);
  }, []);

  return (
    <div
      ref={ref}
      className="sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto pb-10"
    >
      {children}
    </div>
  );
}
