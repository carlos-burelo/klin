import type { TimelineEvent } from "@carlos-burelo/klin";
import { TimelineChart } from "@carlos-burelo/klin";
import { DemoExample } from "../../components/docs/demo-example";

const feriaEvents: TimelineEvent[] = [
  {
    date: "10 may",
    label: "Inauguración",
    detail: "Corte de listón y recorrido",
    done: true,
  },
  {
    date: "11 may",
    label: "Talleres",
    detail: "Cartonería y cocina tradicional",
    done: true,
  },
  { date: "12 may", label: "Concierto", detail: "Son jarocho en el foro" },
  { date: "13 may", label: "Clausura", detail: "Premiación de expositores" },
];

const cicloEvents: TimelineEvent[] = [
  { date: "ago", label: "Inscripciones" },
  { date: "sep", label: "Inicio de clases" },
  { date: "dic", label: "Evaluación" },
  { date: "ene", label: "Vacaciones" },
];

const semestreEvents: TimelineEvent[] = [
  {
    date: "2026-03-20",
    label: "Festival",
    detail: "Muestra de talleres en el patio",
  },
  {
    date: "2026-01-12",
    label: "Inscripción",
    detail: "Registro en línea",
    done: true,
  },
  { date: "2026-05-05", label: "Clausura", detail: "Entrega de constancias" },
  {
    date: "2026-02-02",
    label: "Inicio",
    detail: "Bienvenida y grupos",
    done: true,
  },
];

const estresEvents: TimelineEvent[] = [
  {
    date: "2026-01-05",
    label: "Convocatoria",
    detail: "Publicación de bases",
    done: true,
  },
  {
    date: "2026-01-12",
    label: "Registro",
    detail: "Alta de participantes",
    done: true,
  },
  {
    date: "2026-01-19",
    label: "Sorteo",
    detail: "Asignación de turnos",
    done: true,
  },
  {
    date: "2026-01-26",
    label: "Taller 1",
    detail: "Cartonería básica",
    done: true,
  },
  {
    date: "2026-02-02",
    label: "Taller 2",
    detail: "Cocina tradicional",
    done: true,
  },
  {
    date: "2026-02-09",
    label: "Taller 3",
    detail: "Danza regional",
    done: true,
  },
  { date: "2026-02-16", label: "Ensayo", detail: "Prueba de foro" },
  { date: "2026-02-23", label: "Montaje", detail: "Carpas y sonido" },
  { date: "2026-03-02", label: "Inauguración", detail: "Corte de listón" },
  { date: "2026-03-03", label: "Feria día 1", detail: "Exposición y venta" },
  { date: "2026-03-04", label: "Feria día 2", detail: "Talleres abiertos" },
  { date: "2026-03-05", label: "Feria día 3", detail: "Concierto estelar" },
  { date: "2026-03-06", label: "Desmontaje", detail: "Retiro de stands" },
  { date: "2026-03-09", label: "Conteo", detail: "Corte de caja" },
  { date: "2026-03-12", label: "Premiación", detail: "Mejores expositores" },
  { date: "2026-03-15", label: "Reporte", detail: "Informe a comité" },
  { date: "2026-03-18", label: "Pagos", detail: "Liquidación a talleres" },
  { date: "2026-03-21", label: "Encuesta", detail: "Satisfacción vecinal" },
  { date: "2026-03-24", label: "Acta", detail: "Firma de cierre" },
  { date: "2026-03-27", label: "Clausura", detail: "Publicación de memoria" },
];

