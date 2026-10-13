import { DivergingBar } from "@carlos-burelo/klin";
import { DemoExample } from "../../components/docs/demo-example";

export default function DivergingBarExamples() {
  return (
    <div className="flex flex-col gap-6">
      <DemoExample
        caption="Opinión a favor y en contra con leyenda"
        code={`import { DivergingBar } from "@carlos-burelo/klin";

const data = [
  { tema: "Horario", contra: 32, favor: 68 },
  { tema: "Remoto", contra: 25, favor: 75 },
  { tema: "Comedor", contra: 45, favor: 55 },
  { tema: "Transporte", contra: 58, favor: 42 },
];

<DivergingBar
  ariaLabel="Barras divergentes de opinión sobre el nuevo horario"
  data={data}
  yKey="tema"
  left={{ key: "contra", label: "En contra" }}
  right={{ key: "favor", label: "A favor" }}
/>`}
      >
        <DivergingBar
          ariaLabel="Barras divergentes de opinión sobre el nuevo horario"
          data={[
            { tema: "Horario", contra: 32, favor: 68 },
            { tema: "Remoto", contra: 25, favor: 75 },
            { tema: "Comedor", contra: 45, favor: 55 },
            { tema: "Transporte", contra: 58, favor: 42 },
          ]}
          yKey="tema"
          left={{ key: "contra", label: "En contra" }}
          right={{ key: "favor", label: "A favor" }}
        />
      </DemoExample>
      <DemoExample
        caption="Satisfacción por servicio en porcentaje y sin leyenda"
        code={`import { DivergingBar } from "@carlos-burelo/klin";

const data = [
  { servicio: "Limpieza", mal: 12, bien: 88 },
  { servicio: "Comida", mal: 28, bien: 72 },
  { servicio: "Internet", mal: 41, bien: 59 },
];

<DivergingBar
  ariaLabel="Barras divergentes de satisfacción por servicio en porcentaje"
  data={data}
  yKey="servicio"
  left={{ key: "mal", label: "Insatisfecho" }}
  right={{ key: "bien", label: "Satisfecho" }}
  formatX={(v: number) => \`\${v} %\`}
  showLegend={false}
/>`}
      >
        <DivergingBar
          ariaLabel="Barras divergentes de satisfacción por servicio en porcentaje"
          data={[
            { servicio: "Limpieza", mal: 12, bien: 88 },
            { servicio: "Comida", mal: 28, bien: 72 },
            { servicio: "Internet", mal: 41, bien: 59 },
          ]}
          yKey="servicio"
          left={{ key: "mal", label: "Insatisfecho" }}
          right={{ key: "bien", label: "Satisfecho" }}
          formatX={(v: number) => `${v} %`}
          showLegend={false}
        />
      </DemoExample>
      <DemoExample
        caption="Votación cerrada con línea de mitad anotada"
        code={`import { DivergingBar } from "@carlos-burelo/klin";

const data = [
  { propuesta: "Parque", no: 49, si: 51 },
  { propuesta: "Alumbrado", no: 38, si: 62 },
  { propuesta: "Mercado", no: 55, si: 45 },
];

<DivergingBar
  ariaLabel="Barras divergentes de votación por propuesta con línea de mitad"
  data={data}
  yKey="propuesta"
  left={{ key: "no", label: "No" }}
  right={{ key: "si", label: "Sí" }}
  annotations={[{ value: 50, label: "Mitad" }]}
/>`}
      >
        <DivergingBar
          ariaLabel="Barras divergentes de votación por propuesta con línea de mitad"
          data={[
            { propuesta: "Parque", no: 49, si: 51 },
            { propuesta: "Alumbrado", no: 38, si: 62 },
            { propuesta: "Mercado", no: 55, si: 45 },
          ]}
          yKey="propuesta"
          left={{ key: "no", label: "No" }}
          right={{ key: "si", label: "Sí" }}
          annotations={[{ value: 50, label: "Mitad" }]}
        />
      </DemoExample>
    </div>
  );
}
