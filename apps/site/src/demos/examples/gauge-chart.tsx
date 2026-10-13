import { GaugeChart } from "@carlos-burelo/klin";
import { DemoExample } from "../../components/docs/demo-example";

export default function GaugeChartExamples() {
  return (
    <div className="flex flex-col gap-6">
      <DemoExample
        caption="Avance medio con etiqueta de satisfacción"
        code={`import { GaugeChart } from "@carlos-burelo/klin";

<GaugeChart
  ariaLabel="Velocímetro de satisfacción al 72 por ciento"
  label="Satisfacción"
  value={72}
/>`}
      >
        <GaugeChart
          ariaLabel="Velocímetro de satisfacción al 72 por ciento"
          label="Satisfacción"
          value={72}
        />
      </DemoExample>
      <DemoExample
        caption="Valor alto con color propio y formato de porcentaje"
        code={`import { GaugeChart } from "@carlos-burelo/klin";

<GaugeChart
  ariaLabel="Velocímetro de ocupación hotelera al 93 por ciento"
  label="Ocupación"
  value={93}
  color="#16a34a"
  format={(v: number) => \`\${Math.round(v)} %\`}
/>`}
      >
        <GaugeChart
          ariaLabel="Velocímetro de ocupación hotelera al 93 por ciento"
          label="Ocupación"
          value={93}
          color="#16a34a"
          format={(v: number) => `${Math.round(v)} %`}
        />
      </DemoExample>
      <DemoExample
        caption="Valor bajo sin etiqueta y con riel personalizado"
        code={`import { GaugeChart } from "@carlos-burelo/klin";

<GaugeChart
  ariaLabel="Velocímetro de batería al 28 por ciento sin etiqueta"
  value={28}
  trackColor="#d4d4d8"
  format={(v: number) => \`\${Math.round(v)} %\`}
/>`}
      >
        <GaugeChart
          ariaLabel="Velocímetro de batería al 28 por ciento sin etiqueta"
          value={28}
          trackColor="#d4d4d8"
          format={(v: number) => `${Math.round(v)} %`}
        />
      </DemoExample>
    </div>
  );
}
