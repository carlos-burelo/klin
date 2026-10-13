import { IsotypeChart } from "@carlos-burelo/klin";
import { DemoExample } from "../../components/docs/demo-example";

export default function IsotypeChartExamples() {
  return (
    <div className="flex flex-col gap-6">
      <DemoExample
        caption="Café por estado con pictograma de 20 mil toneladas"
        code={`import { IsotypeChart } from "@carlos-burelo/klin";

const data = [
  { label: "Chiapas", value: 260 },
  { label: "Veracruz", value: 230 },
  { label: "Puebla", value: 150 },
  { label: "Oaxaca", value: 120 },
];

<IsotypeChart
  ariaLabel="Producción de café por estado, Chiapas y Veracruz concentran la mitad"
  series={data}
  unit={20}
  format={(v: number) => new Intl.NumberFormat("es-MX").format(v)}
/>`}
      >
        <IsotypeChart
          ariaLabel="Producción de café por estado, Chiapas y Veracruz concentran la mitad"
          series={[
            { label: "Chiapas", value: 260 },
            { label: "Veracruz", value: 230 },
            { label: "Puebla", value: 150 },
            { label: "Oaxaca", value: 120 },
          ]}
          unit={20}
          format={(v: number) => new Intl.NumberFormat("es-MX").format(v)}
        />
      </DemoExample>
      <DemoExample
        caption="Vacunación por municipio en miles de dosis"
        code={`import { IsotypeChart } from "@carlos-burelo/klin";

const data = [
  { label: "Mérida", value: 48 },
  { label: "Kanasín", value: 18 },
  { label: "Valladolid", value: 12 },
  { label: "Tizimín", value: 9 },
];

<IsotypeChart
  ariaLabel="Dosis aplicadas por municipio, Mérida triplica a Kanasín"
  series={data}
  unit={3}
  format={(v: number) => \`\${v} mil\`}
/>`}
      >
        <IsotypeChart
          ariaLabel="Dosis aplicadas por municipio, Mérida triplica a Kanasín"
          series={[
            { label: "Mérida", value: 48 },
            { label: "Kanasín", value: 18 },
            { label: "Valladolid", value: 12 },
            { label: "Tizimín", value: 9 },
          ]}
          unit={3}
          format={(v: number) => `${v} mil`}
        />
      </DemoExample>
      <DemoExample
        caption="Remesas con seis pictogramas por fila"
        code={`import { IsotypeChart } from "@carlos-burelo/klin";

const data = [
  { label: "Michoacán", value: 4200 },
  { label: "Guanajuato", value: 3800 },
  { label: "Jalisco", value: 3400 },
];

<IsotypeChart
  ariaLabel="Remesas por estado en millones de dólares, Michoacán lidera con 4,200"
  series={data}
  unit={500}
  maxPerRow={6}
  format={(v: number) => new Intl.NumberFormat("es-MX").format(v)}
/>`}
      >
        <IsotypeChart
          ariaLabel="Remesas por estado en millones de dólares, Michoacán lidera con 4,200"
          series={[
            { label: "Michoacán", value: 4200 },
            { label: "Guanajuato", value: 3800 },
            { label: "Jalisco", value: 3400 },
          ]}
          unit={500}
          maxPerRow={6}
          format={(v: number) => new Intl.NumberFormat("es-MX").format(v)}
        />
      </DemoExample>
    </div>
  );
}
