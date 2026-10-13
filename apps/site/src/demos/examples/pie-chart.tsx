import { PieChart } from "@carlos-burelo/klin";
import { DemoExample } from "../../components/docs/demo-example";

export default function PieChartExamples() {
  return (
    <div className="flex flex-col gap-6">
      <DemoExample
        caption="Ventas por canal con total y leyenda"
        code={`import { PieChart } from "@carlos-burelo/klin";

const data = [
  { label: "Tienda física", value: 420 },
  { label: "En línea", value: 310 },
  { label: "Mayoreo", value: 180 },
  { label: "Marketplace", value: 120 },
  { label: "Teléfono", value: 60 },
];

<PieChart
  ariaLabel="Torta de ventas por canal con total de pedidos"
  totalLabel="Pedidos"
  data={data}
/>`}
      >
        <PieChart
          ariaLabel="Torta de ventas por canal con total de pedidos"
          totalLabel="Pedidos"
          data={[
            { label: "Tienda física", value: 420 },
            { label: "En línea", value: 310 },
            { label: "Mayoreo", value: 180 },
            { label: "Marketplace", value: 120 },
            { label: "Teléfono", value: 60 },
          ]}
        />
      </DemoExample>
      <DemoExample
        caption="Presupuesto por área sin leyenda"
        code={`import { PieChart } from "@carlos-burelo/klin";

const data = [
  { label: "Docencia", value: 52000 },
  { label: "Talleres", value: 24000 },
  { label: "Deporte", value: 14000 },
  { label: "Cultura", value: 9000 },
];

<PieChart
  ariaLabel="Torta de presupuesto escolar por rubro sin leyenda"
  totalLabel="Pesos"
  format={(v: number) =>
    \`$\${new Intl.NumberFormat("es-MX").format(v)}\`
  }
  showLegend={false}
  data={data}
/>`}
      >
        <PieChart
          ariaLabel="Torta de presupuesto escolar por rubro sin leyenda"
          totalLabel="Pesos"
          format={(v: number) => `$${new Intl.NumberFormat("es-MX").format(v)}`}
          showLegend={false}
          data={[
            { label: "Docencia", value: 52000 },
            { label: "Talleres", value: 24000 },
            { label: "Deporte", value: 14000 },
            { label: "Cultura", value: 9000 },
          ]}
        />
      </DemoExample>
      <DemoExample
        caption="Navegadores en porcentaje con una categoría dominante y sin total"
        code={`import { PieChart } from "@carlos-burelo/klin";

const data = [
  { label: "Chrome", value: 62 },
  { label: "Safari", value: 21 },
  { label: "Edge", value: 11 },
  { label: "Otros", value: 6 },
];

<PieChart
  ariaLabel="Torta de uso de navegadores en porcentaje sin total"
  showTotal={false}
  format={(v: number) => \`\${v} %\`}
  data={data}
/>`}
      >
        <PieChart
          ariaLabel="Torta de uso de navegadores en porcentaje sin total"
          showTotal={false}
          format={(v: number) => `${v} %`}
          data={[
            { label: "Chrome", value: 62 },
            { label: "Safari", value: 21 },
            { label: "Edge", value: 11 },
            { label: "Otros", value: 6 },
          ]}
        />
      </DemoExample>
    </div>
  );
}
