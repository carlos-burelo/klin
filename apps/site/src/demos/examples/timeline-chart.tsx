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
    </div>
  );
}
