import { ChartTooltipPortal, QuadrantChart } from "@carlos-burelo/klin";

/** Matriz esfuerzo-impacto de iniciativas del trimestre. */
export default function QuadrantChartDemo() {
  return (
    <ChartTooltipPortal>
      <QuadrantChart
        ariaLabel="Matriz de iniciativas según esfuerzo e impacto"
        quads={["Apuestas", "Ganancias rápidas", "Relleno", "Evitar"]}
        points={[
          { label: "Migración a la nube", x: 75, y: 85 },
          { label: "Chat de ayuda", x: 30, y: 80 },
          { label: "App móvil", x: 80, y: 45 },
          { label: "Reportes PDF", x: 25, y: 30 },
          { label: "Pagos con tarjeta", x: 60, y: 70 },
          { label: "Modo oscuro", x: 20, y: 55 },
        ]}
        xLabel="→ Esfuerzo"
        yLabel="↑ Impacto"
      />
    </ChartTooltipPortal>
  );
}
