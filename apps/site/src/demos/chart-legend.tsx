import type { LegendItem } from "@carlos-burelo/klin";
import { ChartLegend } from "@carlos-burelo/klin";

const items: LegendItem[] = [
  { label: "Tienda física", color: "var(--chart-1)" },
  { label: "En línea", color: "var(--chart-2)" },
  { label: "Mayoreo", color: "var(--chart-3)" },
  { label: "Exportación", color: "var(--chart-4)" },
];

export default function ChartLegendDemo() {
  return <ChartLegend items={items} />;
}
