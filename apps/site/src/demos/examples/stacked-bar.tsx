import type { StackRow, StackSegment } from "@carlos-burelo/klin";
import { StackedBar } from "@carlos-burelo/klin";
import { DemoExample } from "../../components/docs/demo-example";

const segmentos: StackSegment[] = [
  { label: "Aprobado" },
  { label: "En curso" },
  { label: "Pendiente" },
].map((s, i) => ({ key: `s${i}`, ...s }));

const avance: StackRow[] = [
  { label: "Primaria", values: { s0: 70, s1: 20, s2: 10 } },
  { label: "Secundaria", values: { s0: 45, s1: 35, s2: 20 } },
  { label: "Preparatoria", values: { s0: 30, s1: 25, s2: 45 } },
];

const presupuesto: StackRow[] = [
  {
    label: "Nómina",
    values: { s0: 4_200_000, s1: 600_000, s2: 200_000 },
  },
  {
    label: "Obra",
    values: { s0: 900_000, s1: 800_000, s2: 300_000 },
  },
  { label: "Servicios", values: { s0: 780_000, s1: 20_000, s2: 0 } },
];

function formatoMoneda(value: number): string {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 0,
  }).format(value);
}

const segmentosEstres: StackSegment[] = [
  { key: "g0", label: "Federal" },
  { key: "g1", label: "Estatal" },
  { key: "g2", label: "Municipal" },
  { key: "g3", label: "Propios" },
  { key: "g4", label: "Donativos" },
];

const filasEstres: StackRow[] = Array.from({ length: 15 }, (_, i) => {
  const values: Record<string, number> = {};
  segmentosEstres.forEach((s, k) => {
    values[s.key] =
      20 +
      Math.round(
        60 * Math.abs(Math.sin(i * 0.9 + k * 1.7)) + ((i * 7 + k * 5) % 11),
      );
  });
  return {
    label: `Programa ${i + 1} de Bienestar Comunitario Regional`,
    values,
  };
});

export default function StackedBarExamples() {
  return (
    <div className="flex flex-col gap-6">
      <DemoExample
        caption="porcentaje del primer segmento con leyenda"
        code={`import type { StackRow, StackSegment } from "@carlos-burelo/klin";
import { StackedBar } from "@carlos-burelo/klin";

const segmentos: StackSegment[] = [
  { key: "s0", label: "Aprobado" },
  { key: "s1", label: "En curso" },
  { key: "s2", label: "Pendiente" },
];

const avance: StackRow[] = [
  { label: "Primaria", values: { s0: 70, s1: 20, s2: 10 } },
  { label: "Secundaria", values: { s0: 45, s1: 35, s2: 20 } },
  { label: "Preparatoria", values: { s0: 30, s1: 25, s2: 45 } },
];

<StackedBar
  rows={avance}
  segments={segmentos}
  ariaLabel="Avance de obra por nivel con porcentaje aprobado"
/>`}
      >
        <StackedBar
          rows={avance}
          segments={segmentos}
          ariaLabel="Avance de obra por nivel con porcentaje aprobado"
        />
      </DemoExample>
      <DemoExample
        caption="porcentaje del segundo segmento con formato moneda"
        code={`import type { StackRow, StackSegment } from "@carlos-burelo/klin";
import { StackedBar } from "@carlos-burelo/klin";

const segmentos: StackSegment[] = [
  { key: "s0", label: "Aprobado" },
  { key: "s1", label: "En curso" },
  { key: "s2", label: "Pendiente" },
];

const presupuesto: StackRow[] = [
  {
    label: "Nómina",
    values: { s0: 4_200_000, s1: 600_000, s2: 200_000 },
  },
  {
    label: "Obra",
    values: { s0: 900_000, s1: 800_000, s2: 300_000 },
  },
  { label: "Servicios", values: { s0: 780_000, s1: 20_000, s2: 0 } },
];

function formatoMoneda(value: number): string {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 0,
  }).format(value);
}

<StackedBar
  rows={presupuesto}
  segments={segmentos}
  percentOf="s1"
  format={formatoMoneda}
  ariaLabel="Presupuesto por rubro con porcentaje en curso en pesos"
/>`}
      >
        <StackedBar
          rows={presupuesto}
          segments={segmentos}
          percentOf="s1"
          format={formatoMoneda}
          ariaLabel="Presupuesto por rubro con porcentaje en curso en pesos"
        />
      </DemoExample>
      <DemoExample
        caption="filas con ceros y sin leyenda"
        code={`import type { StackRow, StackSegment } from "@carlos-burelo/klin";
import { StackedBar } from "@carlos-burelo/klin";

const segmentos: StackSegment[] = [
  { key: "s0", label: "Aprobado" },
  { key: "s1", label: "En curso" },
  { key: "s2", label: "Pendiente" },
];

const presupuesto: StackRow[] = [
  {
    label: "Nómina",
    values: { s0: 4_200_000, s1: 600_000, s2: 200_000 },
  },
  {
    label: "Obra",
    values: { s0: 900_000, s1: 800_000, s2: 300_000 },
  },
  { label: "Servicios", values: { s0: 780_000, s1: 20_000, s2: 0 } },
];

<StackedBar
  rows={presupuesto}
  segments={segmentos}
  showLegend={false}
  ariaLabel="Presupuesto por rubro con un segmento en cero"
/>`}
      >
        <StackedBar
          rows={presupuesto}
          segments={segmentos}
          showLegend={false}
          ariaLabel="Presupuesto por rubro con un segmento en cero"
        />
      </DemoExample>
      <DemoExample
        caption="Estrés: 15 filas con nombres largos y 5 segmentos con 75 valores"
        code={`import type { StackRow, StackSegment } from "@carlos-burelo/klin";
import { StackedBar } from "@carlos-burelo/klin";

const segmentosEstres: StackSegment[] = [
  { key: "g0", label: "Federal" },
  { key: "g1", label: "Estatal" },
  { key: "g2", label: "Municipal" },
  { key: "g3", label: "Propios" },
  { key: "g4", label: "Donativos" },
];

const filasEstres: StackRow[] = Array.from({ length: 15 }, (_, i) => {
  const values: Record<string, number> = {};
  segmentosEstres.forEach((s, k) => {
    values[s.key] =
      20 +
      Math.round(
        60 * Math.abs(Math.sin(i * 0.9 + k * 1.7)) + ((i * 7 + k * 5) % 11),
      );
  });
  return {
    label: \`Programa \${i + 1} de Bienestar Comunitario Regional\`,
    values,
  };
});

<StackedBar
  rows={filasEstres}
  segments={segmentosEstres}
  showValues
  ariaLabel="Financiamiento por programa con cinco fuentes y nombres largos"
/>`}
      >
        <StackedBar
          rows={filasEstres}
          segments={segmentosEstres}
          showValues
          ariaLabel="Financiamiento por programa con cinco fuentes y nombres largos"
        />
      </DemoExample>
    </div>
  );
}
