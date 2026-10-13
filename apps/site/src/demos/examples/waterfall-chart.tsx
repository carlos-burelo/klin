import type { WaterfallStep } from "@carlos-burelo/klin";
import { WaterfallChart } from "@carlos-burelo/klin";
import { DemoExample } from "../../components/docs/demo-example";

const presupuesto: WaterfallStep[] = [
  { label: "Inicial", value: 120 },
  { label: "Recaudación", value: 85 },
  { label: "Nómina", value: -60 },
  { label: "Obra", value: -45 },
  { label: "Servicios", value: -20 },
];

const perdida: WaterfallStep[] = [
  { label: "Ventas", value: 200 },
  { label: "Devoluciones", value: -60 },
  { label: "Costos", value: -120 },
  { label: "Impuestos", value: -45 },
];

function formatoMoneda(value: number): string {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function WaterfallChartExamples() {
  return (
    <div className="flex flex-col gap-6">
      <DemoExample
        caption="presupuesto con etiqueta de total y formato moneda"
        code={`import type { WaterfallStep } from "@carlos-burelo/klin";
import { WaterfallChart } from "@carlos-burelo/klin";

const presupuesto: WaterfallStep[] = [
  { label: "Inicial", value: 120 },
  { label: "Recaudación", value: 85 },
  { label: "Nómina", value: -60 },
  { label: "Obra", value: -45 },
  { label: "Servicios", value: -20 },
];

function formatoMoneda(value: number): string {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 0,
  }).format(value);
}

<WaterfallChart
  steps={presupuesto}
  totalLabel="Saldo final"
  formatY={formatoMoneda}
  ariaLabel="Evolución del saldo presupuestal en pesos"
/>`}
      >
        <WaterfallChart
          steps={presupuesto}
          totalLabel="Saldo final"
          formatY={formatoMoneda}
          ariaLabel="Evolución del saldo presupuestal en pesos"
        />
      </DemoExample>
      <DemoExample
        caption="con línea de anotación en el punto de equilibrio"
        code={`import type { WaterfallStep } from "@carlos-burelo/klin";
import { WaterfallChart } from "@carlos-burelo/klin";

const presupuesto: WaterfallStep[] = [
  { label: "Inicial", value: 120 },
  { label: "Recaudación", value: 85 },
  { label: "Nómina", value: -60 },
  { label: "Obra", value: -45 },
  { label: "Servicios", value: -20 },
];

function formatoMoneda(value: number): string {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 0,
  }).format(value);
}

<WaterfallChart
  steps={presupuesto}
  totalLabel="Saldo final"
  formatY={formatoMoneda}
  annotations={[{ value: 100, label: "Equilibrio" }]}
  ariaLabel="Saldo presupuestal con línea de equilibrio en 100"
/>`}
      >
        <WaterfallChart
          steps={presupuesto}
          totalLabel="Saldo final"
          formatY={formatoMoneda}
          annotations={[{ value: 100, label: "Equilibrio" }]}
          ariaLabel="Saldo presupuestal con línea de equilibrio en 100"
        />
      </DemoExample>
      <DemoExample
        caption="resultado neto negativo con total personalizado"
        code={`import type { WaterfallStep } from "@carlos-burelo/klin";
import { WaterfallChart } from "@carlos-burelo/klin";

const perdida: WaterfallStep[] = [
  { label: "Ventas", value: 200 },
  { label: "Devoluciones", value: -60 },
  { label: "Costos", value: -120 },
  { label: "Impuestos", value: -45 },
];

<WaterfallChart
  steps={perdida}
  totalLabel="Pérdida neta"
  formatY={(v) => \`\${v} mdp\`}
  ariaLabel="Pérdida neta del ejercicio en millones de pesos"
/>`}
      >
        <WaterfallChart
          steps={perdida}
          totalLabel="Pérdida neta"
          formatY={(v) => `${v} mdp`}
          ariaLabel="Pérdida neta del ejercicio en millones de pesos"
        />
      </DemoExample>
    </div>
  );
}
