import { BumpChart } from "@carlos-burelo/klin";
import { DemoExample } from "../../components/docs/demo-example";

export default function BumpChartExamples() {
  return (
    <div className="flex flex-col gap-6">
      <DemoExample
        caption="Cuatro estados en cuatro años"
        code={`import { BumpChart, type BumpSeries } from "@carlos-burelo/klin";

const periods = ["2022", "2023", "2024", "2025"];

const series: BumpSeries[] = [
  { label: "Nuevo León", ranks: [2, 1, 1, 1] },
  { label: "Jalisco", ranks: [1, 2, 3, 2] },
  { label: "Querétaro", ranks: [4, 3, 2, 3] },
  { label: "Puebla", ranks: [3, 4, 4, 4] },
];

<BumpChart
  ariaLabel="Posición de estados en captación de inversión extranjera de 2022 a 2025, con Nuevo León líder desde 2023"
  periods={periods}
  series={series}
/>`}
      >
        <BumpChart
          ariaLabel="Posición de estados en captación de inversión extranjera de 2022 a 2025, con Nuevo León líder desde 2023"
          periods={["2022", "2023", "2024", "2025"]}
          series={[
            { label: "Nuevo León", ranks: [2, 1, 1, 1] },
            { label: "Jalisco", ranks: [1, 2, 3, 2] },
            { label: "Querétaro", ranks: [4, 3, 2, 3] },
            { label: "Puebla", ranks: [3, 4, 4, 4] },
          ]}
        />
      </DemoExample>
      <DemoExample
        caption="Clásico de dos equipos en tres torneos"
        code={`import { BumpChart, type BumpSeries } from "@carlos-burelo/klin";

const periods = ["Ap 2024", "Cl 2025", "Ap 2025"];

const series: BumpSeries[] = [
  { label: "América", ranks: [3, 1, 1] },
  { label: "Chivas", ranks: [6, 4, 5] },
];

<BumpChart
  ariaLabel="Posición del América y Chivas en tres torneos, con América arriba en los tres"
  periods={periods}
  series={series}
/>`}
      >
        <BumpChart
          ariaLabel="Posición del América y Chivas en tres torneos, con América arriba en los tres"
          periods={["Ap 2024", "Cl 2025", "Ap 2025"]}
          series={[
            { label: "América", ranks: [3, 1, 1] },
            { label: "Chivas", ranks: [6, 4, 5] },
          ]}
        />
      </DemoExample>
      <DemoExample
        caption="Apps de delivery con remontada"
        code={`import { BumpChart, type BumpSeries } from "@carlos-burelo/klin";

const periods = ["2023", "2024", "2025"];

const series: BumpSeries[] = [
  { label: "Rappi", ranks: [1, 2, 2] },
  { label: "Uber Eats", ranks: [2, 1, 1] },
  { label: "DiDi Food", ranks: [3, 3, 3] },
];

<BumpChart
  ariaLabel="Posición de apps de delivery por descargas en México de 2023 a 2025, con Uber Eats tomando el liderato en 2024"
  periods={periods}
  series={series}
/>`}
      >
        <BumpChart
          ariaLabel="Posición de apps de delivery por descargas en México de 2023 a 2025, con Uber Eats tomando el liderato en 2024"
          periods={["2023", "2024", "2025"]}
          series={[
            { label: "Rappi", ranks: [1, 2, 2] },
            { label: "Uber Eats", ranks: [2, 1, 1] },
            { label: "DiDi Food", ranks: [3, 3, 3] },
          ]}
        />
      </DemoExample>
      <DemoExample
        caption="Estrés: 8 universidades en 6 años recortadas a top 5 con topN"
        code={`import { BumpChart, type BumpSeries } from "@carlos-burelo/klin";

const periods = ["2020", "2021", "2022", "2023", "2024", "2025"];

const series: BumpSeries[] = [
  { label: "UNAM", ranks: [1, 1, 1, 1, 1, 1] },
  { label: "Tec de Monterrey", ranks: [2, 3, 2, 2, 2, 2] },
  { label: "IPN", ranks: [3, 2, 3, 4, 3, 3] },
  { label: "UAM", ranks: [5, 4, 4, 3, 4, 4] },
  { label: "UDG", ranks: [4, 5, 6, 5, 5, 5] },
  { label: "UANL", ranks: [6, 6, 5, 6, 6, 6] },
  { label: "BUAP", ranks: [8, 7, 7, 7, 7, 7] },
  { label: "UV", ranks: [7, 8, 8, 8, 8, 8] },
];

<BumpChart
  ariaLabel="Ranking de ocho universidades en seis años recortado a las cinco mejores"
  periods={periods}
  series={series}
  topN={5}
/>`}
      >
        <BumpChart
          ariaLabel="Ranking de ocho universidades en seis años recortado a las cinco mejores"
          periods={["2020", "2021", "2022", "2023", "2024", "2025"]}
          series={[
            { label: "UNAM", ranks: [1, 1, 1, 1, 1, 1] },
            { label: "Tec de Monterrey", ranks: [2, 3, 2, 2, 2, 2] },
            { label: "IPN", ranks: [3, 2, 3, 4, 3, 3] },
            { label: "UAM", ranks: [5, 4, 4, 3, 4, 4] },
            { label: "UDG", ranks: [4, 5, 6, 5, 5, 5] },
            { label: "UANL", ranks: [6, 6, 5, 6, 6, 6] },
            { label: "BUAP", ranks: [8, 7, 7, 7, 7, 7] },
            { label: "UV", ranks: [7, 8, 8, 8, 8, 8] },
          ]}
          topN={5}
        />
      </DemoExample>
    </div>
  );
}
