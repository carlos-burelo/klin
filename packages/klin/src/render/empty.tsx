/**
 * klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE).
 */
import type { ReactNode } from "react";

/** Título vacío homogéneo (una sola fuente, i18n futuro por prop). */
export const EMPTY_TITLE = "Sin datos todavía";

export type ChartEmptyProps = {
  title?: string;
  description?: string;
  /** Tamaño compacto para celdas (`sm`) o estándar (`md`). */
  size?: "sm" | "md";
  /** Glifo opcional sobre el título (sin romper SSR). */
  icon?: ReactNode;
};

/** Clases del contenedor según tamaño. */
const EMPTY_WRAP_CLS: Record<NonNullable<ChartEmptyProps["size"]>, string> = {
  sm: "flex flex-col items-center justify-center gap-0.5 py-4 text-center",
  md: "flex flex-col items-center justify-center gap-1 py-10 text-center",
};

/** Clases del título según tamaño. */
const EMPTY_TITLE_CLS: Record<NonNullable<ChartEmptyProps["size"]>, string> = {
  sm: "text-xs font-medium",
  md: "text-sm font-medium",
};

/** Estado vacío homogéneo para todas las gráficas (SSR, sin JS). */
export function ChartEmpty({
  title = EMPTY_TITLE,
  description,
  size = "md",
  icon,
}: ChartEmptyProps) {
  return (
    // biome-ignore lint/a11y/useSemanticElements: estado vacío, no salida de formulario; div+status es el patrón correcto
    <div role="status" className={EMPTY_WRAP_CLS[size]}>
      {icon ? <span aria-hidden="true">{icon}</span> : null}
      <p className={EMPTY_TITLE_CLS[size]}>{title}</p>
      {description ? (
        <p className="max-w-sm text-sm text-muted-foreground">{description}</p>
      ) : null}
    </div>
  );
}
