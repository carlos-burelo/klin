import type { QuadrantPoint } from "@carlos-burelo/klin";
import { QuadrantChart } from "@carlos-burelo/klin";
import { DemoExample } from "../../components/docs/demo-example";

const iniciativas: QuadrantPoint[] = [
  { x: 80, y: 85, label: "Pagos en línea" },
  { x: 30, y: 75, label: "Chat de ayuda" },
  { x: 65, y: 25, label: "App móvil" },
  { x: 20, y: 15, label: "Kioscos" },
];

const riesgos: QuadrantPoint[] = [
  { x: 85, y: 90, label: "Falla eléctrica" },
  { x: 70, y: 60, label: "Ciberataque" },
  { x: 25, y: 80, label: "Sismo" },
  { x: 40, y: 30, label: "Fuga menor" },
];

const concentrados: QuadrantPoint[] = [
  { x: 72, y: 78, label: "Beca A" },
  { x: 78, y: 82, label: "Beca B" },
  { x: 74, y: 88, label: "Beca C" },
  { x: 81, y: 75, label: "Beca D" },
  { x: 15, y: 20, label: "Beca E" },
];

export default function QuadrantChartExamples() {
  return (
    <div className="flex flex-col gap-6">
      <DemoExample
        caption="matriz esfuerzo-impacto con etiquetas por defecto"
        code={`import type { QuadrantPoint } from "@carlos-burelo/klin";
import { QuadrantChart } from "@carlos-burelo/klin";

const iniciativas: QuadrantPoint[] = [
  { x: 80, y: 85, label: "Pagos en línea" },
  { x: 30, y: 75, label: "Chat de ayuda" },
  { x: 65, y: 25, label: "App móvil" },
  { x: 20, y: 15, label: "Kioscos" },
];

<QuadrantChart
  points={iniciativas}
  ariaLabel="Priorización de iniciativas por esfuerzo e impacto"
/>`}
      >
        <QuadrantChart
          points={iniciativas}
          ariaLabel="Priorización de iniciativas por esfuerzo e impacto"
        />
      </DemoExample>
      <DemoExample
        caption="ejes y cuadrantes personalizados de riesgo"
        code={`import type { QuadrantPoint } from "@carlos-burelo/klin";
import { QuadrantChart } from "@carlos-burelo/klin";

const riesgos: QuadrantPoint[] = [
  { x: 85, y: 90, label: "Falla eléctrica" },
  { x: 70, y: 60, label: "Ciberataque" },
  { x: 25, y: 80, label: "Sismo" },
  { x: 40, y: 30, label: "Fuga menor" },
];

<QuadrantChart
  points={riesgos}
  xLabel="→ Probabilidad"
  yLabel="↑ Severidad"
  quads={["Críticos", "Monitorear", "Plan menor", "Aceptar"]}
  ariaLabel="Mapa de riesgos por probabilidad y severidad"
/>`}
      >
        <QuadrantChart
          points={riesgos}
          xLabel="→ Probabilidad"
          yLabel="↑ Severidad"
          quads={["Críticos", "Monitorear", "Plan menor", "Aceptar"]}
          ariaLabel="Mapa de riesgos por probabilidad y severidad"
        />
      </DemoExample>
      <DemoExample
        caption="puntos concentrados en un cuadrante"
        code={`import type { QuadrantPoint } from "@carlos-burelo/klin";
import { QuadrantChart } from "@carlos-burelo/klin";

const concentrados: QuadrantPoint[] = [
  { x: 72, y: 78, label: "Beca A" },
  { x: 78, y: 82, label: "Beca B" },
  { x: 74, y: 88, label: "Beca C" },
  { x: 81, y: 75, label: "Beca D" },
  { x: 15, y: 20, label: "Beca E" },
];

<QuadrantChart
  points={concentrados}
  xLabel="→ Cobertura"
  yLabel="↑ Equidad"
  quads={["Prioritarias", "Ideales", "Revisar", "Descartar"]}
  ariaLabel="Becas concentradas en alta cobertura y equidad"
/>`}
      >
        <QuadrantChart
          points={concentrados}
          xLabel="→ Cobertura"
          yLabel="↑ Equidad"
          quads={["Prioritarias", "Ideales", "Revisar", "Descartar"]}
          ariaLabel="Becas concentradas en alta cobertura y equidad"
        />
      </DemoExample>
    </div>
  );
}
