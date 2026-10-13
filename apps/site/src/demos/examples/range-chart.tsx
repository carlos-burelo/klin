import { RangeChart } from "@carlos-burelo/klin";
import { DemoExample } from "../../components/docs/demo-example";

export default function RangeChartExamples() {
  return (
    <div className="flex flex-col gap-6">
      <DemoExample
        caption="Rangos de humedad con valor observado"
        code={`import { RangeChart, type RangeGroup } from "@carlos-burelo/klin";

const groups: RangeGroup[] = [
  { label: "CDMX", low: 35, high: 72, value: 55 },
  { label: "Veracruz", low: 60, high: 95, value: 82 },
  { label: "Monterrey", low: 25, high: 60, value: 40 },
  { label: "Mérida", low: 55, high: 90, value: 75 },
];

<RangeChart
  ariaLabel="Rango de humedad mínima y máxima con valor observado por ciudad, con Veracruz como la más húmeda"
  groups={groups}
  formatY={(v: number) => \`\${v} %\`}
 />`}
      >
        <RangeChart
          ariaLabel="Rango de humedad mínima y máxima con valor observado por ciudad, con Veracruz como la más húmeda"
          groups={[
            { label: "CDMX", low: 35, high: 72, value: 55 },
            { label: "Veracruz", low: 60, high: 95, value: 82 },
            { label: "Monterrey", low: 25, high: 60, value: 40 },
            { label: "Mérida", low: 55, high: 90, value: 75 },
          ]}
          formatY={(v: number) => `${v} %`}
        />
      </DemoExample>
      <DemoExample
        caption="Solo intervalos con punto medio y formato de miles"
        code={`import { RangeChart, type RangeGroup } from "@carlos-burelo/klin";

const groups: RangeGroup[] = [
  { label: "Soporte", low: 12, high: 18 },
  { label: "Diseño", low: 18, high: 28 },
  { label: "Datos", low: 25, high: 42 },
  { label: "Backend", low: 28, high: 48 },
];

<RangeChart
  ariaLabel="Rango salarial mensual en miles de pesos por puesto, con Backend como el mejor pagado"
  groups={groups}
  formatY={(v: number) => \`$\${v} mil\`}
 />`}
      >
        <RangeChart
          ariaLabel="Rango salarial mensual en miles de pesos por puesto, con Backend como el mejor pagado"
          groups={[
            { label: "Soporte", low: 12, high: 18 },
            { label: "Diseño", low: 18, high: 28 },
            { label: "Datos", low: 25, high: 42 },
            { label: "Backend", low: 28, high: 48 },
          ]}
          formatY={(v: number) => `$${v} mil`}
        />
      </DemoExample>
      <DemoExample
        caption="Precios con tope anotado y sin leyenda"
        code={`import { RangeChart, type RangeGroup } from "@carlos-burelo/klin";

const groups: RangeGroup[] = [
  { label: "Tortilla", low: 22, high: 26, value: 24 },
  { label: "Huevo", low: 48, high: 58, value: 55 },
  { label: "Frijol", low: 32, high: 40, value: 36 },
  { label: "Aceite", low: 42, high: 52, value: 45 },
];

<RangeChart
  ariaLabel="Rango de precio por kilo en tianguis con precio medio observado y tope de 50 pesos, superado solo por el huevo"
  groups={groups}
  formatY={(v: number) => \`$\${v} /kg\`}
  annotations={[{ value: 50, label: "Tope" }]}
  showLegend={false}
/>`}
      >
        <RangeChart
          ariaLabel="Rango de precio por kilo en tianguis con precio medio observado y tope de 50 pesos, superado solo por el huevo"
          groups={[
            { label: "Tortilla", low: 22, high: 26, value: 24 },
            { label: "Huevo", low: 48, high: 58, value: 55 },
            { label: "Frijol", low: 32, high: 40, value: 36 },
            { label: "Aceite", low: 42, high: 52, value: 45 },
          ]}
          formatY={(v: number) => `$${v} /kg`}
          annotations={[{ value: 50, label: "Tope" }]}
          showLegend={false}
        />
      </DemoExample>
    </div>
  );
}
