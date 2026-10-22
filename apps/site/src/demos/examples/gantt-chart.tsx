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

const sistemaTasks: GanttTask[] = [
  { label: "Diseño", start: "2026-06-01", end: "2026-06-05" },
  {
    label: "Backend",
    start: "2026-06-06",
    end: "2026-06-12",
    dependsOn: ["Diseño"],
  },
  {
    label: "Frontend",
    start: "2026-06-06",
    end: "2026-06-12",
    dependsOn: ["Diseño"],
  },
  {
    label: "Pruebas",
    start: "2026-06-13",
    end: "2026-06-17",
    dependsOn: ["Backend", "Frontend"],
  },
];

const estresTasks: GanttTask[] = [
  {
    label: "Levantamiento",
    start: "2026-07-01",
    end: "2026-07-04",
    progress: 100,
  },
  { label: "Permisos", start: "2026-07-03", end: "2026-07-08", progress: 80 },
  {
    label: "Trazo",
    start: "2026-07-07",
    end: "2026-07-10",
    dependsOn: ["Levantamiento"],
    progress: 60,
  },
  {
    label: "Cimentación",
    start: "2026-07-09",
    end: "2026-07-15",
    dependsOn: ["Trazo", "Permisos"],
    progress: 40,
  },
  {
    label: "Muros",
    start: "2026-07-14",
    end: "2026-07-20",
    dependsOn: ["Cimentación"],
    progress: 30,
  },
  {
    label: "Eléctrica",
    start: "2026-07-16",
    end: "2026-07-21",
    dependsOn: ["Muros"],
    progress: 20,
  },
  {
    label: "Hidráulica",
    start: "2026-07-16",
    end: "2026-07-22",
    dependsOn: ["Muros"],
    progress: 20,
  },
  {
    label: "Techo",
    start: "2026-07-21",
    end: "2026-07-26",
    dependsOn: ["Muros", "Eléctrica"],
    progress: 10,
  },
  {
    label: "Aplanados",
    start: "2026-07-24",
    end: "2026-07-29",
    dependsOn: ["Techo", "Hidráulica"],
    progress: 0,
  },
  {
    label: "Pintura",
    start: "2026-07-28",
    end: "2026-08-02",
    dependsOn: ["Aplanados"],
    progress: 0,
  },
  {
    label: "Pisos",
    start: "2026-07-29",
    end: "2026-08-03",
    dependsOn: ["Aplanados"],
    progress: 0,
  },
  {
    label: "Entrega",
    start: "2026-08-04",
    end: "2026-08-06",
    dependsOn: ["Pintura", "Pisos"],
    progress: 0,
  },
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
      <DemoExample
        caption="sistema con flechas de dependencia entre tareas"
        code={`import { GanttChart } from "@carlos-burelo/klin";

const tasks = [
  { label: "Diseño", start: "2026-06-01", end: "2026-06-05" },
  {
    label: "Backend",
    start: "2026-06-06",
    end: "2026-06-12",
    dependsOn: ["Diseño"],
  },
  {
    label: "Frontend",
    start: "2026-06-06",
    end: "2026-06-12",
    dependsOn: ["Diseño"],
  },
  {
    label: "Pruebas",
    start: "2026-06-13",
    end: "2026-06-17",
    dependsOn: ["Backend", "Frontend"],
  },
];

<GanttChart
  ariaLabel="Gantt de sistema con dependencias entre tareas"
  tasks={tasks}
/>`}
      >
        <GanttChart
          ariaLabel="Gantt de sistema con dependencias entre tareas"
          tasks={sistemaTasks}
        />
      </DemoExample>
      <DemoExample
        caption="estrés de obra con 12 tareas y dependencias cruzadas de avance"
        code={`import { GanttChart } from "@carlos-burelo/klin";

const tasks = [
  {
    label: "Levantamiento",
    start: "2026-07-01",
    end: "2026-07-04",
    progress: 100,
  },
  { label: "Permisos", start: "2026-07-03", end: "2026-07-08", progress: 80 },
  {
    label: "Trazo",
    start: "2026-07-07",
    end: "2026-07-10",
    dependsOn: ["Levantamiento"],
    progress: 60,
  },
  {
    label: "Cimentación",
    start: "2026-07-09",
    end: "2026-07-15",
    dependsOn: ["Trazo", "Permisos"],
    progress: 40,
  },
  {
    label: "Muros",
    start: "2026-07-14",
    end: "2026-07-20",
    dependsOn: ["Cimentación"],
    progress: 30,
  },
  {
    label: "Eléctrica",
    start: "2026-07-16",
    end: "2026-07-21",
    dependsOn: ["Muros"],
    progress: 20,
  },
  {
    label: "Hidráulica",
    start: "2026-07-16",
    end: "2026-07-22",
    dependsOn: ["Muros"],
    progress: 20,
  },
  {
    label: "Techo",
    start: "2026-07-21",
    end: "2026-07-26",
    dependsOn: ["Muros", "Eléctrica"],
    progress: 10,
  },
  {
    label: "Aplanados",
    start: "2026-07-24",
    end: "2026-07-29",
    dependsOn: ["Techo", "Hidráulica"],
    progress: 0,
  },
  {
    label: "Pintura",
    start: "2026-07-28",
    end: "2026-08-02",
    dependsOn: ["Aplanados"],
    progress: 0,
  },
  {
    label: "Pisos",
    start: "2026-07-29",
    end: "2026-08-03",
    dependsOn: ["Aplanados"],
    progress: 0,
  },
  {
    label: "Entrega",
    start: "2026-08-04",
    end: "2026-08-06",
    dependsOn: ["Pintura", "Pisos"],
    progress: 0,
  },
];

<GanttChart
  ariaLabel="Gantt denso de obra con doce tareas y dependencias cruzadas"
  tasks={tasks}
  showLegend
/>`}
      >
        <GanttChart
          ariaLabel="Gantt denso de obra con doce tareas y dependencias cruzadas"
          tasks={estresTasks}
          showLegend
        />
      </DemoExample>
    </div>
  );
}
