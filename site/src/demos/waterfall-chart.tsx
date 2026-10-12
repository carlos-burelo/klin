import type { WaterfallStep } from "@carlos-burelo/klin";
import { ChartTooltipPortal, WaterfallChart } from "@carlos-burelo/klin";

const steps: WaterfallStep[] = [
  { label: "Saldo inicial", value: 120 },
  { label: "Recaudación", value: 85 },
  { label: "Nómina", value: -60 },
  { label: "Obra", value: -45 },
  { label: "Servicios", value: -20 },
];

function formatY(value: number): string {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function WaterfallChartDemo() {
  return (
    <ChartTooltipPortal>
      <WaterfallChart
        steps={steps}
        totalLabel="Saldo final"
        ariaLabel="Evolución del saldo presupuestal durante 2026"
        formatY={formatY}
      />
    </ChartTooltipPortal>
  );
}
