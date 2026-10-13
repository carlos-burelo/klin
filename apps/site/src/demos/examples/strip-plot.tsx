import { StripPlot } from "@carlos-burelo/klin";
import { DemoExample } from "../../components/docs/demo-example";

const groups = [
  { label: "Turno A", values: [12, 15, 14, 18, 11, 16, 13] },
  { label: "Turno B", values: [22, 19, 25, 21, 24] },
  { label: "Turno C", values: [9, 11, 8, 13, 10, 12] },
];

export default function StripPlotExamples() {
  return (
    <div className="flex flex-col gap-6">
      <DemoExample
        caption="Defectos por turno con jitter determinista"
        code={`import { StripPlot } from "@carlos-burelo/klin";

const groups = [
  { label: "Turno A", values: [12, 15, 14, 18, 11, 16, 13] },
  { label: "Turno B", values: [22, 19, 25, 21, 24] },
  { label: "Turno C", values: [9, 11, 8, 13, 10, 12] },
];

<StripPlot
  ariaLabel="Defectos por turno en piezas por hora"
  groups={groups}
/>`}
      >
        <StripPlot
          ariaLabel="Defectos por turno en piezas por hora"
          groups={groups}
        />
      </DemoExample>
      <DemoExample
        caption="Sin dispersión y con otra semilla"
        code={`import { StripPlot } from "@carlos-burelo/klin";

<StripPlot
  ariaLabel="Defectos alineados por turno"
  groups={groups}
  jitter={0}
  seed={7}
/>`}
      >
        <StripPlot
          ariaLabel="Defectos alineados por turno"
          groups={groups}
          jitter={0}
          seed={7}
        />
      </DemoExample>
    </div>
  );
}
