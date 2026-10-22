import { BulletChart } from "@carlos-burelo/klin";
import { DemoExample } from "../../components/docs/demo-example";

export default function BulletChartExamples() {
  return (
    <div className="flex flex-col gap-6">
      <DemoExample
        caption="Varias regiones con valor contra meta sobre bandas"
        code={`import { BulletChart } from "@carlos-burelo/klin";

const rows = [
  { label: "Norte", value: 82, target: 90, ranges: [50, 75, 100] },
  { label: "Centro", value: 68, target: 80, ranges: [50, 75, 100] },
  { label: "Sur", value: 91, target: 85, ranges: [50, 75, 100] },
];

<BulletChart
  ariaLabel="Balas de avance contra meta por región comercial"
  rows={rows}
/>`}
      >
        <BulletChart
          ariaLabel="Balas de avance contra meta por región comercial"
          rows={[
            { label: "Norte", value: 82, target: 90, ranges: [50, 75, 100] },
            { label: "Centro", value: 68, target: 80, ranges: [50, 75, 100] },
            { label: "Sur", value: 91, target: 85, ranges: [50, 75, 100] },
          ]}
        />
      </DemoExample>
      <DemoExample
        caption="Metas superadas con formato de porcentaje"
        code={`import { BulletChart } from "@carlos-burelo/klin";

const rows = [
  {
    label: "Cobertura",
    value: 96,
    target: 90,
    ranges: [60, 80, 100],
  },
  {
    label: "Asistencia",
    value: 88,
    target: 85,
    ranges: [60, 80, 100],
  },
  {
    label: "Vacunación",
    value: 74,
    target: 80,
    ranges: [50, 70, 100],
  },
];

<BulletChart
  ariaLabel="Balas de cumplimiento en porcentaje que superan la meta"
  format={(v: number) => \`\${v} %\`}
  rows={rows}
/>`}
      >
        <BulletChart
          ariaLabel="Balas de cumplimiento en porcentaje que superan la meta"
          format={(v: number) => `${v} %`}
          rows={[
            {
              label: "Cobertura",
              value: 96,
              target: 90,
              ranges: [60, 80, 100],
            },
            {
              label: "Asistencia",
              value: 88,
              target: 85,
              ranges: [60, 80, 100],
            },
            {
              label: "Vacunación",
              value: 74,
              target: 80,
              ranges: [50, 70, 100],
            },
          ]}
        />
      </DemoExample>
      <DemoExample
        caption="Una sola fila con color propio y detalle de cierre"
        code={`import { BulletChart } from "@carlos-burelo/klin";

const rows = [
  {
    label: "Nacional",
    value: 68,
    target: 80,
    ranges: [40, 65, 100],
    detail: "Cierre de junio",
  },
];

<BulletChart
  ariaLabel="Bala nacional de recaudación contra meta de junio"
  color="#16a34a"
  format={(v: number) =>
    \`$\${new Intl.NumberFormat("es-MX").format(v)} mdp\`
  }
  rows={rows}
/>`}
      >
        <BulletChart
          ariaLabel="Bala nacional de recaudación contra meta de junio"
          color="#16a34a"
          format={(v: number) =>
            `$${new Intl.NumberFormat("es-MX").format(v)} mdp`
          }
          rows={[
            {
              label: "Nacional",
              value: 68,
              target: 80,
              ranges: [40, 65, 100],
              detail: "Cierre de junio",
            },
          ]}
        />
      </DemoExample>
      <DemoExample
        caption="Cada fila con su barra y su meta en color propio"
        code={`import { BulletChart } from "@carlos-burelo/klin";

const rows = [
  {
    label: "Norte",
    value: 82,
    target: 90,
    ranges: [50, 75, 100],
    color: "var(--chart-1)",
    targetColor: "var(--chart-5)",
  },
  {
    label: "Sur",
    value: 91,
    target: 85,
    ranges: [50, 75, 100],
    color: "var(--chart-2)",
    targetColor: "#111827",
  },
];

<BulletChart
  ariaLabel="Balas por región cada una con color de barra y de meta propios"
  rows={rows}
/>`}
      >
        <BulletChart
          ariaLabel="Balas por región cada una con color de barra y de meta propios"
          rows={[
            {
              label: "Norte",
              value: 82,
              target: 90,
              ranges: [50, 75, 100],
              color: "var(--chart-1)",
              targetColor: "var(--chart-5)",
            },
            {
              label: "Sur",
              value: 91,
              target: 85,
              ranges: [50, 75, 100],
              color: "var(--chart-2)",
              targetColor: "#111827",
            },
          ]}
        />
      </DemoExample>
      <DemoExample
        caption="Estrés: 15 gerencias con nombres largos y metas mezcladas sobre y bajo objetivo"
        code={`import { BulletChart } from "@carlos-burelo/klin";

const rows = [
  { label: "Gerencia de Ventas Zona Norte Bajío", value: 82, target: 90, ranges: [50, 75, 100] },
  { label: "Gerencia de Ventas Zona Sur Península", value: 91, target: 85, ranges: [50, 75, 100] },
  { label: "Gerencia de Operaciones Centro Occidente", value: 68, target: 80, ranges: [50, 75, 100] },
  { label: "Gerencia de Logística Corredor del Golfo", value: 77, target: 75, ranges: [50, 75, 100] },
  { label: "Gerencia de Cobranza Valle de México", value: 59, target: 70, ranges: [40, 60, 100] },
  { label: "Gerencia de Posventa Pacífico Norte", value: 88, target: 85, ranges: [50, 75, 100] },
  { label: "Gerencia de Refacciones Noreste Frontera", value: 73, target: 80, ranges: [50, 75, 100] },
  { label: "Gerencia de Flotillas Bajío Industrial", value: 95, target: 90, ranges: [60, 80, 100] },
  { label: "Gerencia de Crédito y Financiamiento", value: 64, target: 75, ranges: [40, 65, 100] },
  { label: "Gerencia de Mercadotecnia Digital Nacional", value: 81, target: 80, ranges: [50, 75, 100] },
  { label: "Gerencia de Recursos Humanos Corporativo", value: 70, target: 85, ranges: [50, 75, 100] },
  { label: "Gerencia de Mantenimiento Zona Metropolitana", value: 86, target: 82, ranges: [50, 75, 100] },
  { label: "Gerencia de Calidad y Certificación ISO", value: 78, target: 88, ranges: [50, 75, 100] },
  { label: "Gerencia de Compras y Abastecimiento", value: 92, target: 87, ranges: [50, 75, 100] },
  { label: "Gerencia de Expansión Sureste Peninsular", value: 55, target: 72, ranges: [40, 60, 100] },
];

<BulletChart
  ariaLabel="Avance contra meta en 15 gerencias con nombres largos"
  rows={rows}
/>`}
      >
        <BulletChart
          ariaLabel="Avance contra meta en 15 gerencias con nombres largos"
          rows={[
            {
              label: "Gerencia de Ventas Zona Norte Bajío",
              value: 82,
              target: 90,
              ranges: [50, 75, 100],
            },
            {
              label: "Gerencia de Ventas Zona Sur Península",
              value: 91,
              target: 85,
              ranges: [50, 75, 100],
            },
            {
              label: "Gerencia de Operaciones Centro Occidente",
              value: 68,
              target: 80,
              ranges: [50, 75, 100],
            },
            {
              label: "Gerencia de Logística Corredor del Golfo",
              value: 77,
              target: 75,
              ranges: [50, 75, 100],
            },
            {
              label: "Gerencia de Cobranza Valle de México",
              value: 59,
              target: 70,
              ranges: [40, 60, 100],
            },
            {
              label: "Gerencia de Posventa Pacífico Norte",
              value: 88,
              target: 85,
              ranges: [50, 75, 100],
            },
            {
              label: "Gerencia de Refacciones Noreste Frontera",
              value: 73,
              target: 80,
              ranges: [50, 75, 100],
            },
            {
              label: "Gerencia de Flotillas Bajío Industrial",
              value: 95,
              target: 90,
              ranges: [60, 80, 100],
            },
            {
              label: "Gerencia de Crédito y Financiamiento",
              value: 64,
              target: 75,
              ranges: [40, 65, 100],
            },
            {
              label: "Gerencia de Mercadotecnia Digital Nacional",
              value: 81,
              target: 80,
              ranges: [50, 75, 100],
            },
            {
              label: "Gerencia de Recursos Humanos Corporativo",
              value: 70,
              target: 85,
              ranges: [50, 75, 100],
            },
            {
              label: "Gerencia de Mantenimiento Zona Metropolitana",
              value: 86,
              target: 82,
              ranges: [50, 75, 100],
            },
            {
              label: "Gerencia de Calidad y Certificación ISO",
              value: 78,
              target: 88,
              ranges: [50, 75, 100],
            },
            {
              label: "Gerencia de Compras y Abastecimiento",
              value: 92,
              target: 87,
              ranges: [50, 75, 100],
            },
            {
              label: "Gerencia de Expansión Sureste Peninsular",
              value: 55,
              target: 72,
              ranges: [40, 60, 100],
            },
          ]}
        />
      </DemoExample>
    </div>
  );
}
