import { ChartTooltipPortal, PyramidChart } from "@carlos-burelo/klin";

/** Pirámide poblacional por grupo de edad (miles de habitantes). */
export default function PyramidChartDemo() {
  return (
    <ChartTooltipPortal>
      <PyramidChart
        ariaLabel="Pirámide poblacional de México por grupo de edad y sexo"
        groups={[
          "0-9",
          "10-19",
          "20-29",
          "30-39",
          "40-49",
          "50-59",
          "60-69",
          "70 o más",
        ]}
        left={{
          label: "Hombres",
          values: [10500, 10200, 9800, 8900, 7400, 5800, 3600, 2100],
        }}
        right={{
          label: "Mujeres",
          values: [10200, 10000, 9900, 9100, 7700, 6200, 4000, 2600],
        }}
      />
    </ChartTooltipPortal>
  );
}
