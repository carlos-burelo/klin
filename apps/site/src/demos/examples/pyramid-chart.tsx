import { PyramidChart } from "@carlos-burelo/klin";
import { DemoExample } from "../../components/docs/demo-example";

const grupos = ["0–14", "15–29", "30–44", "45–59", "60+"];

export default function PyramidChartExamples() {
  return (
    <div className="flex flex-col gap-6">
      <DemoExample
        caption="etiquetas a la izquierda con leyenda"
        code={`import { PyramidChart } from "@carlos-burelo/klin";

const grupos = ["0–14", "15–29", "30–44", "45–59", "60+"];

<PyramidChart
  groups={grupos}
  left={{ label: "Mujeres", values: [42, 51, 48, 39, 28] }}
  right={{ label: "Hombres", values: [44, 52, 46, 36, 24] }}
  ariaLabel="Pirámide poblacional por edad y sexo"
/>`}
      >
        <PyramidChart
          groups={grupos}
          left={{ label: "Mujeres", values: [42, 51, 48, 39, 28] }}
          right={{ label: "Hombres", values: [44, 52, 46, 36, 24] }}
          ariaLabel="Pirámide poblacional por edad y sexo"
        />
      </DemoExample>
      <DemoExample
        caption="etiquetas en banda central sin leyenda"
        code={`import { PyramidChart } from "@carlos-burelo/klin";

const grupos = ["0–14", "15–29", "30–44", "45–59", "60+"];

<PyramidChart
  groups={grupos}
  left={{ label: "Urbano", values: [120, 150, 140, 110, 80] }}
  right={{ label: "Rural", values: [60, 70, 65, 50, 35] }}
  labels="center"
  showLegend={false}
  ariaLabel="Población urbana y rural por grupo de edad"
/>`}
      >
        <PyramidChart
          groups={grupos}
          left={{ label: "Urbano", values: [120, 150, 140, 110, 80] }}
          right={{ label: "Rural", values: [60, 70, 65, 50, 35] }}
          labels="center"
          showLegend={false}
          ariaLabel="Población urbana y rural por grupo de edad"
        />
      </DemoExample>
      <DemoExample
        caption="color por grupo y formato de miles"
        code={`import { PyramidChart } from "@carlos-burelo/klin";

const grupos = ["0–14", "15–29", "30–44", "45–59", "60+"];

<PyramidChart
  groups={grupos}
  left={{
    label: "Turno matutino",
    values: [320, 410, 380, 290, 150],
  }}
  right={{
    label: "Turno vespertino",
    values: [280, 360, 340, 260, 130],
  }}
  formatX={(v) => new Intl.NumberFormat("es-MX").format(v)}
  itemColor={(_group, side) =>
    side === "left" ? "var(--chart-1)" : "var(--chart-4)"
  }
  ariaLabel="Matrícula por turno y grupo de edad en miles de alumnos"
/>`}
      >
        <PyramidChart
          groups={grupos}
          left={{
            label: "Turno matutino",
            values: [320, 410, 380, 290, 150],
          }}
          right={{
            label: "Turno vespertino",
            values: [280, 360, 340, 260, 130],
          }}
          formatX={(v) => new Intl.NumberFormat("es-MX").format(v)}
          itemColor={(_group, side) =>
            side === "left" ? "var(--chart-1)" : "var(--chart-4)"
          }
          ariaLabel="Matrícula por turno y grupo de edad en miles de alumnos"
        />
      </DemoExample>
    </div>
  );
}
