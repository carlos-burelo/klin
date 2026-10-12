/**
 * klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE).
 */
"use client";

import type { FocusEvent, MouseEvent, ReactNode, TouchEvent } from "react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  TOOLTIP_HEIGHT,
  TOOLTIP_MARGIN_PX,
  TOOLTIP_OFFSET,
  TOOLTIP_WIDTH,
} from "../lib/theme";

type Tip = {
  x: number;
  y: number;
  text: string;
};

export type ChartTooltipPortalProps = {
  children: ReactNode;
  className?: string;
  /** Desplazamiento del tooltip respecto al cursor. */
  offset?: number;
};

/**
 * Único `"use client"` del paquete: tooltip rico por portal con el mínimo JS.
 *
 * Las gráficas son SSR puras y marcan cada forma con `data-chart-tip` + `<title>`.
 * Este wrapper delega eventos y pinta el texto en un portal a `document.body`
 * (evita recortes por `overflow-hidden` de las Cards). Sin JS sigue habiendo
 * `<title>` nativo. Estilo Tailwind del tema (`bg-popover`, `ring-1`, `shadow-xs`).
 */
export function ChartTooltipPortal({
  children,
  className,
  offset = TOOLTIP_OFFSET,
}: ChartTooltipPortalProps) {
  const [tip, setTip] = useState<Tip | null>(null);
  const [mounted, setMounted] = useState(false);
  const raf = useRef(0);
  const pending = useRef<Tip | null>(null);

  useEffect(() => {
    setMounted(true);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, []);

  useEffect(() => {
    if (!tip) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setTip(null);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [tip]);

  function schedule(next: Tip | null) {
    if (!next) {
      if (raf.current) cancelAnimationFrame(raf.current);
      raf.current = 0;
      pending.current = null;
      setTip(null);
      return;
    }
    pending.current = next;
    if (raf.current) return;
    raf.current = requestAnimationFrame(() => {
      raf.current = 0;
      const p = pending.current;
      pending.current = null;
      if (p) setTip(p);
    });
  }

  function tipFromElement(holder: Element | null, x: number, y: number): void {
    const text = holder?.getAttribute("data-chart-tip");
    if (!text) {
      schedule(null);
      return;
    }
    schedule({ x, y, text });
  }

  function onMove(event: MouseEvent<HTMLDivElement>) {
    const target = event.target as HTMLElement | null;
    tipFromElement(
      target?.closest?.("[data-chart-tip]") ?? null,
      event.clientX,
      event.clientY,
    );
  }

  function onFocusCapture(event: FocusEvent<HTMLDivElement>) {
    const target = event.target as HTMLElement | null;
    const holder = target?.closest?.("[data-chart-tip]");
    if (!holder) return;
    const rect = holder.getBoundingClientRect();
    tipFromElement(holder, rect.left + rect.width / 2, rect.top);
  }

  function onBlurCapture() {
    schedule(null);
  }

  function onTouchStart(event: TouchEvent<HTMLDivElement>) {
    const target = event.target as HTMLElement | null;
    const holder = target?.closest?.("[data-chart-tip]");
    const touch = event.touches[0];
    if (!holder || !touch) return;
    tipFromElement(holder, touch.clientX, touch.clientY);
  }

  const canWindow = typeof window !== "undefined";
  const left =
    tip && canWindow
      ? Math.max(
          TOOLTIP_MARGIN_PX,
          Math.min(tip.x + offset, window.innerWidth - TOOLTIP_WIDTH),
        )
      : 0;
  // Voltea arriba si no cabe abajo.
  const top =
    tip && canWindow
      ? tip.y + offset + TOOLTIP_HEIGHT > window.innerHeight
        ? Math.max(TOOLTIP_MARGIN_PX, tip.y - offset - TOOLTIP_HEIGHT)
        : Math.min(tip.y + offset, window.innerHeight - TOOLTIP_HEIGHT)
      : 0;

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: delegación de hover/focus para tooltip; a11y cubierta por <title> en cada forma
    <div
      className={className ? `relative ${className}` : "relative"}
      onMouseMove={onMove}
      onMouseLeave={() => schedule(null)}
      onFocusCapture={onFocusCapture}
      onBlurCapture={onBlurCapture}
      onTouchStart={onTouchStart}
    >
      {children}
      {mounted && tip
        ? createPortal(
            <div
              role="tooltip"
              className="pointer-events-none fixed z-50 max-w-60 rounded-lg bg-popover px-2.5 py-1.5 text-xs text-popover-foreground shadow-xs ring-1 ring-border"
              style={{ left, top }}
            >
              {tip.text}
            </div>,
            document.body,
          )
        : null}
    </div>
  );
}
