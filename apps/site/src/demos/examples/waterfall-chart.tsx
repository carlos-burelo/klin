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

const estres: WaterfallStep[] = [
  { label: "Saldo inicial de enero", value: 320 },
  { label: "Recaudación de predial rezagado", value: 145 },
  { label: "Nómina quincenal de base sindicalizada", value: -120 },
  { label: "Obra de pavimentación Hidalgo Centro", value: -85 },
  { label: "Subsidio federal para agua potable", value: 110 },
  { label: "Servicios de alumbrado y energía", value: -60 },
  { label: "Recaudación de licencias comerciales", value: 75 },
  { label: "Mantenimiento de parques y jardines", value: -40 },
  { label: "Obra de drenaje en la zona oriente", value: -95 },
  { label: "Aportación estatal para seguridad", value: 130 },
  { label: "Nómina quincenal de confianza", value: -70 },
  { label: "Servicios de recolección nocturna", value: -35 },
  { label: "Recaudación de multas de tránsito", value: 55 },
  { label: "Reparación de baches y banquetas", value: -45 },
  { label: "Donativo empresarial para reforestación", value: 65 },
  { label: "Obra de banquetas en el centro", value: -50 },
  { label: "Intereses de la cuenta productiva", value: 25 },
  { label: "Servicios de fumigación y control", value: -20 },
  { label: "Recaudación de mercados y tianguis", value: 60 },
  { label: "Reserva para contingencias de cierre", value: -30 },
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
      <DemoExample
        caption="subtotal intermedio tras la nómina antes del cierre"
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
  subtotalAt={[2]}
  ariaLabel="Saldo presupuestal con subtotal intermedio tras la nómina"
/>`}
      >
        <WaterfallChart
          steps={presupuesto}
          totalLabel="Saldo final"
          formatY={formatoMoneda}
          subtotalAt={[2]}
          ariaLabel="Saldo presupuestal con subtotal intermedio tras la nómina"
        />
      </DemoExample>
      <DemoExample
        caption="Estrés: 20 movimientos con nombres largos y dos subtotales intermedios"
        code={`import type { WaterfallStep } from "@carlos-burelo/klin";
import { WaterfallChart } from "@carlos-burelo/klin";

const estres: WaterfallStep[] = [
  { label: "Saldo inicial de enero", value: 320 },
  { label: "Recaudación de predial rezagado", value: 145 },
  { label: "Nómina quincenal de base sindicalizada", value: -120 },
  { label: "Obra de pavimentación Hidalgo Centro", value: -85 },
  { label: "Subsidio federal para agua potable", value: 110 },
  { label: "Servicios de alumbrado y energía", value: -60 },
  { label: "Recaudación de licencias comerciales", value: 75 },
  { label: "Mantenimiento de parques y jardines", value: -40 },
  { label: "Obra de drenaje en la zona oriente", value: -95 },
  { label: "Aportación estatal para seguridad", value: 130 },
  { label: "Nómina quincenal de confianza", value: -70 },
  { label: "Servicios de recolección nocturna", value: -35 },
  { label: "Recaudación de multas de tránsito", value: 55 },
  { label: "Reparación de baches y banquetas", value: -45 },
  { label: "Donativo empresarial para reforestación", value: 65 },
  { label: "Obra de banquetas en el centro", value: -50 },
  { label: "Intereses de la cuenta productiva", value: 25 },
  { label: "Servicios de fumigación y control", value: -20 },
  { label: "Recaudación de mercados y tianguis", value: 60 },
  { label: "Reserva para contingencias de cierre", value: -30 },
];

<WaterfallChart
  steps={estres}
  totalLabel="Saldo final de junio"
  formatY={(v) => \`\${v} mdp\`}
  subtotalAt={[4, 12]}
  runningTotal
  ariaLabel="Evolución del saldo semestral con 20 movimientos y dos subtotales"
/>`}
      >
        <WaterfallChart
          steps={estres}
          totalLabel="Saldo final de junio"
          formatY={(v) => `${v} mdp`}
          subtotalAt={[4, 12]}
          runningTotal
          ariaLabel="Evolución del saldo semestral con 20 movimientos y dos subtotales"
        />
      </DemoExample>
    </div>
  );
}
