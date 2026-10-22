import type { ProgressRow } from "@carlos-burelo/klin";
import { ProgressList } from "@carlos-burelo/klin";
import { DemoExample } from "../../components/docs/demo-example";

const avance: ProgressRow[] = [
  { label: "Inscripción", value: 184, total: 200, detail: "ciclo 2026" },
  { label: "Becas", value: 96, total: 150 },
  { label: "Egresos", value: 41, total: 120, detail: "en trámite" },
];

const presupuesto: ProgressRow[] = [
  { label: "Nómina", value: 4_200_000, total: 5_000_000 },
  { label: "Obra", value: 1_150_000, total: 2_000_000 },
  { label: "Servicios", value: 780_000, total: 800_000 },
];

const metas: ProgressRow[] = [
  { label: "Lectura", value: 3, total: 12 },
  { label: "Ejercicio", value: 9, total: 12 },
  { label: "Ahorro", value: 12, total: 12 },
];

const desorden: ProgressRow[] = [
  { label: "Lectura", value: 3, total: 12 },
  { label: "Ahorro", value: 12, total: 12 },
  { label: "Ejercicio", value: 9, total: 12 },
];

const avanceEstres: ProgressRow[] = Array.from({ length: 40 }, (_, i) => ({
  label: `Trámite ${i + 1}`,
  value: (i * 37) % 101,
  total: 100,
}));

function formatoMoneda(value: number): string {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function ProgressListExamples() {
  return (
    <div className="flex flex-col gap-6">
      <DemoExample
        caption="básico con totales y detalle"
        code={`import type { ProgressRow } from "@carlos-burelo/klin";
import { ProgressList } from "@carlos-burelo/klin";

const avance: ProgressRow[] = [
  { label: "Inscripción", value: 184, total: 200, detail: "ciclo 2026" },
  { label: "Becas", value: 96, total: 150 },
  { label: "Egresos", value: 41, total: 120, detail: "en trámite" },
];

<ProgressList
  rows={avance}
  ariaLabel="Avance de trámites escolares del ciclo 2026"
/>`}
      >
        <ProgressList
          rows={avance}
          ariaLabel="Avance de trámites escolares del ciclo 2026"
        />
      </DemoExample>
      <DemoExample
        caption="formato moneda y color personalizado"
        code={`import type { ProgressRow } from "@carlos-burelo/klin";
import { ProgressList } from "@carlos-burelo/klin";

const presupuesto: ProgressRow[] = [
  { label: "Nómina", value: 4_200_000, total: 5_000_000 },
  { label: "Obra", value: 1_150_000, total: 2_000_000 },
  { label: "Servicios", value: 780_000, total: 800_000 },
];

function formatoMoneda(value: number): string {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 0,
  }).format(value);
}

<ProgressList
  rows={presupuesto}
  format={formatoMoneda}
  color="var(--chart-2)"
  ariaLabel="Ejecución del presupuesto municipal en pesos"
/>`}
      >
        <ProgressList
          rows={presupuesto}
          format={formatoMoneda}
          color="var(--chart-2)"
          ariaLabel="Ejecución del presupuesto municipal en pesos"
        />
      </DemoExample>
      <DemoExample
        caption="valores pequeños contra meta 12 con formato de unidades"
        code={`import type { ProgressRow } from "@carlos-burelo/klin";
import { ProgressList } from "@carlos-burelo/klin";

const metas: ProgressRow[] = [
  { label: "Lectura", value: 3, total: 12 },
  { label: "Ejercicio", value: 9, total: 12 },
  { label: "Ahorro", value: 12, total: 12 },
];

<ProgressList
  rows={metas}
  format={(v) => \`\${v} de 12\`}
  ariaLabel="Metas personales del mes sobre base 12"
/>`}
      >
        <ProgressList
          rows={metas}
          format={(v) => `${v} de 12`}
          ariaLabel="Metas personales del mes sobre base 12"
        />
      </DemoExample>
      <DemoExample
        caption="ordenadas por valor descendente"
        code={`import type { ProgressRow } from "@carlos-burelo/klin";
import { ProgressList } from "@carlos-burelo/klin";

const desorden: ProgressRow[] = [
  { label: "Lectura", value: 3, total: 12 },
  { label: "Ahorro", value: 12, total: 12 },
  { label: "Ejercicio", value: 9, total: 12 },
];

<ProgressList
  rows={desorden}
  sortBy="value"
  format={(v) => \`\${v} de 12\`}
  ariaLabel="Metas personales ordenadas por valor descendente"
/>`}
      >
        <ProgressList
          rows={desorden}
          sortBy="value"
          format={(v) => `${v} de 12`}
          ariaLabel="Metas personales ordenadas por valor descendente"
        />
      </DemoExample>
      <DemoExample
        caption="estrés: 40 filas con avance determinista"
        code={`import type { ProgressRow } from "@carlos-burelo/klin";
import { ProgressList } from "@carlos-burelo/klin";

const avanceEstres: ProgressRow[] = Array.from({ length: 40 }, (_, i) => ({
  label: \`Trámite \${i + 1}\`,
  value: (i * 37) % 101,
  total: 100,
}));

<ProgressList
  rows={avanceEstres}
  ariaLabel="Avance de 40 trámites con valores deterministas"
/>`}
      >
        <ProgressList
          rows={avanceEstres}
          ariaLabel="Avance de 40 trámites con valores deterministas"
        />
      </DemoExample>
    </div>
  );
}
