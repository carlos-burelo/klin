import { PyramidChart } from "@carlos-burelo/klin";
import { DemoExample } from "../../components/docs/demo-example";

const grupos = ["0–14", "15–29", "30–44", "45–59", "60+"];

const gruposEstres = [
  "Niñez de 0 a 4 años",
  "Niñez de 5 a 9 años",
  "Adolescencia de 10 a 14 años",
  "Juventud de 15 a 19 años",
  "Adultez joven de 20 a 29 años",
  "Adultez de 30 a 39 años",
  "Adultez media de 40 a 49 años",
  "Vejez digna de 50 años y más",
];

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
      <DemoExample
        caption="valores dentro de cada barra"
        code={`import { PyramidChart } from "@carlos-burelo/klin";

const grupos = ["0–14", "15–29", "30–44", "45–59", "60+"];

<PyramidChart
  groups={grupos}
  left={{ label: "Mujeres", values: [42, 51, 48, 39, 28] }}
  right={{ label: "Hombres", values: [44, 52, 46, 36, 24] }}
  showValues
  ariaLabel="Pirámide poblacional por edad y sexo con valores dentro de cada barra"
/>`}
      >
        <PyramidChart
          groups={grupos}
          left={{ label: "Mujeres", values: [42, 51, 48, 39, 28] }}
          right={{ label: "Hombres", values: [44, 52, 46, 36, 24] }}
          showValues
          ariaLabel="Pirámide poblacional por edad y sexo con valores dentro de cada barra"
        />
      </DemoExample>
      <DemoExample
        caption="Estrés: 8 niveles con nombres largos, valores dentro y reparto"
        code={`import { PyramidChart } from "@carlos-burelo/klin";

const gruposEstres = [
  "Niñez de 0 a 4 años",
  "Niñez de 5 a 9 años",
  "Adolescencia de 10 a 14 años",
  "Juventud de 15 a 19 años",
  "Adultez joven de 20 a 29 años",
  "Adultez de 30 a 39 años",
  "Adultez media de 40 a 49 años",
  "Vejez digna de 50 años y más",
];

<PyramidChart
  groups={gruposEstres}
  left={{ label: "Mujeres", values: [48, 52, 55, 58, 61, 57, 49, 44] }}
  right={{ label: "Hombres", values: [50, 53, 54, 57, 60, 55, 46, 40] }}
  showValues
  showShare
  ariaLabel="Pirámide poblacional de ocho niveles por edad y sexo con nombres largos"
/>`}
      >
        <PyramidChart
          groups={gruposEstres}
          left={{ label: "Mujeres", values: [48, 52, 55, 58, 61, 57, 49, 44] }}
          right={{ label: "Hombres", values: [50, 53, 54, 57, 60, 55, 46, 40] }}
          showValues
          showShare
          ariaLabel="Pirámide poblacional de ocho niveles por edad y sexo con nombres largos"
        />
      </DemoExample>
    </div>
  );
}
