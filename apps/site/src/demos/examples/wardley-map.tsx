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

const estresNodesW: WardleyNode[] = [
  { id: "w-portal", label: "Portal", x: 0.2, y: 0.95 },
  { id: "w-auth", label: "Identidad", x: 0.35, y: 0.8 },
  { id: "w-api", label: "API", x: 0.45, y: 0.68 },
  { id: "w-pagos", label: "Pagos", x: 0.62, y: 0.55 },
  { id: "w-cola", label: "Cola", x: 0.58, y: 0.42 },
  { id: "w-worker", label: "Worker", x: 0.7, y: 0.35 },
  { id: "w-cache", label: "Caché", x: 0.75, y: 0.28 },
  { id: "w-bd", label: "Base", x: 0.8, y: 0.22 },
  { id: "w-correo", label: "Correo", x: 0.85, y: 0.3 },
  { id: "w-cdn", label: "CDN", x: 0.9, y: 0.12 },
];

const estresEdgesW: WardleyEdge[] = [
  { from: "w-portal", to: "w-auth" },
  { from: "w-portal", to: "w-api" },
  { from: "w-api", to: "w-auth" },
  { from: "w-api", to: "w-pagos" },
  { from: "w-api", to: "w-cola" },
  { from: "w-cola", to: "w-worker" },
  { from: "w-worker", to: "w-correo" },
  { from: "w-worker", to: "w-bd" },
  { from: "w-api", to: "w-cache" },
  { from: "w-cache", to: "w-bd" },
  { from: "w-portal", to: "w-cdn" },
  { from: "w-api", to: "w-bd" },
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
      <DemoExample
        caption="mismo comedor con ejes renombrados y porcentaje entero"
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
  ariaLabel="Mapa Wardley del comedor con ejes propios y formato entero"
  nodes={nodes}
  edges={edges}
  xAxisLabel="Madurez →"
  yAxisLabel="Valor visible →"
  format={(v: number) => \`\${Math.round(v * 100)}%\`}
/>`}
      >
        <WardleyMap
          ariaLabel="Mapa Wardley del comedor con ejes propios y formato entero"
          nodes={comedorNodes}
          edges={comedorEdges}
          xAxisLabel="Madurez →"
          yAxisLabel="Valor visible →"
          format={(v: number) => `${Math.round(v * 100)}%`}
        />
      </DemoExample>
      <DemoExample
        caption="estrés de plataforma con 10 componentes y malla de 12 aristas"
        code={`import { WardleyMap } from "@carlos-burelo/klin";

const nodes = [
  { id: "w-portal", label: "Portal", x: 0.2, y: 0.95 },
  { id: "w-auth", label: "Identidad", x: 0.35, y: 0.8 },
  { id: "w-api", label: "API", x: 0.45, y: 0.68 },
  { id: "w-pagos", label: "Pagos", x: 0.62, y: 0.55 },
  { id: "w-cola", label: "Cola", x: 0.58, y: 0.42 },
  { id: "w-worker", label: "Worker", x: 0.7, y: 0.35 },
  { id: "w-cache", label: "Caché", x: 0.75, y: 0.28 },
  { id: "w-bd", label: "Base", x: 0.8, y: 0.22 },
  { id: "w-correo", label: "Correo", x: 0.85, y: 0.3 },
  { id: "w-cdn", label: "CDN", x: 0.9, y: 0.12 },
];

const edges = [
  { from: "w-portal", to: "w-auth" },
  { from: "w-portal", to: "w-api" },
  { from: "w-api", to: "w-auth" },
  { from: "w-api", to: "w-pagos" },
  { from: "w-api", to: "w-cola" },
  { from: "w-cola", to: "w-worker" },
  { from: "w-worker", to: "w-correo" },
  { from: "w-worker", to: "w-bd" },
  { from: "w-api", to: "w-cache" },
  { from: "w-cache", to: "w-bd" },
  { from: "w-portal", to: "w-cdn" },
  { from: "w-api", to: "w-bd" },
];

<WardleyMap
  ariaLabel="Mapa Wardley denso de plataforma con diez componentes"
  nodes={nodes}
  edges={edges}
/>`}
      >
        <WardleyMap
          ariaLabel="Mapa Wardley denso de plataforma con diez componentes"
          nodes={estresNodesW}
          edges={estresEdgesW}
        />
      </DemoExample>
    </div>
  );
}
