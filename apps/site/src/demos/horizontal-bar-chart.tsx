/**
 * Demo Barras horizontales del site (no se publica en el bundle de la lib).
 */
import { ChartTooltipPortal, HorizontalBarChart } from "@carlos-burelo/klin";

export default function HorizontalBarChartDemo() {
  return (
    <ChartTooltipPortal>
      <HorizontalBarChart
        ariaLabel="Barras horizontales de matrícula por turno"
        data={[
          { matutino: 320, turno: "Primaria", vespertino: 210 },
          { matutino: 280, turno: "Secundaria", vespertino: 260 },
          { matutino: 190, turno: "Preparatoria", vespertino: 230 },
          { matutino: 150, turno: "Universidad", vespertino: 170 },
        ]}
        formatX={(v: number) => new Intl.NumberFormat("es-MX").format(v)}
        series={[
          { key: "matutino", label: "Matutino" },
          { key: "vespertino", label: "Vespertino" },
        ]}
        yKey="turno"
      />
    </ChartTooltipPortal>
  );
}
