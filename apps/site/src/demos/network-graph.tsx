import type { NetworkEdge, NetworkNode } from "@carlos-burelo/klin";
import { ChartTooltipPortal, NetworkGraph } from "@carlos-burelo/klin";

const nodes: NetworkNode[] = [
  { id: "web", label: "Tienda web" },
  { id: "api", label: "API pedidos" },
  { id: "auth", label: "Autenticación" },
  { id: "db", label: "Base de datos" },
  { id: "cache", label: "Caché" },
  { id: "worker", label: "Cola de envíos" },
];

const edges: NetworkEdge[] = [
  { from: "web", to: "api" },
  { from: "web", to: "auth" },
  { from: "api", to: "db" },
  { from: "api", to: "cache" },
  { from: "api", to: "worker" },
  { from: "worker", to: "db" },
];

export default function NetworkGraphDemo() {
  return (
    <ChartTooltipPortal>
      <NetworkGraph
        nodes={nodes}
        edges={edges}
        seed={7}
        ariaLabel="Grafo de dependencias entre servicios de la tienda"
      />
    </ChartTooltipPortal>
  );
}
