import { CohortChart } from "@carlos-burelo/klin";
import { DemoExample } from "../../components/docs/demo-example";

const cohorts = [
  { label: "Ene", values: [500, 320, 210, 140] },
  { label: "Feb", values: [420, 260, 150] },
  { label: "Mar", values: [480, 300] },
];

export default function CohortChartExamples() {
  return (
    <div className="flex flex-col gap-6">
      <DemoExample
        caption="Retención triangular con etiquetas de periodo"
        code={`import { CohortChart } from "@carlos-burelo/klin";

const cohorts = [
  { label: "Ene", values: [500, 320, 210, 140] },
  { label: "Feb", values: [420, 260, 150] },
  { label: "Mar", values: [480, 300] },
];

<CohortChart
  ariaLabel="Retención trimestral por cohorte de registro"
  cohorts={cohorts}
  periodLabels={["Sem 0", "Sem 1", "Sem 2", "Sem 3"]}
/>`}
      >
        <CohortChart
          ariaLabel="Retención trimestral por cohorte de registro"
          cohorts={cohorts}
          periodLabels={["Sem 0", "Sem 1", "Sem 2", "Sem 3"]}
        />
      </DemoExample>
      <DemoExample
        caption="Valores siempre visibles con formato propio"
        code={`import { CohortChart } from "@carlos-burelo/klin";

<CohortChart
  ariaLabel="Retención con valores siempre visibles"
  cohorts={cohorts}
  showValues="always"
  format={(v: number) => \`ret \${Math.round(v * 100)}%\`}
/>`}
      >
        <CohortChart
          ariaLabel="Retención con valores siempre visibles"
          cohorts={cohorts}
          showValues="always"
          format={(v: number) => `ret ${Math.round(v * 100)}%`}
        />
      </DemoExample>
    </div>
  );
}
