import type { NetworkEdge, NetworkNode } from "@carlos-burelo/klin";
import { NetworkGraph } from "@carlos-burelo/klin";
import { DemoExample } from "../../components/docs/demo-example";

const bibliotecaNodes: NetworkNode[] = [
  { id: "catalogo", label: "Catálogo" },
  { id: "prestamos", label: "Préstamos" },
  { id: "socios", label: "Socios" },
  { id: "fichero", label: "Fichero" },
  { id: "avisos", label: "Avisos" },
];

const bibliotecaEdges: NetworkEdge[] = [
  { from: "catalogo", to: "prestamos" },
  { from: "prestamos", to: "socios" },
  { from: "prestamos", to: "fichero" },
  { from: "prestamos", to: "avisos" },
  { from: "avisos", to: "socios" },
];

const riegoNodes: NetworkNode[] = [
  { id: "bomba", label: "Bomba", color: "var(--chart-1)" },
  { id: "valvula-n", label: "Válvula norte", color: "var(--chart-3)" },
  { id: "valvula-s", label: "Válvula sur", color: "var(--chart-3)" },
  { id: "sensor", label: "Sensor", color: "var(--chart-4)" },
  { id: "tanque", label: "Tanque", color: "var(--chart-2)" },
];

const riegoEdges: NetworkEdge[] = [
  { from: "tanque", to: "bomba" },
  { from: "bomba", to: "valvula-n" },
  { from: "bomba", to: "valvula-s" },
  { from: "sensor", to: "bomba" },
];

export default function NetworkGraphExamples() {
  return (
    <div className="flex flex-col gap-6">
      <DemoExample
        caption="módulos de biblioteca con semilla fija de dibujo"
        code={`import { NetworkGraph } from "@carlos-burelo/klin";

const nodes = [
  { id: "catalogo", label: "Catálogo" },
  { id: "prestamos", label: "Préstamos" },
  { id: "socios", label: "Socios" },
  { id: "fichero", label: "Fichero" },
  { id: "avisos", label: "Avisos" },
];

const edges = [
  { from: "catalogo", to: "prestamos" },
  { from: "prestamos", to: "socios" },
  { from: "prestamos", to: "fichero" },
  { from: "prestamos", to: "avisos" },
  { from: "avisos", to: "socios" },
];

<NetworkGraph
  ariaLabel="Grafo de módulos del sistema de biblioteca"
  nodes={nodes}
  edges={edges}
  seed={7}
/>`}
      >
        <NetworkGraph
          ariaLabel="Grafo de módulos del sistema de biblioteca"
          nodes={bibliotecaNodes}
          edges={bibliotecaEdges}
          seed={7}
        />
      </DemoExample>
      <DemoExample
        caption="riego con colores por equipo y otra semilla"
        code={`import { NetworkGraph } from "@carlos-burelo/klin";

const nodes = [
  { id: "bomba", label: "Bomba", color: "var(--chart-1)" },
  { id: "valvula-n", label: "Válvula norte", color: "var(--chart-3)" },
  { id: "valvula-s", label: "Válvula sur", color: "var(--chart-3)" },
  { id: "sensor", label: "Sensor", color: "var(--chart-4)" },
  { id: "tanque", label: "Tanque", color: "var(--chart-2)" },
];

const edges = [
  { from: "tanque", to: "bomba" },
  { from: "bomba", to: "valvula-n" },
  { from: "bomba", to: "valvula-s" },
  { from: "sensor", to: "bomba" },
];

<NetworkGraph
  ariaLabel="Grafo de equipos del sistema de riego"
  nodes={nodes}
  edges={edges}
  seed={21}
/>`}
      >
        <NetworkGraph
          ariaLabel="Grafo de equipos del sistema de riego"
          nodes={riegoNodes}
          edges={riegoEdges}
          seed={21}
        />
      </DemoExample>
    </div>
  );
}
