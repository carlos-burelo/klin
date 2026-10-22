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

const estresNodesT: TopoNode[] = [
  { id: "t-inet", label: "Internet", role: "internet" },
  { id: "t-fw", label: "Firewall", sub: "10.0.0.1", role: "firewall" },
  { id: "t-r1", label: "Router 1", sub: "10.0.1.1", role: "router" },
  { id: "t-r2", label: "Router 2", sub: "10.0.1.2", role: "router" },
  { id: "t-sw1", label: "Switch A", sub: "10.0.2.1", role: "switch" },
  { id: "t-sw2", label: "Switch B", sub: "10.0.2.2", role: "switch" },
  { id: "t-srv", label: "Servidor", sub: "10.0.3.10", role: "server" },
  { id: "t-nas", label: "NAS", sub: "10.0.3.11", role: "server" },
  { id: "t-nube", label: "Respaldo nube", role: "cloud" },
  { id: "t-pc1", label: "Caja 1", sub: "10.0.4.20", role: "host" },
  { id: "t-pc2", label: "Caja 2", sub: "10.0.4.21", role: "host" },
  { id: "t-pc3", label: "Oficina", sub: "10.0.4.22", role: "host" },
];

const estresEdgesT: TopoEdge[] = [
  { from: "t-inet", to: "t-fw", label: "Fibra" },
  { from: "t-fw", to: "t-r1" },
  { from: "t-fw", to: "t-r2" },
  { from: "t-r1", to: "t-sw1" },
  { from: "t-r2", to: "t-sw2" },
  { from: "t-sw1", to: "t-sw2", label: "Troncal" },
  { from: "t-sw1", to: "t-srv" },
  { from: "t-sw2", to: "t-nas" },
  { from: "t-srv", to: "t-nas", label: "Réplica" },
  { from: "t-srv", to: "t-nube", label: "Backup" },
  { from: "t-sw1", to: "t-pc1" },
  { from: "t-sw1", to: "t-pc2", status: "degraded" },
  { from: "t-sw2", to: "t-pc3" },
  { from: "t-r1", to: "t-r2", label: "HSRP", status: "down" },
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
      <DemoExample
        caption="misma sucursal con leyenda de roles de equipo"
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
  ariaLabel="Topología de sucursal con leyenda de roles"
  nodes={nodes}
  edges={edges}
  direction="TB"
  roleLegend
/>`}
      >
        <NetworkTopology
          ariaLabel="Topología de sucursal con leyenda de roles"
          nodes={sucursalNodes}
          edges={sucursalEdges}
          direction="TB"
          roleLegend
        />
      </DemoExample>
      <DemoExample
        caption="estrés con 12 equipos, malla de respaldo y enlaces mixtos"
        code={`import { NetworkTopology } from "@carlos-burelo/klin";

const nodes = [
  { id: "t-inet", label: "Internet", role: "internet" },
  { id: "t-fw", label: "Firewall", sub: "10.0.0.1", role: "firewall" },
  { id: "t-r1", label: "Router 1", sub: "10.0.1.1", role: "router" },
  { id: "t-r2", label: "Router 2", sub: "10.0.1.2", role: "router" },
  { id: "t-sw1", label: "Switch A", sub: "10.0.2.1", role: "switch" },
  { id: "t-sw2", label: "Switch B", sub: "10.0.2.2", role: "switch" },
  { id: "t-srv", label: "Servidor", sub: "10.0.3.10", role: "server" },
  { id: "t-nas", label: "NAS", sub: "10.0.3.11", role: "server" },
  { id: "t-nube", label: "Respaldo nube", role: "cloud" },
  { id: "t-pc1", label: "Caja 1", sub: "10.0.4.20", role: "host" },
  { id: "t-pc2", label: "Caja 2", sub: "10.0.4.21", role: "host" },
  { id: "t-pc3", label: "Oficina", sub: "10.0.4.22", role: "host" },
];

const edges = [
  { from: "t-inet", to: "t-fw", label: "Fibra" },
  { from: "t-fw", to: "t-r1" },
  { from: "t-fw", to: "t-r2" },
  { from: "t-r1", to: "t-sw1" },
  { from: "t-r2", to: "t-sw2" },
  { from: "t-sw1", to: "t-sw2", label: "Troncal" },
  { from: "t-sw1", to: "t-srv" },
  { from: "t-sw2", to: "t-nas" },
  { from: "t-srv", to: "t-nas", label: "Réplica" },
  { from: "t-srv", to: "t-nube", label: "Backup" },
  { from: "t-sw1", to: "t-pc1" },
  { from: "t-sw1", to: "t-pc2", status: "degraded" },
  { from: "t-sw2", to: "t-pc3" },
  { from: "t-r1", to: "t-r2", label: "HSRP", status: "down" },
];

<NetworkTopology
  ariaLabel="Topología densa de matriz con 12 equipos y respaldo"
  nodes={nodes}
  edges={edges}
  direction="LR"
/>`}
      >
        <NetworkTopology
          ariaLabel="Topología densa de matriz con 12 equipos y respaldo"
          nodes={estresNodesT}
          edges={estresEdgesT}
          direction="LR"
        />
      </DemoExample>
    </div>
  );
}
