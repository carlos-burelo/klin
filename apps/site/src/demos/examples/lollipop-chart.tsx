import { LollipopChart } from "@carlos-burelo/klin";
import { DemoExample } from "../../components/docs/demo-example";

export default function LollipopExamples() {
  return (
    <div className="flex flex-col gap-6">
      <DemoExample
        caption="Ventas por región en miles de piezas"
        code={`import { LollipopChart } from "@carlos-burelo/klin";

const data = [
  { region: "Norte", ventas: 128 },
  { region: "Centro", ventas: 214 },
  { region: "Sur", ventas: 96 },
  { region: "Oriente", ventas: 167 },
  { region: "Poniente", ventas: 142 },
];

<LollipopChart
  ariaLabel="Paletas de ventas trimestrales por región en miles de piezas"
  data={data}
  xKey="region"
  yKey="ventas"
/>`}
      >
        <LollipopChart
          ariaLabel="Paletas de ventas trimestrales por región en miles de piezas"
          data={[
            { region: "Norte", ventas: 128 },
            { region: "Centro", ventas: 214 },
            { region: "Sur", ventas: 96 },
            { region: "Oriente", ventas: 167 },
            { region: "Poniente", ventas: 142 },
          ]}
          xKey="region"
          yKey="ventas"
        />
      </DemoExample>
      <DemoExample
        caption="Flujo con meses en negativo y meta anotada"
        code={`import { LollipopChart } from "@carlos-burelo/klin";

const data = [
  { mes: "Ene", flujo: 45 },
  { mes: "Feb", flujo: -18 },
  { mes: "Mar", flujo: 30 },
  { mes: "Abr", flujo: -8 },
  { mes: "May", flujo: 52 },
];

<LollipopChart
  ariaLabel="Paletas de flujo neto con meses en negativo y meta de 20 mil"
  data={data}
  xKey="mes"
  yKey="flujo"
  formatY={(v: number) => \`\${v} mil\`}
  annotations={[{ value: 20, label: "Meta" }]}
/>`}
      >
        <LollipopChart
          ariaLabel="Paletas de flujo neto con meses en negativo y meta de 20 mil"
          data={[
            { mes: "Ene", flujo: 45 },
            { mes: "Feb", flujo: -18 },
            { mes: "Mar", flujo: 30 },
            { mes: "Abr", flujo: -8 },
            { mes: "May", flujo: 52 },
          ]}
          xKey="mes"
          yKey="flujo"
          formatY={(v: number) => `${v} mil`}
          annotations={[{ value: 20, label: "Meta" }]}
        />
      </DemoExample>
      <DemoExample
        caption="Donativos con sede en cero, color propio y formato de moneda"
        code={`import { LollipopChart } from "@carlos-burelo/klin";

const data = [
  { sede: "Centro", donativos: 8400 },
  { sede: "Norte", donativos: 5200 },
  { sede: "Sur", donativos: 0 },
  { sede: "Este", donativos: 3100 },
];

<LollipopChart
  ariaLabel="Paletas de donativos por sede con una sede en cero"
  data={data}
  xKey="sede"
  yKey="donativos"
  color="#0d9488"
  formatY={(v: number) =>
    \`$\${new Intl.NumberFormat("es-MX").format(v)}\`
  }
/>`}
      >
        <LollipopChart
          ariaLabel="Paletas de donativos por sede con una sede en cero"
          data={[
            { sede: "Centro", donativos: 8400 },
            { sede: "Norte", donativos: 5200 },
            { sede: "Sur", donativos: 0 },
            { sede: "Este", donativos: 3100 },
          ]}
          xKey="sede"
          yKey="donativos"
          color="#0d9488"
          formatY={(v: number) =>
            `$${new Intl.NumberFormat("es-MX").format(v)}`
          }
        />
      </DemoExample>
    </div>
  );
}
