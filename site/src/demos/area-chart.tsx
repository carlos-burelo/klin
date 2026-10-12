/**
 * Demo Áreas del site (no se publica en el bundle de la lib).
 */
import { AreaChart, ChartTooltipPortal } from "@carlos-burelo/klin";

export default function AreaChartDemo() {
  return (
    <ChartTooltipPortal>
      <AreaChart
        ariaLabel="Gráfico de áreas de visitas por canal de enero a mayo"
        data={[
          { mes: "Ene", organico: 120, pauta: 80 },
          { mes: "Feb", organico: 150, pauta: 95 },
          { mes: "Mar", organico: 170, pauta: 110 },
          { mes: "Abr", organico: 160, pauta: 130 },
          { mes: "May", organico: 190, pauta: 140 },
        ]}
        xKey="mes"
        series={[
          { key: "organico", label: "Orgánico" },
          { key: "pauta", label: "Pauta" },
        ]}
      />
    </ChartTooltipPortal>
  );
}
