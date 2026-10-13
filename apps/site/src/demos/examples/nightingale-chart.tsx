import type { NightingaleDatum } from "@carlos-burelo/klin";
import { NightingaleChart } from "@carlos-burelo/klin";
import { DemoExample } from "../../components/docs/demo-example";

const museos: NightingaleDatum[] = [
  { label: "Mar", value: 8400 },
  { label: "Mié", value: 9200 },
  { label: "Jue", value: 9800 },
  { label: "Vie", value: 12500 },
  { label: "Sáb", value: 18200 },
  { label: "Dom", value: 21000 },
];

const remesas: NightingaleDatum[] = [
  { label: "T1", value: 14200 },
  { label: "T2", value: 15800 },
  { label: "T3", value: 15100 },
  { label: "T4", value: 16500 },
];

const dengue: NightingaleDatum[] = [
  { label: "Jun", value: 320 },
  { label: "Jul", value: 540 },
  { label: "Ago", value: 610 },
  { label: "Sep", value: 480 },
  { label: "Oct", value: 260 },
  { label: "Nov", value: 120 },
];

export default function NightingaleChartExamples() {
  return (
    <div className="flex flex-col gap-6">
      <DemoExample
        caption="Visitantes por día con formato de miles"
        code={`import type { NightingaleDatum } from "@carlos-burelo/klin";
import { NightingaleChart } from "@carlos-burelo/klin";

const museos: NightingaleDatum[] = [
  { label: "Mar", value: 8400 },
  { label: "Mié", value: 9200 },
  { label: "Jue", value: 9800 },
  { label: "Vie", value: 12500 },
  { label: "Sáb", value: 18200 },
  { label: "Dom", value: 21000 },
];

<NightingaleChart
  data={museos}
  format={(v: number) => new Intl.NumberFormat("es-MX").format(v)}
  ariaLabel="Visitantes al museo por día de la semana: el domingo duplica el flujo de entre semana y el sábado es el segundo día fuerte"
/>`}
      >
        <NightingaleChart
          data={museos}
          format={(v: number) => new Intl.NumberFormat("es-MX").format(v)}
          ariaLabel="Visitantes al museo por día de la semana: el domingo duplica el flujo de entre semana y el sábado es el segundo día fuerte"
        />
      </DemoExample>
      <DemoExample
        caption="Trimestres en moneda con leyenda"
        code={`import type { NightingaleDatum } from "@carlos-burelo/klin";
import { NightingaleChart } from "@carlos-burelo/klin";

const remesas: NightingaleDatum[] = [
  { label: "T1", value: 14200 },
  { label: "T2", value: 15800 },
  { label: "T3", value: 15100 },
  { label: "T4", value: 16500 },
];

<NightingaleChart
  data={remesas}
  format={(v: number) =>
    new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(v)
  }
  ariaLabel="Remesas por trimestre en millones de dólares: el cuarto trimestre marca el pico por las fiestas decembrinas"
/>`}
      >
        <NightingaleChart
          data={remesas}
          format={(v: number) =>
            new Intl.NumberFormat("es-MX", {
              style: "currency",
              currency: "USD",
              maximumFractionDigits: 0,
            }).format(v)
          }
          ariaLabel="Remesas por trimestre en millones de dólares: el cuarto trimestre marca el pico por las fiestas decembrinas"
        />
      </DemoExample>
      <DemoExample
        caption="Serie corta con unidades y sin leyenda"
        code={`import type { NightingaleDatum } from "@carlos-burelo/klin";
import { NightingaleChart } from "@carlos-burelo/klin";

const dengue: NightingaleDatum[] = [
  { label: "Jun", value: 320 },
  { label: "Jul", value: 540 },
  { label: "Ago", value: 610 },
  { label: "Sep", value: 480 },
  { label: "Oct", value: 260 },
  { label: "Nov", value: 120 },
];

<NightingaleChart
  data={dengue}
  format={(v: number) => \`\${v} casos\`}
  showLegend={false}
  ariaLabel="Casos de dengue por mes: agosto concentra el pico y noviembre cierra con la cifra más baja"
/>`}
      >
        <NightingaleChart
          data={dengue}
          format={(v: number) => `${v} casos`}
          showLegend={false}
          ariaLabel="Casos de dengue por mes: agosto concentra el pico y noviembre cierra con la cifra más baja"
        />
      </DemoExample>
    </div>
  );
}
