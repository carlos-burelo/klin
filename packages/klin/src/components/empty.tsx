/**
 * klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE).
 */

/** Título vacío homogéneo (una sola fuente, i18n futuro por prop). */
export const EMPTY_TITLE = "Sin datos todavía";

export type ChartEmptyProps = {
  title?: string;
  description?: string;
};

/** Estado vacío homogéneo para todas las gráficas (SSR, sin JS). */
export function ChartEmpty({
  title = EMPTY_TITLE,
  description,
}: ChartEmptyProps) {
  return (
    // biome-ignore lint/a11y/useSemanticElements: estado vacío, no salida de formulario; div+status es el patrón correcto
    <div
      role="status"
      className="flex flex-col items-center justify-center gap-1 py-10 text-center"
    >
      <p className="text-sm font-medium">{title}</p>
      {description ? (
        <p className="max-w-sm text-sm text-muted-foreground">{description}</p>
      ) : null}
    </div>
  );
}
