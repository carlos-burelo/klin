/**
 * Demo Mapa de calor del site (no se publica en el bundle de la lib).
 */
import { ChartTooltipPortal, MatrixHeatmap } from "@carlos-burelo/klin";

export default function MatrixHeatmapDemo() {
  return (
    <ChartTooltipPortal>
      <MatrixHeatmap
        ariaLabel="Mapa de calor de asistencia por grupo y día"
        cols={["Lunes", "Martes", "Miércoles", "Jueves"]}
        format={(v: number) => new Intl.NumberFormat("es-MX").format(v)}
        rows={["Primero", "Segundo", "Tercero", "Cuarto"]}
        values={[
          [28, 30, 27, 29],
          [25, 26, 24, 27],
          [30, 29, 31, 28],
          [22, 24, 23, 25],
        ]}
      />
    </ChartTooltipPortal>
  );
}
