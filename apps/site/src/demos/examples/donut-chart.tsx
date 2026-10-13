import { DonutChart } from "@carlos-burelo/klin";
import { DemoExample } from "../../components/docs/demo-example";

export default function DonutChartExamples() {
  return (
    <div className="flex flex-col gap-6">
      <DemoExample
        caption="Matrícula por estado con total al centro y leyenda"
        code={`import { DonutChart } from "@carlos-burelo/klin";

const data = [
  { label: "Jalisco", value: 320 },
  { label: "Nuevo León", value: 280 },
  { label: "Puebla", value: 190 },
  { label: "Oaxaca", value: 140 },
  { label: "Yucatán", value: 110 },
];

<DonutChart
  ariaLabel="Dona de matrícula por estado con total de alumnos"
  totalLabel="Alumnos"
  data={data}
/>`}
      >
        <DonutChart
          ariaLabel="Dona de matrícula por estado con total de alumnos"
          totalLabel="Alumnos"
          data={[
            { label: "Jalisco", value: 320 },
            { label: "Nuevo León", value: 280 },
            { label: "Puebla", value: 190 },
            { label: "Oaxaca", value: 140 },
            { label: "Yucatán", value: 110 },
          ]}
        />
      </DemoExample>
      <DemoExample
        caption="Presupuesto por área sin leyenda y con formato de moneda"
        code={`import { DonutChart } from "@carlos-burelo/klin";

const data = [
  { label: "Operación", value: 48 },
  { label: "Nómina", value: 36 },
  { label: "Equipo", value: 12 },
  { label: "Reserva", value: 6 },
];

<DonutChart
  ariaLabel="Dona de presupuesto anual por área en millones de pesos"
  totalLabel="Presupuesto"
  format={(v: number) => \`$\${v} M\`}
  showLegend={false}
  data={data}
/>`}
      >
        <DonutChart
          ariaLabel="Dona de presupuesto anual por área en millones de pesos"
          totalLabel="Presupuesto"
          format={(v: number) => `$${v} M`}
          showLegend={false}
          data={[
            { label: "Operación", value: 48 },
            { label: "Nómina", value: 36 },
            { label: "Equipo", value: 12 },
            { label: "Reserva", value: 6 },
          ]}
        />
      </DemoExample>
      <DemoExample
        caption="Participación dominada por una categoría, sin total al centro"
        code={`import { DonutChart } from "@carlos-burelo/klin";

const data = [
  { label: "Marca líder", value: 58 },
  { label: "Competidor A", value: 22 },
  { label: "Competidor B", value: 13 },
  { label: "Otras", value: 7 },
];

<DonutChart
  ariaLabel="Dona de participación de mercado con una marca dominante"
  showTotal={false}
  format={(v: number) => \`\${v} %\`}
  data={data}
/>`}
      >
        <DonutChart
          ariaLabel="Dona de participación de mercado con una marca dominante"
          showTotal={false}
          format={(v: number) => `${v} %`}
          data={[
            { label: "Marca líder", value: 58 },
            { label: "Competidor A", value: 22 },
            { label: "Competidor B", value: 13 },
            { label: "Otras", value: 7 },
          ]}
        />
      </DemoExample>
    </div>
  );
}
