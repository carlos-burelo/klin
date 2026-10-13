import { ECDFChart } from "@carlos-burelo/klin";
import { DemoExample } from "../../components/docs/demo-example";

const groups = [
  { label: "2024", values: [120, 150, 180, 200, 240, 300, 380] },
  { label: "2025", values: [100, 130, 160, 190, 220, 260] },
];

export default function ECDFChartExamples() {
  return (
    <div className="flex flex-col gap-6">
      <DemoExample
        caption="Dos cohortes anuales en escalones"
        code={`import { ECDFChart } from "@carlos-burelo/klin";

const groups = [
  { label: "2024", values: [120, 150, 180, 200, 240, 300, 380] },
  { label: "2025", values: [100, 130, 160, 190, 220, 260] },
];

<ECDFChart
  ariaLabel="Fracción de tickets bajo cada tiempo de cierre en horas"
  groups={groups}
/>`}
      >
        <ECDFChart
          ariaLabel="Fracción de tickets bajo cada tiempo de cierre en horas"
          groups={groups}
        />
      </DemoExample>
      <DemoExample
        caption="Con puntos y eje X formateado"
        code={`import { ECDFChart } from "@carlos-burelo/klin";

<ECDFChart
  ariaLabel="ECDF con vértices visibles"
  groups={groups}
  showPoints
  formatX={(v: number) => \`\${v} h\`}
/>`}
      >
        <ECDFChart
          ariaLabel="ECDF con vértices visibles"
          groups={groups}
          showPoints
          formatX={(v: number) => `${v} h`}
        />
      </DemoExample>
    </div>
  );
}
