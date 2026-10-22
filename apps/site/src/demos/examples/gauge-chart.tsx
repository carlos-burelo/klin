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
      <DemoExample
        caption="Semáforo de calidad del aire con tres tramos de color"
        code={`import { GaugeChart } from "@carlos-burelo/klin";

<GaugeChart
  ariaLabel="Velocímetro de calidad del aire en 72 con semáforo verde hasta 50, ámbar hasta 80 y rojo hasta 100"
  label="Calidad del aire"
  value={72}
  color="#f59e0b"
  zones={[
    { from: 0, to: 50, color: "#16a34a" },
    { from: 50, to: 80, color: "#f59e0b" },
    { from: 80, to: 100, color: "#dc2626" },
  ]}
/>`}
      >
        <GaugeChart
          ariaLabel="Velocímetro de calidad del aire en 72 con semáforo verde hasta 50, ámbar hasta 80 y rojo hasta 100"
          label="Calidad del aire"
          value={72}
          color="#f59e0b"
          zones={[
            { from: 0, to: 50, color: "#16a34a" },
            { from: 50, to: 80, color: "#f59e0b" },
            { from: 80, to: 100, color: "#dc2626" },
          ]}
        />
      </DemoExample>
      <DemoExample
        caption="Estrés: nombre largo con 5 tramos de color y 9 marcas de escala"
        code={`import { GaugeChart } from "@carlos-burelo/klin";

<GaugeChart
  ariaLabel="Velocímetro del índice metropolitano de calidad del aire en 87 con cinco tramos de color"
  label="Índice metropolitano de calidad del aire"
  value={87}
  color="#f59e0b"
  tickCount={9}
  zones={[
    { from: 0, to: 20, color: "#16a34a" },
    { from: 20, to: 40, color: "#84cc16" },
    { from: 40, to: 60, color: "#eab308" },
    { from: 60, to: 80, color: "#f59e0b" },
    { from: 80, to: 100, color: "#dc2626" },
  ]}
/>`}
      >
        <GaugeChart
          ariaLabel="Velocímetro del índice metropolitano de calidad del aire en 87 con cinco tramos de color"
          label="Índice metropolitano de calidad del aire"
          value={87}
          color="#f59e0b"
          tickCount={9}
          zones={[
            { from: 0, to: 20, color: "#16a34a" },
            { from: 20, to: 40, color: "#84cc16" },
            { from: 40, to: 60, color: "#eab308" },
            { from: 60, to: 80, color: "#f59e0b" },
            { from: 80, to: 100, color: "#dc2626" },
          ]}
        />
      </DemoExample>
    </div>
  );
}
