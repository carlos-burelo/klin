/**
 * Demo Carrera de puestos del site (no se publica en el bundle de la lib).
 */
import {
  BumpChart,
  type BumpSeries,
  ChartTooltipPortal,
} from "@carlos-burelo/klin";

const periods = ["2022", "2023", "2024", "2025"];

const series: BumpSeries[] = [
  { label: "América", ranks: [2, 1, 3, 1] },
  { label: "Tigres", ranks: [1, 3, 2, 2] },
  { label: "Monterrey", ranks: [3, 2, 1, 4] },
  { label: "Cruz Azul", ranks: [8, 5, 4, 3] },
  { label: "Chivas", ranks: [6, 4, 6, 5] },
];

export default function BumpChartDemo() {
  return (
    <ChartTooltipPortal>
      <BumpChart
        ariaLabel="Posición en tabla de clubes de Liga MX de 2022 a 2025, con América cerrando líder en 2025"
        periods={periods}
        series={series}
      />
    </ChartTooltipPortal>
  );
}
