import type { WardleyEdge, WardleyNode } from "@carlos-burelo/klin";
import { ChartTooltipPortal, WardleyMap } from "@carlos-burelo/klin";

const nodes: WardleyNode[] = [
  { id: "portal", label: "Portal ciudadano", x: 0.72, y: 0.92 },
  { id: "citas", label: "Motor de citas", x: 0.55, y: 0.68 },
  { id: "api", label: "API de trámites", x: 0.48, y: 0.5 },
  { id: "compute", label: "Cómputo", x: 0.82, y: 0.28 },
  { id: "datos", label: "Base de datos", x: 0.86, y: 0.14 },
];

const edges: WardleyEdge[] = [
  { from: "portal", to: "citas" },
  { from: "citas", to: "api" },
  { from: "api", to: "compute" },
  { from: "api", to: "datos" },
];

export default function WardleyMapDemo() {
  return (
    <ChartTooltipPortal>
      <WardleyMap
        nodes={nodes}
        edges={edges}
        ariaLabel="Mapa Wardley de la plataforma de trámites digitales"
      />
    </ChartTooltipPortal>
  );
}
