import type { GanttTask } from "@carlos-burelo/klin";
import { GanttChart } from "@carlos-burelo/klin";
import { DemoExample } from "../../components/docs/demo-example";

const obraTasks: GanttTask[] = [
  {
    label: "Cimentación",
    start: "2026-03-02",
    end: "2026-03-10",
    progress: 100,
  },
  { label: "Muros", start: "2026-03-11", end: "2026-03-22", progress: 60 },
  { label: "Techo", start: "2026-03-20", end: "2026-03-28", progress: 20 },
  { label: "Acabados", start: "2026-03-27", end: "2026-04-05", progress: 0 },
];

const festivalTasks: GanttTask[] = [
  { label: "Convocatoria", start: "2026-05-04", end: "2026-05-10" },
  { label: "Montaje", start: "2026-05-11", end: "2026-05-14" },
  { label: "Festival", start: "2026-05-15", end: "2026-05-17" },
];

function formatoCorto(d: Date): string {
  return d.toLocaleDateString("es-MX", { day: "numeric", month: "numeric" });
}

export default function GanttChartExamples() {
  return (
    <div className="flex flex-col gap-6">
      <DemoExample
        caption="obra con porcentaje de avance y leyenda visible"
        code={`import { GanttChart } from "@carlos-burelo/klin";

const tasks = [
  {
    label: "Cimentación",
    start: "2026-03-02",
    end: "2026-03-10",
    progress: 100,
  },
  { label: "Muros", start: "2026-03-11", end: "2026-03-22", progress: 60 },
  { label: "Techo", start: "2026-03-20", end: "2026-03-28", progress: 20 },
  { label: "Acabados", start: "2026-03-27", end: "2026-04-05", progress: 0 },
];

<GanttChart
  ariaLabel="Gantt de obra con avance por etapa"
  tasks={tasks}
  showLegend
/>`}
      >
        <GanttChart
          ariaLabel="Gantt de obra con avance por etapa"
          tasks={obraTasks}
          showLegend
        />
      </DemoExample>
      <DemoExample
        caption="festival sin avance, sin leyenda y con fechas cortas"
        code={`import { GanttChart } from "@carlos-burelo/klin";

const tasks = [
  { label: "Convocatoria", start: "2026-05-04", end: "2026-05-10" },
  { label: "Montaje", start: "2026-05-11", end: "2026-05-14" },
  { label: "Festival", start: "2026-05-15", end: "2026-05-17" },
];

function formatoCorto(d: Date): string {
  return d.toLocaleDateString("es-MX", { day: "numeric", month: "numeric" });
}

<GanttChart
  ariaLabel="Gantt de festival sin avance ni leyenda"
  tasks={tasks}
  showLegend={false}
  formatDate={formatoCorto}
/>`}
      >
        <GanttChart
          ariaLabel="Gantt de festival sin avance ni leyenda"
          tasks={festivalTasks}
          showLegend={false}
          formatDate={formatoCorto}
        />
      </DemoExample>
    </div>
  );
}
