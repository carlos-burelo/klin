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

const mallaNodes: NetworkNode[] = Array.from({ length: 80 }, (_, i) => ({
  id: `n${i}`,
  label: `Nodo ${i + 1}`,
}));

const mallaEdges: NetworkEdge[] = Array.from({ length: 80 }, (_, i) => ({
  from: `n${i}`,
  to: `n${(i * 7 + 3) % 80}`,
}));

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
      <DemoExample
        caption="estrés: 80 nodos y 80 enlaces sin etiquetas y con semilla fija"
        code={`import { NetworkGraph } from "@carlos-burelo/klin";

const nodes = Array.from({ length: 80 }, (_, i) => ({
  id: \`n\${i}\`,
  label: \`Nodo \${i + 1}\`,
}));

const edges = Array.from({ length: 80 }, (_, i) => ({
  from: \`n\${i}\`,
  to: \`n\${(i * 7 + 3) % 80}\`,
}));

<NetworkGraph
  ariaLabel="Malla de 80 sensores con un enlace por nodo y semilla fija"
  nodes={nodes}
  edges={edges}
  seed={7}
  showLabels={false}
/>`}
      >
        <NetworkGraph
          ariaLabel="Malla de 80 sensores con un enlace por nodo y semilla fija"
          nodes={mallaNodes}
          edges={mallaEdges}
          seed={7}
          showLabels={false}
        />
      </DemoExample>
    </div>
  );
}
