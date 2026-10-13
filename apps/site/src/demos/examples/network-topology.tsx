import type { TopoEdge, TopoNode } from "@carlos-burelo/klin";
import { NetworkTopology } from "@carlos-burelo/klin";
import { DemoExample } from "../../components/docs/demo-example";

const sucursalNodes: TopoNode[] = [
  { id: "inet", label: "Internet", role: "internet" },
  { id: "fw", label: "Firewall", sub: "10.1.0.1", role: "firewall" },
  { id: "r1", label: "Router", sub: "10.1.1.1", role: "router" },
  { id: "sw", label: "Switch", sub: "10.1.2.1", role: "switch" },
  { id: "caja", label: "Caja 1", sub: "10.1.2.20", role: "host" },
];

const sucursalEdges: TopoEdge[] = [
  { from: "inet", to: "fw", label: "Fibra 500 Mb" },
  { from: "fw", to: "r1" },
  { from: "r1", to: "sw" },
  { from: "sw", to: "caja", status: "degraded" },
];

const campusNodes: TopoNode[] = [
  { id: "nube", label: "Nube escolar", role: "cloud" },
  { id: "fw", label: "Firewall", sub: "192.168.0.1", role: "firewall" },
  { id: "srv", label: "Servidor Moodle", sub: "192.168.1.10", role: "server" },
  { id: "aula", label: "Aula 3", sub: "192.168.1.40", role: "host" },
  { id: "taller", label: "Taller", sub: "192.168.1.41", role: "host" },
];

const campusEdges: TopoEdge[] = [
  { from: "nube", to: "fw" },
  { from: "fw", to: "srv", label: "VPN" },
  { from: "srv", to: "aula" },
  { from: "srv", to: "taller", label: "Cableado", status: "down" },
];

export default function NetworkTopologyExamples() {
  return (
    <div className="flex flex-col gap-6">
      <DemoExample
        caption="sucursal vertical con un enlace degradado"
        code={`import { NetworkTopology } from "@carlos-burelo/klin";

const nodes = [
  { id: "inet", label: "Internet", role: "internet" },
  { id: "fw", label: "Firewall", sub: "10.1.0.1", role: "firewall" },
  { id: "r1", label: "Router", sub: "10.1.1.1", role: "router" },
  { id: "sw", label: "Switch", sub: "10.1.2.1", role: "switch" },
  { id: "caja", label: "Caja 1", sub: "10.1.2.20", role: "host" },
];

const edges = [
  { from: "inet", to: "fw", label: "Fibra 500 Mb" },
  { from: "fw", to: "r1" },
  { from: "r1", to: "sw" },
  { from: "sw", to: "caja", status: "degraded" },
];

<NetworkTopology
  ariaLabel="Topología vertical de red de sucursal con enlace degradado"
  nodes={nodes}
  edges={edges}
  direction="TB"
/>`}
      >
        <NetworkTopology
          ariaLabel="Topología vertical de red de sucursal con enlace degradado"
          nodes={sucursalNodes}
          edges={sucursalEdges}
          direction="TB"
        />
      </DemoExample>
      <DemoExample
        caption="campus horizontal en la nube con un enlace caído"
        code={`import { NetworkTopology } from "@carlos-burelo/klin";

const nodes = [
  { id: "nube", label: "Nube escolar", role: "cloud" },
  { id: "fw", label: "Firewall", sub: "192.168.0.1", role: "firewall" },
  { id: "srv", label: "Servidor Moodle", sub: "192.168.1.10", role: "server" },
  { id: "aula", label: "Aula 3", sub: "192.168.1.40", role: "host" },
  { id: "taller", label: "Taller", sub: "192.168.1.41", role: "host" },
];

const edges = [
  { from: "nube", to: "fw" },
  { from: "fw", to: "srv", label: "VPN" },
  { from: "srv", to: "aula" },
  { from: "srv", to: "taller", label: "Cableado", status: "down" },
];

<NetworkTopology
  ariaLabel="Topología horizontal de campus con enlace caído al taller"
  nodes={nodes}
  edges={edges}
  direction="LR"
/>`}
      >
        <NetworkTopology
          ariaLabel="Topología horizontal de campus con enlace caído al taller"
          nodes={campusNodes}
          edges={campusEdges}
          direction="LR"
        />
      </DemoExample>
    </div>
  );
}
