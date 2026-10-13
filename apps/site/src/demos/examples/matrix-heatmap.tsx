import { MatrixHeatmap } from "@carlos-burelo/klin";
import { DemoExample } from "../../components/docs/demo-example";

export default function MatrixHeatmapExamples() {
  return (
    <div className="flex flex-col gap-6">
      <DemoExample
        caption="Asistencia de tres grupos en tres días"
        code={`import { MatrixHeatmap } from "@carlos-burelo/klin";

const rows = ["Primero", "Segundo", "Tercero"];
const cols = ["Lunes", "Martes", "Miércoles"];
const values = [
  [28, 30, 27],
  [25, 26, 24],
  [30, 29, 31],
];

<MatrixHeatmap
  ariaLabel="Mapa de calor de asistencia por grupo y día"
  rows={rows}
  cols={cols}
  values={values}
/>`}
      >
        <MatrixHeatmap
          ariaLabel="Mapa de calor de asistencia por grupo y día"
          rows={["Primero", "Segundo", "Tercero"]}
          cols={["Lunes", "Martes", "Miércoles"]}
          values={[
            [28, 30, 27],
            [25, 26, 24],
            [30, 29, 31],
          ]}
        />
      </DemoExample>
      <DemoExample
        caption="Reportes con días en cero, color propio y formato de casos"
        code={`import { MatrixHeatmap } from "@carlos-burelo/klin";

const rows = ["Norte", "Sur"];
const cols = ["Lunes", "Martes", "Miércoles", "Jueves"];
const values = [
  [3, 0, 5, 2],
  [0, 1, 0, 4],
];

<MatrixHeatmap
  ariaLabel="Mapa de calor de reportes por sede con días sin casos"
  rows={rows}
  cols={cols}
  values={values}
  color="#2563eb"
  format={(v: number) => \`\${v} reportes\`}
/>`}
      >
        <MatrixHeatmap
          ariaLabel="Mapa de calor de reportes por sede con días sin casos"
          rows={["Norte", "Sur"]}
          cols={["Lunes", "Martes", "Miércoles", "Jueves"]}
          values={[
            [3, 0, 5, 2],
            [0, 1, 0, 4],
          ]}
          color="#2563eb"
          format={(v: number) => `${v} reportes`}
        />
      </DemoExample>
      <DemoExample
        caption="Ocupación de dos salas en cuatro turnos"
        code={`import { MatrixHeatmap } from "@carlos-burelo/klin";

const rows = ["Sala A", "Sala B"];
const cols = ["Mañana", "Mediodía", "Tarde", "Noche"];
const values = [
  [12, 20, 18, 6],
  [8, 15, 22, 10],
];

<MatrixHeatmap
  ariaLabel="Mapa de calor de ocupación por sala y turno"
  rows={rows}
  cols={cols}
  format={(v: number) => \`\${v} personas\`}
  values={values}
/>`}
      >
        <MatrixHeatmap
          ariaLabel="Mapa de calor de ocupación por sala y turno"
          rows={["Sala A", "Sala B"]}
          cols={["Mañana", "Mediodía", "Tarde", "Noche"]}
          format={(v: number) => `${v} personas`}
          values={[
            [12, 20, 18, 6],
            [8, 15, 22, 10],
          ]}
        />
      </DemoExample>
    </div>
  );
}
