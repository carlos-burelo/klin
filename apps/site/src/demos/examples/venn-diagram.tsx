import type { VennSet } from "@carlos-burelo/klin";
import { VennDiagram } from "@carlos-burelo/klin";
import { DemoExample } from "../../components/docs/demo-example";

const transporteSets: [VennSet, VennSet] = [
  { label: "Bicicleta", value: 1200 },
  { label: "Metro", value: 2100 },
];

const transporteIntersections = [{ sets: [0, 1], value: 480 }];

function formatoViajes(value: number): string {
  return `${new Intl.NumberFormat("es-MX").format(Math.round(value))} viajes`;
}

const desayunoSets: [VennSet, VennSet, VennSet] = [
  { label: "Fruta", value: 900 },
  { label: "Pan", value: 1300 },
  { label: "Café", value: 1500 },
];

const desayunoIntersections = [
  { sets: [0, 1], value: 320 },
  { sets: [0, 2], value: 410 },
  { sets: [1, 2], value: 620 },
  { sets: [0, 1, 2], value: 180 },
];

export default function VennDiagramExamples() {
  return (
    <div className="flex flex-col gap-6">
      <DemoExample
        caption="dos conjuntos de transporte con formato propio"
        code={`import { VennDiagram } from "@carlos-burelo/klin";

const sets = [
  { label: "Bicicleta", value: 1200 },
  { label: "Metro", value: 2100 },
];

const intersections = [{ sets: [0, 1], value: 480 }];

function formatoViajes(value: number): string {
  return \`\${new Intl.NumberFormat("es-MX").format(Math.round(value))} viajes\`;
}

<VennDiagram
  ariaLabel="Diagrama de Venn de viajes en bicicleta y metro"
  sets={sets}
  intersections={intersections}
  format={formatoViajes}
/>`}
      >
        <VennDiagram
          ariaLabel="Diagrama de Venn de viajes en bicicleta y metro"
          sets={transporteSets}
          intersections={transporteIntersections}
          format={formatoViajes}
        />
      </DemoExample>
      <DemoExample
        caption="tres conjuntos de desayuno con triple intersección"
        code={`import { VennDiagram } from "@carlos-burelo/klin";

const sets = [
  { label: "Fruta", value: 900 },
  { label: "Pan", value: 1300 },
  { label: "Café", value: 1500 },
];

const intersections = [
  { sets: [0, 1], value: 320 },
  { sets: [0, 2], value: 410 },
  { sets: [1, 2], value: 620 },
  { sets: [0, 1, 2], value: 180 },
];

<VennDiagram
  ariaLabel="Diagrama de Venn de preferencias de desayuno"
  sets={sets}
  intersections={intersections}
/>`}
      >
        <VennDiagram
          ariaLabel="Diagrama de Venn de preferencias de desayuno"
          sets={desayunoSets}
          intersections={desayunoIntersections}
        />
      </DemoExample>
    </div>
  );
}
