import type { TopoEdge, TopoNode } from "@carlos-burelo/klin";
import { ChartTooltipPortal, NetworkTopology } from "@carlos-burelo/klin";

const nodes: TopoNode[] = [
  { id: "inet", label: "Internet", role: "internet" },
  { id: "fw", label: "Firewall perimetral", sub: "10.0.0.1", role: "firewall" },
  { id: "r1", label: "Router núcleo", sub: "10.0.1.1", role: "router" },
  { id: "sw", label: "Switch piso 2", sub: "10.0.2.1", role: "switch" },
  { id: "api", label: "Servidor API", sub: "10.0.2.10", role: "server" },
  { id: "db", label: "Servidor BD", sub: "10.0.2.11", role: "server" },
  { id: "pc", label: "PC contabilidad", sub: "10.0.2.40", role: "host" },
];

const edges: TopoEdge[] = [
  { from: "inet", to: "fw", label: "Fibra 1 Gb" },
  { from: "fw", to: "r1" },
  { from: "r1", to: "sw" },
  { from: "sw", to: "api" },
  { from: "sw", to: "db" },
  { from: "sw", to: "pc", status: "degraded" },
];

export default function NetworkTopologyDemo() {
  return (
    <ChartTooltipPortal>
      <NetworkTopology
        nodes={nodes}
        edges={edges}
        ariaLabel="Topología de la red corporativa de la matriz"
      />
    </ChartTooltipPortal>
  );
}
