/**
 * klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE).
 */
"use client";

import type { FocusEvent, MouseEvent, ReactNode, TouchEvent } from "react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { toNumber } from "../core/number";
import {
  TOOLTIP_HEIGHT,
  TOOLTIP_MARGIN_PX,
  TOOLTIP_OFFSET,
  TOOLTIP_WIDTH,
} from "../core/theme";

type Tip = {
  x: number;
  y: number;
  text: string;
};

/** Retardo por defecto de aparición (ms). */
const TOOLTIP_DEFAULT_DELAY = 0;

export type ChartTooltipPortalProps = {
  children: ReactNode;
  className?: string;
  /** Desplazamiento del tooltip respecto al cursor. */
  offset?: number;
  /** Retardo de aparición en ms. */
  delay?: number;
  /** Ancho máximo del tooltip en px. */
  maxWidth?: number;
};

/**
 * Único `"use client"` del paquete: tooltip rico por portal con el mínimo JS.
 *
 * Las gráficas son SSR puras y marcan cada forma con `data-chart-tip` (única
 * fuente de hover: `<title>` prohibido en todo src, ni formas ni raíces,
 * así no hay tooltip nativo que estorbe). Este wrapper delega eventos y
 * pinta el texto en un portal a `document.body` (evita recortes por
 * `overflow-hidden` de las Cards). Sin JS no hay hover rico; el svg se
 * nombra solo con `aria-label` (a11y).
 * Caja del tooltip autocontenida (vars del contrato klin con fallback,
 * sin depender del tema del consumidor).
 */
export function ChartTooltipPortal({
  children,
  className,
  offset = TOOLTIP_OFFSET,
  delay = TOOLTIP_DEFAULT_DELAY,
  maxWidth = TOOLTIP_WIDTH,
}: ChartTooltipPortalProps) {
  const [tip, setTip] = useState<Tip | null>(null);
  const [mounted, setMounted] = useState(false);
  const raf = useRef(0);
  const pending = useRef<Tip | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | 0>(0);
  const effectiveDelay = Math.max(0, Math.floor(toNumber(delay)));
  const effectiveMaxWidth = Math.max(1, Math.floor(toNumber(maxWidth)));
  const customMaxWidth = effectiveMaxWidth !== TOOLTIP_WIDTH;

  useEffect(() => {
    setMounted(true);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
      if (timer.current) clearTimeout(timer.current);
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
      if (timer.current) clearTimeout(timer.current);
      timer.current = 0;
      pending.current = null;
      setTip(null);
      return;
    }
    pending.current = next;
    if (raf.current || timer.current) return;
    if (effectiveDelay > 0) {
      timer.current = setTimeout(() => {
        timer.current = 0;
        if (raf.current) return;
        raf.current = requestAnimationFrame(() => {
          raf.current = 0;
          const p = pending.current;
          pending.current = null;
          if (p) setTip(p);
        });
      }, effectiveDelay);
      return;
    }
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
          Math.min(tip.x + offset, window.innerWidth - effectiveMaxWidth),
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
    // biome-ignore lint/a11y/noStaticElementInteractions: delegación de hover/focus para tooltip; a11y por aria-label + <title> raíz del svg
    <div
      className={className ? `relative ${className}` : "relative"}
      data-tooltip-delay={effectiveDelay > 0 ? effectiveDelay : undefined}
      data-tooltip-max-width={customMaxWidth ? effectiveMaxWidth : undefined}
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
              className="pointer-events-none fixed z-50"
              style={{
                left,
                top,
                maxWidth: effectiveMaxWidth,
                // Superficie autocontenida: vars del contrato klin con
                // fallback (`--popover` es del consumidor, no exigido).
                backgroundColor: "var(--popover, var(--card))",
                color: "var(--popover-foreground, var(--foreground))",
                border: "1px solid var(--border)",
                borderRadius: "8px",
                padding: "6px 10px",
                fontSize: "12px",
                lineHeight: "1.4",
                fontVariantNumeric: "tabular-nums",
                whiteSpace: "normal",
                overflowWrap: "break-word",
                boxShadow: "0 4px 12px rgb(0 0 0 / 0.15)",
              }}
            >
              {tip.text}
            </div>,
            document.body,
          )
        : null}
    </div>
  );
}
