import { BoxPlot } from "@carlos-burelo/klin";
import { DemoExample } from "../../components/docs/demo-example";

export default function BoxPlotExamples() {
  return (
    <div className="flex flex-col gap-6">
      <DemoExample
        caption="Tres grupos con leyenda"
        code={`import { BoxPlot } from "@carlos-burelo/klin";

const groups = [
  { label: "Grupo A", values: [7, 8, 8, 9, 9, 10, 6, 8] },
  { label: "Grupo B", values: [5, 6, 7, 7, 8, 8, 9, 6] },
  { label: "Grupo C", values: [8, 9, 9, 9, 10, 10, 8, 9] },
];

<BoxPlot
  ariaLabel="Cajas de calificaciones de tres grupos de preparatoria"
  groups={groups}
/>`}
      >
        <BoxPlot
          ariaLabel="Cajas de calificaciones de tres grupos de preparatoria"
          groups={[
            { label: "Grupo A", values: [7, 8, 8, 9, 9, 10, 6, 8] },
            { label: "Grupo B", values: [5, 6, 7, 7, 8, 8, 9, 6] },
            { label: "Grupo C", values: [8, 9, 9, 9, 10, 10, 8, 9] },
          ]}
        />
      </DemoExample>
      <DemoExample
        caption="Grupos con valores atípicos y promedio esperado anotado"
        code={`import { BoxPlot } from "@carlos-burelo/klin";

const groups = [
  { label: "Norte", values: [6, 7, 7, 8, 8, 9, 9, 22] },
  { label: "Sur", values: [5, 6, 6, 7, 7, 8, 8, 1] },
  { label: "Centro", values: [7, 7, 8, 8, 8, 9, 10, 9] },
];

<BoxPlot
  ariaLabel="Cajas de tiempos de entrega con pedidos atípicos y esperado de 8 días"
  groups={groups}
  formatY={(v: number) => \`\${v} días\`}
  annotations={[{ value: 8, label: "Esperado" }]}
/>`}
      >
        <BoxPlot
          ariaLabel="Cajas de tiempos de entrega con pedidos atípicos y esperado de 8 días"
          groups={[
            { label: "Norte", values: [6, 7, 7, 8, 8, 9, 9, 22] },
            { label: "Sur", values: [5, 6, 6, 7, 7, 8, 8, 1] },
            { label: "Centro", values: [7, 7, 8, 8, 8, 9, 10, 9] },
          ]}
          formatY={(v: number) => `${v} días`}
          annotations={[{ value: 8, label: "Esperado" }]}
        />
      </DemoExample>
      <DemoExample
        caption="Un solo grupo sin leyenda"
        code={`import { BoxPlot } from "@carlos-burelo/klin";

const groups = [
  {
    label: "Equipo",
    values: [178, 182, 185, 188, 190, 192, 195, 198],
  },
];

<BoxPlot
  ariaLabel="Caja de estaturas de un equipo de básquetbol"
  groups={groups}
  formatY={(v: number) => \`\${v} cm\`}
  showLegend={false}
/>`}
      >
        <BoxPlot
          ariaLabel="Caja de estaturas de un equipo de básquetbol"
          groups={[
            {
              label: "Equipo",
              values: [178, 182, 185, 188, 190, 192, 195, 198],
            },
          ]}
          formatY={(v: number) => `${v} cm`}
          showLegend={false}
        />
      </DemoExample>
    </div>
  );
}
