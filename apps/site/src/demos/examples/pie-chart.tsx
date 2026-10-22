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
  showTotal
  data={data}
/>`}
      >
        <PieChart
          ariaLabel="Torta de ventas por canal con total de pedidos"
          totalLabel="Pedidos"
          showTotal
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
      <DemoExample
        caption="Torta con total al centro sobre píldora de fondo"
        code={`import { PieChart } from "@carlos-burelo/klin";

const data = [
  { label: "Chrome", value: 62 },
  { label: "Safari", value: 21 },
  { label: "Edge", value: 11 },
  { label: "Otros", value: 6 },
];

<PieChart
  ariaLabel="Torta de navegadores con total al centro"
  showTotal
  totalLabel="Puntos"
  format={(v: number) => \`\${v}\`}
  data={data}
/>`}
      >
        <PieChart
          ariaLabel="Torta de navegadores con total al centro"
          showTotal
          totalLabel="Puntos"
          format={(v: number) => `${v}`}
          data={[
            { label: "Chrome", value: 62 },
            { label: "Safari", value: 21 },
            { label: "Edge", value: 11 },
            { label: "Otros", value: 6 },
          ]}
        />
      </DemoExample>
      <DemoExample
        caption="Rebanadas con nombre fuera y porcentaje dentro"
        code={`import { PieChart } from "@carlos-burelo/klin";

const data = [
  { label: "Chrome", value: 62 },
  { label: "Safari", value: 21 },
  { label: "Edge", value: 11 },
  { label: "Otros", value: 6 },
];

<PieChart
  ariaLabel="Torta de navegadores con etiquetas dentro y fuera"
  innerLabels="percent"
  outerLabels="label"
  showLegend={false}
  data={data}
/>`}
      >
        <PieChart
          ariaLabel="Torta de navegadores con etiquetas dentro y fuera"
          innerLabels="percent"
          outerLabels="label"
          showLegend={false}
          data={[
            { label: "Chrome", value: 62 },
            { label: "Safari", value: 21 },
            { label: "Edge", value: 11 },
            { label: "Otros", value: 6 },
          ]}
        />
      </DemoExample>
      <DemoExample
        caption="Porcentajes fuera con conectores"
        code={`import { PieChart } from "@carlos-burelo/klin";

const data = [
  { label: "Chrome", value: 62 },
  { label: "Safari", value: 21 },
  { label: "Edge", value: 11 },
  { label: "Otros", value: 6 },
];

<PieChart
  ariaLabel="Torta de navegadores con porcentaje fuera"
  outerLabels="percent"
  showLegend={false}
  data={data}
/>`}
      >
        <PieChart
          ariaLabel="Torta de navegadores con porcentaje fuera"
          outerLabels="percent"
          showLegend={false}
          data={[
            { label: "Chrome", value: 62 },
            { label: "Safari", value: 21 },
            { label: "Edge", value: 11 },
            { label: "Otros", value: 6 },
          ]}
        />
      </DemoExample>
      <DemoExample
        caption="Valores fuera y reparto desfavorable con 8 rebanadas"
        code={`import { PieChart } from "@carlos-burelo/klin";

const data = [
  { label: "Norte", value: 34 },
  { label: "Sur", value: 22 },
  { label: "Este", value: 14 },
  { label: "Oeste", value: 9 },
  { label: "Centro", value: 7 },
  { label: "Noreste", value: 6 },
  { label: "Suroeste", value: 5 },
  { label: "Resto", value: 3 },
];

<PieChart
  ariaLabel="Torta regional con valores fuera y muchas rebanadas"
  outerLabels="value"
  format={(v: number) => \`\${v} mil\`}
  showLegend={false}
  data={data}
/>`}
      >
        <PieChart
          ariaLabel="Torta regional con valores fuera y muchas rebanadas"
          outerLabels="value"
          format={(v: number) => `${v} mil`}
          showLegend={false}
          data={[
            { label: "Norte", value: 34 },
            { label: "Sur", value: 22 },
            { label: "Este", value: 14 },
            { label: "Oeste", value: 9 },
            { label: "Centro", value: 7 },
            { label: "Noreste", value: 6 },
            { label: "Suroeste", value: 5 },
            { label: "Resto", value: 3 },
          ]}
        />
      </DemoExample>
      <DemoExample
        caption="Estrés: 12 rebanadas con varias finas, nombres fuera y porcentaje dentro"
        code={`import { PieChart } from "@carlos-burelo/klin";

const data = [
  { label: "Tienda física", value: 420 },
  { label: "En línea", value: 310 },
  { label: "Mayoreo", value: 180 },
  { label: "Marketplace", value: 120 },
  { label: "Teléfono", value: 60 },
  { label: "Redes sociales", value: 38 },
  { label: "Catálogo impreso", value: 24 },
  { label: "Venta por cambaceo en zona rural", value: 15 },
  { label: "Ferias", value: 9 },
  { label: "Kioscos", value: 6 },
  { label: "Máquinas expendedoras", value: 4 },
  { label: "Otros", value: 2 },
];

<PieChart
  ariaLabel="Torta de ventas por canal con doce rebanadas y varias finas"
  innerLabels="percent"
  outerLabels="label"
  showLegend={false}
  data={data}
/>`}
      >
        <PieChart
          ariaLabel="Torta de ventas por canal con doce rebanadas y varias finas"
          innerLabels="percent"
          outerLabels="label"
          showLegend={false}
          data={[
            { label: "Tienda física", value: 420 },
            { label: "En línea", value: 310 },
            { label: "Mayoreo", value: 180 },
            { label: "Marketplace", value: 120 },
            { label: "Teléfono", value: 60 },
            { label: "Redes sociales", value: 38 },
            { label: "Catálogo impreso", value: 24 },
            { label: "Venta por cambaceo en zona rural", value: 15 },
            { label: "Ferias", value: 9 },
            { label: "Kioscos", value: 6 },
            { label: "Máquinas expendedoras", value: 4 },
            { label: "Otros", value: 2 },
          ]}
        />
      </DemoExample>
    </div>
  );
}
