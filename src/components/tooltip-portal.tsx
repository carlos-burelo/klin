"use client";

import type { MouseEvent, ReactNode } from "react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

type Tip = {
  x: number;
  y: number;
  text: string;
};

/**
 * Único `"use client"` del paquete: tooltip rico por portal con el mínimo JS.
 *
 * Las gráficas son SSR puras y marcan cada forma con `data-chart-tip` + `<title>`.
 * Este wrapper delega un `mousemove` y pinta el texto en un portal a `document.body`
 * (evita recortes por `overflow-hidden` de las Cards). Sin JS sigue habiendo
 * `<title>` nativo. Estilo Tailwind del tema (`bg-popover`, `ring-1`, `shadow-xs`).
 */
export function ChartTooltipPortal({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const [tip, setTip] = useState<Tip | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  function onMove(event: MouseEvent<HTMLDivElement>) {
    const target = event.target as HTMLElement | null;
    const holder = target?.closest?.("[data-chart-tip]");
    const text = holder?.getAttribute("data-chart-tip");
    if (!text) {
      setTip(null);
      return;
    }
    setTip({ x: event.clientX, y: event.clientY, text });
  }

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: delegación de hover para tooltip; a11y cubierta por <title> en cada forma
    <div
      className={className ?? "relative"}
      onMouseMove={onMove}
      onMouseLeave={() => setTip(null)}
    >
      {children}
      {mounted && tip
        ? createPortal(
            <div
              role="tooltip"
              className="pointer-events-none fixed z-50 max-w-60 rounded-lg bg-popover px-2.5 py-1.5 text-xs text-popover-foreground shadow-xs ring-1 ring-border"
              style={{
                left: Math.min(tip.x + 12, window.innerWidth - 240),
                top: Math.min(tip.y + 12, window.innerHeight - 80),
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
