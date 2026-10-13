/**
 * Demo Mancuernas del site (no se publica en el bundle de la lib).
 */
import { ChartTooltipPortal, DumbbellChart } from "@carlos-burelo/klin";

export default function DumbbellChartDemo() {
  return (
    <ChartTooltipPortal>
      <DumbbellChart
        ariaLabel="Precio por litro de gasolina Magna y Premium por ciudad, con la brecha más amplia en Monterrey"
        data={[
          { ciudad: "CDMX", magna: 22.9, premium: 24.85 },
          { ciudad: "Guadalajara", magna: 23.15, premium: 25.1 },
          { ciudad: "Monterrey", magna: 23.4, premium: 25.6 },
          { ciudad: "Puebla", magna: 22.75, premium: 24.6 },
          { ciudad: "Mérida", magna: 23.05, premium: 24.95 },
        ]}
        categoryKey="ciudad"
        aKey="magna"
        bKey="premium"
        aLabel="Magna"
        bLabel="Premium"
        formatX={(v: number) => `$${v.toFixed(2)}`}
      />
    </ChartTooltipPortal>
  );
}