export default function TimelineChartExamples() {
  return (
    <div className="flex flex-col gap-6">
      <DemoExample
        caption="feria con avance parcial y detalle por hito"
        code={`import { TimelineChart } from "@carlos-burelo/klin";

const events = [
  {
    date: "10 may",
    label: "Inauguración",
    detail: "Corte de listón y recorrido",
    done: true,
  },
  {
    date: "11 may",
    label: "Talleres",
    detail: "Cartonería y cocina tradicional",
    done: true,
  },
  { date: "12 may", label: "Concierto", detail: "Son jarocho en el foro" },
  { date: "13 may", label: "Clausura", detail: "Premiación de expositores" },
];

<TimelineChart
  ariaLabel="Línea de tiempo de feria con dos hitos completados"
  events={events}
/>`}
      >
        <TimelineChart
          ariaLabel="Línea de tiempo de feria con dos hitos completados"
          events={feriaEvents}
        />
      </DemoExample>
      <DemoExample
        caption="ciclo escolar pendiente sin detalles ni avances"
        code={`import { TimelineChart } from "@carlos-burelo/klin";

const events = [
  { date: "ago", label: "Inscripciones" },
  { date: "sep", label: "Inicio de clases" },
  { date: "dic", label: "Evaluación" },
  { date: "ene", label: "Vacaciones" },
];

<TimelineChart
  ariaLabel="Línea de tiempo de ciclo escolar pendiente sin avances"
  events={events}
/>`}
      >
        <TimelineChart
          ariaLabel="Línea de tiempo de ciclo escolar pendiente sin avances"
          events={cicloEvents}
        />
      </DemoExample>
      <DemoExample
        caption="semestre desordenado que se ordena por fecha con leyenda"
        code={`import { TimelineChart } from "@carlos-burelo/klin";

const events = [
  {
    date: "2026-03-20",
    label: "Festival",
    detail: "Muestra de talleres en el patio",
  },
  { date: "2026-01-12", label: "Inscripción", detail: "Registro en línea", done: true },
  { date: "2026-05-05", label: "Clausura", detail: "Entrega de constancias" },
  { date: "2026-02-02", label: "Inicio", detail: "Bienvenida y grupos", done: true },
];

<TimelineChart
  ariaLabel="Línea de tiempo de semestre ordenada por fecha con leyenda"
  events={events}
  sortBy="date"
  showLegend
/>`}
      >
        <TimelineChart
          ariaLabel="Línea de tiempo de semestre ordenada por fecha con leyenda"
          events={semestreEvents}
          sortBy="date"
          showLegend
        />
      </DemoExample>
      <DemoExample
        caption="estrés de feria con 20 hitos densos y avance parcial"
        code={`import { TimelineChart } from "@carlos-burelo/klin";

const events = [
  {
    date: "2026-01-05",
    label: "Convocatoria",
    detail: "Publicación de bases",
    done: true,
  },
  {
    date: "2026-01-12",
    label: "Registro",
    detail: "Alta de participantes",
    done: true,
  },
  {
    date: "2026-01-19",
    label: "Sorteo",
    detail: "Asignación de turnos",
    done: true,
  },
  {
    date: "2026-01-26",
    label: "Taller 1",
    detail: "Cartonería básica",
    done: true,
  },
  {
    date: "2026-02-02",
    label: "Taller 2",
    detail: "Cocina tradicional",
    done: true,
  },
  {
    date: "2026-02-09",
    label: "Taller 3",
    detail: "Danza regional",
    done: true,
  },
  { date: "2026-02-16", label: "Ensayo", detail: "Prueba de foro" },
  { date: "2026-02-23", label: "Montaje", detail: "Carpas y sonido" },
  { date: "2026-03-02", label: "Inauguración", detail: "Corte de listón" },
  { date: "2026-03-03", label: "Feria día 1", detail: "Exposición y venta" },
  { date: "2026-03-04", label: "Feria día 2", detail: "Talleres abiertos" },
  { date: "2026-03-05", label: "Feria día 3", detail: "Concierto estelar" },
  { date: "2026-03-06", label: "Desmontaje", detail: "Retiro de stands" },
  { date: "2026-03-09", label: "Conteo", detail: "Corte de caja" },
  { date: "2026-03-12", label: "Premiación", detail: "Mejores expositores" },
  { date: "2026-03-15", label: "Reporte", detail: "Informe a comité" },
  { date: "2026-03-18", label: "Pagos", detail: "Liquidación a talleres" },
  { date: "2026-03-21", label: "Encuesta", detail: "Satisfacción vecinal" },
  { date: "2026-03-24", label: "Acta", detail: "Firma de cierre" },
  { date: "2026-03-27", label: "Clausura", detail: "Publicación de memoria" },
];

<TimelineChart
  ariaLabel="Línea de tiempo densa de feria con veinte hitos"
  events={events}
  sortBy="date"
/>`}
      >
        <TimelineChart
          ariaLabel="Línea de tiempo densa de feria con veinte hitos"
          events={estresEvents}
          sortBy="date"
        />
      </DemoExample>
    </div>
  );
}
