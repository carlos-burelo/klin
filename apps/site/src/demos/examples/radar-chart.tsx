import type { RadarSeries } from "@carlos-burelo/klin";
import { RadarChart } from "@carlos-burelo/klin";
import { DemoExample } from "../../components/docs/demo-example";

const ejes = ["Sabor", "Precio", "Servicio", "Limpieza", "Ubicación"];

const restaurantes: RadarSeries[] = [
  { label: "Fonda Centro", values: [8, 9, 7, 8, 6] },
  { label: "Cocina Norte", values: [7, 6, 9, 7, 8] },
];

const puesto: RadarSeries[] = [
  { label: "Candidata A", values: [90, 70, 85, 60, 75, 80] },
  { label: "Candidato B", values: [60, 85, 70, 90, 65, 70] },
];

const ejesPuesto = [
  "Código",
  "Diseño",
  "Datos",
  "Comunicación",
  "Liderazgo",
  "Dominio",
];

const mínimo: RadarSeries[] = [
  { label: "Turno A", values: [4, 4, 5, 4, 5] },
  { label: "Turno B", values: [3, 5, 4, 5, 4] },
  { label: "Turno C", values: [5, 3, 4, 3, 5] },
];

export default function RadarChartExamples() {
  return (
    <div className="flex flex-col gap-6">
      <DemoExample
        caption="dos perfiles con leyenda"
        code={`import type { RadarSeries } from "@carlos-burelo/klin";
import { RadarChart } from "@carlos-burelo/klin";

const ejes = ["Sabor", "Precio", "Servicio", "Limpieza", "Ubicación"];

const restaurantes: RadarSeries[] = [
  { label: "Fonda Centro", values: [8, 9, 7, 8, 6] },
  { label: "Cocina Norte", values: [7, 6, 9, 7, 8] },
];

<RadarChart
  axes={ejes}
  series={restaurantes}
  ariaLabel="Comparativa de dos restaurantes en cinco criterios"
/>`}
      >
        <RadarChart
          axes={ejes}
          series={restaurantes}
          ariaLabel="Comparativa de dos restaurantes en cinco criterios"
        />
      </DemoExample>
      <DemoExample
        caption="escala fija a 100 con 3 niveles y sin leyenda"
        code={`import type { RadarSeries } from "@carlos-burelo/klin";
import { RadarChart } from "@carlos-burelo/klin";

const ejesPuesto = [
  "Código",
  "Diseño",
  "Datos",
  "Comunicación",
  "Liderazgo",
  "Dominio",
];

const puesto: RadarSeries[] = [
  { label: "Candidata A", values: [90, 70, 85, 60, 75, 80] },
  { label: "Candidato B", values: [60, 85, 70, 90, 65, 70] },
];

<RadarChart
  axes={ejesPuesto}
  series={puesto}
  levels={3}
  maxValue={100}
  format={(v) => \`\${v} pts\`}
  showLegend={false}
  ariaLabel="Evaluación de candidatos sobre escala de 100 puntos"
/>`}
      >
        <RadarChart
          axes={ejesPuesto}
          series={puesto}
          levels={3}
          maxValue={100}
          format={(v) => `${v} pts`}
          showLegend={false}
          ariaLabel="Evaluación de candidatos sobre escala de 100 puntos"
        />
      </DemoExample>
      <DemoExample
        caption="tres series con 5 niveles y colores por serie"
        code={`import type { RadarSeries } from "@carlos-burelo/klin";
import { RadarChart } from "@carlos-burelo/klin";

const ejes = ["Sabor", "Precio", "Servicio", "Limpieza", "Ubicación"];

const mínimo: RadarSeries[] = [
  { label: "Turno A", values: [4, 4, 5, 4, 5] },
  { label: "Turno B", values: [3, 5, 4, 5, 4] },
  { label: "Turno C", values: [5, 3, 4, 3, 5] },
];

<RadarChart
  axes={ejes}
  series={mínimo.map((s, i) => ({
    ...s,
    color: \`var(--chart-\${i + 1})\`,
  }))}
  levels={5}
  maxValue={5}
  ariaLabel="Desempeño de tres turnos sobre escala de 5"
/>`}
      >
        <RadarChart
          axes={ejes}
          series={mínimo.map((s, i) => ({
            ...s,
            color: `var(--chart-${i + 1})`,
          }))}
          levels={5}
          maxValue={5}
          ariaLabel="Desempeño de tres turnos sobre escala de 5"
        />
      </DemoExample>
    </div>
  );
}
