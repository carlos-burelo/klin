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
    </div>
  );
}
