import type { WardleyEdge, WardleyNode } from "@carlos-burelo/klin";
import { WardleyMap } from "@carlos-burelo/klin";
import { DemoExample } from "../../components/docs/demo-example";

const comedorNodes: WardleyNode[] = [
  { id: "menu", label: "Menú del día", x: 0.25, y: 0.92 },
  { id: "cocina", label: "Cocina", x: 0.4, y: 0.62 },
  { id: "insumos", label: "Insumos frescos", x: 0.55, y: 0.4 },
  { id: "gas", label: "Gas LP", x: 0.88, y: 0.15 },
];

const comedorEdges: WardleyEdge[] = [
  { from: "menu", to: "cocina" },
  { from: "cocina", to: "insumos" },
  { from: "cocina", to: "gas" },
];

const libreriaNodes: WardleyNode[] = [
  {
    id: "app",
    label: "App de lectura",
    x: 0.3,
    y: 0.9,
    color: "var(--chart-1)",
  },
  {
    id: "catalogo",
    label: "Catálogo",
    x: 0.5,
    y: 0.65,
    color: "var(--chart-2)",
  },
  {
    id: "pago",
    label: "Pasarela de pago",
    x: 0.8,
    y: 0.4,
    color: "var(--chart-3)",
  },
  {
    id: "nube",
    label: "Almacén en nube",
    x: 0.9,
    y: 0.2,
    color: "var(--chart-4)",
  },
];

const libreriaEdges: WardleyEdge[] = [
  { from: "app", to: "catalogo" },
  { from: "catalogo", to: "pago" },
  { from: "catalogo", to: "nube" },
];

export default function WardleyMapExamples() {
  return (
    <div className="flex flex-col gap-6">
      <DemoExample
        caption="cadena de valor de comedor comunitario"
        code={`import { WardleyMap } from "@carlos-burelo/klin";

const nodes = [
  { id: "menu", label: "Menú del día", x: 0.25, y: 0.92 },
  { id: "cocina", label: "Cocina", x: 0.4, y: 0.62 },
  { id: "insumos", label: "Insumos frescos", x: 0.55, y: 0.4 },
  { id: "gas", label: "Gas LP", x: 0.88, y: 0.15 },
];

const edges = [
  { from: "menu", to: "cocina" },
  { from: "cocina", to: "insumos" },
  { from: "cocina", to: "gas" },
];

<WardleyMap
  ariaLabel="Mapa Wardley del comedor comunitario"
  nodes={nodes}
  edges={edges}
/>`}
      >
        <WardleyMap
          ariaLabel="Mapa Wardley del comedor comunitario"
          nodes={comedorNodes}
          edges={comedorEdges}
        />
      </DemoExample>
      <DemoExample
        caption="librería digital con colores por componente"
        code={`import { WardleyMap } from "@carlos-burelo/klin";

const nodes = [
  {
    id: "app",
    label: "App de lectura",
    x: 0.3,
    y: 0.9,
    color: "var(--chart-1)",
  },
  {
    id: "catalogo",
    label: "Catálogo",
    x: 0.5,
    y: 0.65,
    color: "var(--chart-2)",
  },
  {
    id: "pago",
    label: "Pasarela de pago",
    x: 0.8,
    y: 0.4,
    color: "var(--chart-3)",
  },
  {
    id: "nube",
    label: "Almacén en nube",
    x: 0.9,
    y: 0.2,
    color: "var(--chart-4)",
  },
];

const edges = [
  { from: "app", to: "catalogo" },
  { from: "catalogo", to: "pago" },
  { from: "catalogo", to: "nube" },
];

<WardleyMap
  ariaLabel="Mapa Wardley de librería digital con colores por componente"
  nodes={nodes}
  edges={edges}
/>`}
      >
        <WardleyMap
          ariaLabel="Mapa Wardley de librería digital con colores por componente"
          nodes={libreriaNodes}
          edges={libreriaEdges}
        />
      </DemoExample>
    </div>
  );
}
