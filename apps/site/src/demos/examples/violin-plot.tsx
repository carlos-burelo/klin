import { ViolinPlot } from "@carlos-burelo/klin";
import { DemoExample } from "../../components/docs/demo-example";

export default function ViolinPlotExamples() {
  return (
    <div className="flex flex-col gap-6">
      <DemoExample
        caption="Tres preparatorias con leyenda"
        code={`import { ViolinPlot, type ViolinGroup } from "@carlos-burelo/klin";

const groups: ViolinGroup[] = [
  { label: "Prepa 1", values: [7, 8, 8, 9, 9, 10, 8, 9, 7, 8] },
  { label: "Prepa 5", values: [6, 7, 7, 8, 8, 7, 9, 8, 7, 6] },
  { label: "Prepa 9", values: [8, 9, 9, 9, 10, 10, 9, 8, 9, 10] },
];

<ViolinPlot
  ariaLabel="Distribución de promedios de egreso por preparatoria de la UNAM, con la mediana más alta en Prepa 9"
  groups={groups}
/>`}
      >
        <ViolinPlot
          ariaLabel="Distribución de promedios de egreso por preparatoria de la UNAM, con la mediana más alta en Prepa 9"
          groups={[
            { label: "Prepa 1", values: [7, 8, 8, 9, 9, 10, 8, 9, 7, 8] },
            { label: "Prepa 5", values: [6, 7, 7, 8, 8, 7, 9, 8, 7, 6] },
            { label: "Prepa 9", values: [8, 9, 9, 9, 10, 10, 9, 8, 9, 10] },
          ]}
        />
      </DemoExample>
      <DemoExample
        caption="Tiempos de entrega con ancho de banda fijo y meta anotada"
        code={`import { ViolinPlot, type ViolinGroup } from "@carlos-burelo/klin";

const groups: ViolinGroup[] = [
  { label: "CDMX", values: [1, 2, 2, 3, 2, 3, 1, 2, 4, 2] },
  { label: "Puebla", values: [2, 3, 3, 4, 3, 2, 4, 3, 5, 3] },
  { label: "Oaxaca", values: [3, 4, 5, 4, 6, 4, 5, 3, 5, 4] },
];

<ViolinPlot
  ariaLabel="Distribución de días de entrega por destino con meta de 3 días, cumplida solo en CDMX"
  groups={groups}
  bandwidth={1.5}
  formatY={(v: number) => \`\${v} días\`}
  annotations={[{ value: 3, label: "Meta" }]}
/>`}
      >
        <ViolinPlot
          ariaLabel="Distribución de días de entrega por destino con meta de 3 días, cumplida solo en CDMX"
          groups={[
            { label: "CDMX", values: [1, 2, 2, 3, 2, 3, 1, 2, 4, 2] },
            { label: "Puebla", values: [2, 3, 3, 4, 3, 2, 4, 3, 5, 3] },
            { label: "Oaxaca", values: [3, 4, 5, 4, 6, 4, 5, 3, 5, 4] },
          ]}
          bandwidth={1.5}
          formatY={(v: number) => `${v} días`}
          annotations={[{ value: 3, label: "Meta" }]}
        />
      </DemoExample>
      <DemoExample
        caption="Un solo grupo sin leyenda"
        code={`import { ViolinPlot, type ViolinGroup } from "@carlos-burelo/klin";

const groups: ViolinGroup[] = [
  { label: "Maratón CDMX", values: [178, 185, 192, 205, 198, 210, 188, 220, 195, 202] },
];

<ViolinPlot
  ariaLabel="Distribución de tiempos en minutos del Maratón de CDMX, concentrados entre 185 y 210"
  groups={groups}
  formatY={(v: number) => \`\${v} min\`}
  showLegend={false}
/>`}
      >
        <ViolinPlot
          ariaLabel="Distribución de tiempos en minutos del Maratón de CDMX, concentrados entre 185 y 210"
          groups={[
            {
              label: "Maratón CDMX",
              values: [178, 185, 192, 205, 198, 210, 188, 220, 195, 202],
            },
          ]}
          formatY={(v: number) => `${v} min`}
          showLegend={false}
        />
      </DemoExample>
    </div>
  );
}
