import type { VennSet } from "@carlos-burelo/klin";
import { ChartTooltipPortal, VennDiagram } from "@carlos-burelo/klin";

const sets: [VennSet, VennSet, VennSet] = [
  { label: "Correo", value: 5200 },
  { label: "Mensaje de texto", value: 3800 },
  { label: "Aplicación móvil", value: 2900 },
];

const intersections = [
  { sets: [0, 1], value: 1450 },
  { sets: [0, 2], value: 980 },
  { sets: [1, 2], value: 760 },
  { sets: [0, 1, 2], value: 410 },
];

function format(value: number): string {
  return `${new Intl.NumberFormat("es-MX").format(Math.round(value))} personas`;
}

export default function VennDiagramDemo() {
  return (
    <ChartTooltipPortal>
      <VennDiagram
        sets={sets}
        intersections={intersections}
        ariaLabel="Traslape de canales de notificación usados por la ciudadanía"
        format={format}
      />
    </ChartTooltipPortal>
  );
}
