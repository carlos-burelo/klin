import type { TreemapNode } from "@carlos-burelo/klin";
import { ChartTooltipPortal, TreemapChart } from "@carlos-burelo/klin";

const data: TreemapNode[] = [
  {
    label: "Ingeniería",
    children: [
      { label: "Sistemas", value: 1240 },
      { label: "Civil", value: 860 },
      { label: "Mecatrónica", value: 540 },
    ],
  },
  {
    label: "Salud",
    children: [
      { label: "Medicina", value: 1510 },
      { label: "Enfermería", value: 920 },
      { label: "Nutrición", value: 410 },
    ],
  },
  {
    label: "Humanidades",
    children: [
      { label: "Derecho", value: 1080 },
      { label: "Educación", value: 760 },
    ],
  },
];

function format(value: number): string {
  return `${new Intl.NumberFormat("es-MX").format(Math.round(value))} estudiantes`;
}

export default function TreemapChartDemo() {
  return (
    <ChartTooltipPortal>
      <TreemapChart
        data={data}
        ariaLabel="Matrícula universitaria por división y carrera"
        format={format}
      />
    </ChartTooltipPortal>
  );
}
