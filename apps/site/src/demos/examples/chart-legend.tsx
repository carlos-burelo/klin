import type { LegendItem } from "@carlos-burelo/klin";
import { ChartLegend } from "@carlos-burelo/klin";
import { DemoExample } from "../../components/docs/demo-example";

const canalesItems: LegendItem[] = [
  { label: "Tienda física", color: "var(--chart-1)" },
  { label: "En línea", color: "var(--chart-2)" },
  { label: "Mayoreo", color: "var(--chart-3)" },
  { label: "Exportación", color: "var(--chart-4)" },
];

const estadosItems: LegendItem[] = [
  { label: "Enlace activo", color: "var(--chart-2)" },
  { label: "Degradado", color: "var(--chart-3)" },
  { label: "Caído", color: "var(--destructive)" },
];

export default function ChartLegendExamples() {
  return (
    <div className="flex flex-col gap-6">
      <DemoExample
        caption="leyenda de cuatro canales de venta"
        code={`import { ChartLegend } from "@carlos-burelo/klin";

const items = [
  { label: "Tienda física", color: "var(--chart-1)" },
  { label: "En línea", color: "var(--chart-2)" },
  { label: "Mayoreo", color: "var(--chart-3)" },
  { label: "Exportación", color: "var(--chart-4)" },
];

<ChartLegend items={items} />`}
      >
        <ChartLegend items={canalesItems} />
      </DemoExample>
      <DemoExample
        caption="leyenda de estados de enlace con colores semánticos"
        code={`import { ChartLegend } from "@carlos-burelo/klin";

const items = [
  { label: "Enlace activo", color: "var(--chart-2)" },
  { label: "Degradado", color: "var(--chart-3)" },
  { label: "Caído", color: "var(--destructive)" },
];

<ChartLegend items={items} />`}
      >
        <ChartLegend items={estadosItems} />
      </DemoExample>
    </div>
  );
}
