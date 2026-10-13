import { HorizonChart } from "@carlos-burelo/klin";
import { DemoExample } from "../../components/docs/demo-example";

const series = [
  { label: "Solar", values: [5, 12, 20, 14, 28, 35, 22, 30] },
  { label: "Eólica", values: [8, -6, 15, -12, 24, 10, -4, 18] },
];

export default function HorizonChartExamples() {
  return (
    <div className="flex flex-col gap-6">
      <DemoExample
        caption="Dos fuentes plegadas en espejo con 3 bandas"
        code={`import { HorizonChart } from "@carlos-burelo/klin";

const series = [
  { label: "Solar", values: [5, 12, 20, 14, 28, 35, 22, 30] },
  { label: "Eólica", values: [8, -6, 15, -12, 24, 10, -4, 18] },
];

<HorizonChart
  ariaLabel="Generación renovable diaria en gigavatios hora"
  labels={["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom", "Lun"]}
  series={series}
  bands={3}
/>`}
      >
        <HorizonChart
          ariaLabel="Generación renovable diaria en gigavatios hora"
          labels={["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom", "Lun"]}
          series={series}
          bands={3}
        />
      </DemoExample>
      <DemoExample
        caption="Modo con signo: negativos hacia abajo"
        code={`import { HorizonChart } from "@carlos-burelo/klin";

<HorizonChart
  ariaLabel="Balance con signo por día"
  labels={["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom", "Lun"]}
  series={series}
  mode="offset"
/>`}
      >
        <HorizonChart
          ariaLabel="Balance con signo por día"
          labels={["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom", "Lun"]}
          series={series}
          mode="offset"
        />
      </DemoExample>
    </div>
  );
}
