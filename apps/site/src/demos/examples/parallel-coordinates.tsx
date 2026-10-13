import { ParallelCoordinates } from "@carlos-burelo/klin";
import { DemoExample } from "../../components/docs/demo-example";

const axes = [
  { key: "precio", label: "Precio" },
  { key: "autonomia", label: "Autonomía" },
  { key: "potencia", label: "Potencia" },
];

const rows = [
  { label: "Base", values: { precio: 25, autonomia: 300, potencia: 110 } },
  { label: "Plus", values: { precio: 38, autonomia: 460, potencia: 180 } },
  { label: "Pro", values: { precio: 52, autonomia: 580, potencia: 260 } },
];

export default function ParallelCoordinatesExamples() {
  return (
    <div className="flex flex-col gap-6">
      <DemoExample
        caption="Tres versiones comparadas en tres ejes"
        code={`import { ParallelCoordinates } from "@carlos-burelo/klin";

const axes = [
  { key: "precio", label: "Precio" },
  { key: "autonomia", label: "Autonomía" },
  { key: "potencia", label: "Potencia" },
];

const rows = [
  { label: "Base", values: { precio: 25, autonomia: 300, potencia: 110 } },
  { label: "Plus", values: { precio: 38, autonomia: 460, potencia: 180 } },
  { label: "Pro", values: { precio: 52, autonomia: 580, potencia: 260 } },
];

<ParallelCoordinates
  ariaLabel="Comparativa de versiones en precio, autonomía y potencia"
  axes={axes}
  rows={rows}
/>`}
      >
        <ParallelCoordinates
          ariaLabel="Comparativa de versiones en precio, autonomía y potencia"
          axes={axes}
          rows={rows}
        />
      </DemoExample>
      <DemoExample
        caption="Sin puntos ni leyenda, solo polilíneas"
        code={`import { ParallelCoordinates } from "@carlos-burelo/klin";

<ParallelCoordinates
  ariaLabel="Polilíneas sin vértices"
  axes={axes}
  rows={rows}
  showPoints={false}
  showLegend={false}
/>`}
      >
        <ParallelCoordinates
          ariaLabel="Polilíneas sin vértices"
          axes={axes}
          rows={rows}
          showPoints={false}
          showLegend={false}
        />
      </DemoExample>
    </div>
  );
}
