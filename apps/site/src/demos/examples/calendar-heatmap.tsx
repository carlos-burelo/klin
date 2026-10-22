import { CalendarHeatmap } from "@carlos-burelo/klin";
import { DemoExample } from "../../components/docs/demo-example";

export default function CalendarHeatmapExamples() {
  return (
    <div className="flex flex-col gap-6">
      <DemoExample
        caption="Cinco semanas de pedidos diarios en marzo"
        code={`import { CalendarHeatmap } from "@carlos-burelo/klin";

const values = {
  "2026-03-02": 4,
  "2026-03-05": 9,
  "2026-03-11": 6,
  "2026-03-18": 12,
  "2026-03-24": 7,
  "2026-03-30": 10,
};

<CalendarHeatmap
  ariaLabel="Mapa de calor de pedidos diarios de marzo de 2026"
  end="2026-03-31"
  weeks={5}
  values={values}
/>`}
      >
        <CalendarHeatmap
          ariaLabel="Mapa de calor de pedidos diarios de marzo de 2026"
          end="2026-03-31"
          weeks={5}
          values={{
            "2026-03-02": 4,
            "2026-03-05": 9,
            "2026-03-11": 6,
            "2026-03-18": 12,
            "2026-03-24": 7,
            "2026-03-30": 10,
          }}
        />
      </DemoExample>
      <DemoExample
        caption="Doce semanas de lecturas con color propio"
        code={`import { CalendarHeatmap } from "@carlos-burelo/klin";

const values = {
  "2026-04-07": 22,
  "2026-04-21": 35,
  "2026-05-05": 18,
  "2026-05-19": 42,
  "2026-06-02": 27,
  "2026-06-16": 51,
  "2026-06-29": 33,
};

<CalendarHeatmap
  ariaLabel="Mapa de calor de páginas leídas por día en el trimestre"
  end="2026-06-30"
  weeks={12}
  color="#16a34a"
  values={values}
/>`}
      >
        <CalendarHeatmap
          ariaLabel="Mapa de calor de páginas leídas por día en el trimestre"
          end="2026-06-30"
          weeks={12}
          color="#16a34a"
          values={{
            "2026-04-07": 22,
            "2026-04-21": 35,
            "2026-05-05": 18,
            "2026-05-19": 42,
            "2026-06-02": 27,
            "2026-06-16": 51,
            "2026-06-29": 33,
          }}
        />
      </DemoExample>
      <DemoExample
        caption="Racha intensa de una semana con formato de entrenamientos"
        code={`import { CalendarHeatmap } from "@carlos-burelo/klin";

const values = {
  "2026-02-23": 45,
  "2026-02-24": 60,
  "2026-02-25": 52,
  "2026-02-26": 70,
  "2026-02-27": 38,
};

<CalendarHeatmap
  ariaLabel="Mapa de calor de minutos entrenados en una semana de febrero"
  end="2026-02-28"
  weeks={4}
  format={(v: number) => \`\${v} min\`}
  values={values}
/>`}
      >
        <CalendarHeatmap
          ariaLabel="Mapa de calor de minutos entrenados en una semana de febrero"
          end="2026-02-28"
          weeks={4}
          format={(v: number) => `${v} min`}
          values={{
            "2026-02-23": 45,
            "2026-02-24": 60,
            "2026-02-25": 52,
            "2026-02-26": 70,
            "2026-02-27": 38,
          }}
        />
      </DemoExample>
      <DemoExample
        caption="Semana que inicia en domingo"
        code={`import { CalendarHeatmap } from "@carlos-burelo/klin";

const values = {
  "2026-03-01": 5,
  "2026-03-02": 8,
  "2026-03-07": 12,
  "2026-03-08": 6,
};

<CalendarHeatmap
  ariaLabel="Mapa de calor de marzo con semana que inicia en domingo"
  end="2026-03-31"
  weeks={5}
  weekStart={0}
  values={values}
/>`}
      >
        <CalendarHeatmap
          ariaLabel="Mapa de calor de marzo con semana que inicia en domingo"
          end="2026-03-31"
          weeks={5}
          weekStart={0}
          values={{
            "2026-03-01": 5,
            "2026-03-02": 8,
            "2026-03-07": 12,
            "2026-03-08": 6,
          }}
        />
      </DemoExample>
    </div>
  );
}
