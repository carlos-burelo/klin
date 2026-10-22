import { RangeChart } from "@carlos-burelo/klin";
import { DemoExample } from "../../components/docs/demo-example";

export default function RangeChartExamples() {
  return (
    <div className="flex flex-col gap-6">
      <DemoExample
        caption="Rangos de humedad con valor observado y remates anchos"
        code={`import { RangeChart, type RangeGroup } from "@carlos-burelo/klin";

const groups: RangeGroup[] = [
  { label: "CDMX", low: 35, high: 72, value: 55 },
  { label: "Veracruz", low: 60, high: 95, value: 82 },
  { label: "Monterrey", low: 25, high: 60, value: 40 },
  { label: "Mérida", low: 55, high: 90, value: 75 },
];

<RangeChart
  ariaLabel="Rango de humedad mínima y máxima con valor observado por ciudad, con Veracruz como la más húmeda"
  groups={groups}
  formatY={(v: number) => \`\${v} %\`}
  capWidth={16}
 />`}
      >
        <RangeChart
          ariaLabel="Rango de humedad mínima y máxima con valor observado por ciudad, con Veracruz como la más húmeda"
          groups={[
            { label: "CDMX", low: 35, high: 72, value: 55 },
            { label: "Veracruz", low: 60, high: 95, value: 82 },
            { label: "Monterrey", low: 25, high: 60, value: 40 },
            { label: "Mérida", low: 55, high: 90, value: 75 },
          ]}
          formatY={(v: number) => `${v} %`}
          capWidth={16}
        />
      </DemoExample>
      <DemoExample
        caption="Solo intervalos con punto medio y formato de miles"
        code={`import { RangeChart, type RangeGroup } from "@carlos-burelo/klin";

const groups: RangeGroup[] = [
  { label: "Soporte", low: 12, high: 18 },
  { label: "Diseño", low: 18, high: 28 },
  { label: "Datos", low: 25, high: 42 },
  { label: "Backend", low: 28, high: 48 },
];

<RangeChart
  ariaLabel="Rango salarial mensual en miles de pesos por puesto, con Backend como el mejor pagado"
  groups={groups}
  formatY={(v: number) => \`$\${v} mil\`}
 />`}
      >
        <RangeChart
          ariaLabel="Rango salarial mensual en miles de pesos por puesto, con Backend como el mejor pagado"
          groups={[
            { label: "Soporte", low: 12, high: 18 },
            { label: "Diseño", low: 18, high: 28 },
            { label: "Datos", low: 25, high: 42 },
            { label: "Backend", low: 28, high: 48 },
          ]}
          formatY={(v: number) => `$${v} mil`}
        />
      </DemoExample>
      <DemoExample
        caption="Precios con tope anotado y sin leyenda"
        code={`import { RangeChart, type RangeGroup } from "@carlos-burelo/klin";

const groups: RangeGroup[] = [
  { label: "Tortilla", low: 22, high: 26, value: 24 },
  { label: "Huevo", low: 48, high: 58, value: 55 },
  { label: "Frijol", low: 32, high: 40, value: 36 },
  { label: "Aceite", low: 42, high: 52, value: 45 },
];

<RangeChart
  ariaLabel="Rango de precio por kilo en tianguis con precio medio observado y tope de 50 pesos, superado solo por el huevo"
  groups={groups}
  formatY={(v: number) => \`$\${v} /kg\`}
  annotations={[{ value: 50, label: "Tope" }]}
  showLegend={false}
/>`}
      >
        <RangeChart
          ariaLabel="Rango de precio por kilo en tianguis con precio medio observado y tope de 50 pesos, superado solo por el huevo"
          groups={[
            { label: "Tortilla", low: 22, high: 26, value: 24 },
            { label: "Huevo", low: 48, high: 58, value: 55 },
            { label: "Frijol", low: 32, high: 40, value: 36 },
            { label: "Aceite", low: 42, high: 52, value: 45 },
          ]}
          formatY={(v: number) => `$${v} /kg`}
          annotations={[{ value: 50, label: "Tope" }]}
          showLegend={false}
        />
      </DemoExample>
      <DemoExample
        caption="Estrés: 18 centrales con nombres largos y rangos ordenados por valor"
        code={`import { RangeChart, type RangeGroup } from "@carlos-burelo/klin";

const groups: RangeGroup[] = [
  { label: "Central de Abastos de Iztapalapa", low: 22, high: 30, value: 26 },
  { label: "Central de Abastos de Ecatepec de Morelos", low: 24, high: 33, value: 29 },
  { label: "Mercado de Abastos de Guadalajara", low: 21, high: 28, value: 24 },
  { label: "Central de Abastos de Monterrey", low: 25, high: 34, value: 31 },
  { label: "Mercado Hidalgo de la Ciudad de Puebla", low: 23, high: 31, value: 27 },
  { label: "Central de Abastos de Villahermosa", low: 26, high: 36, value: 32 },
  { label: "Mercado de Abastos de León Guanajuato", low: 22, high: 29, value: 25 },
  { label: "Central de Abastos de Oaxaca de Juárez", low: 27, high: 38, value: 34 },
  { label: "Mercado de Abastos de Toluca de Lerdo", low: 23, high: 30, value: 26 },
  { label: "Central de Abastos de Querétaro Capital", low: 24, high: 32, value: 28 },
  { label: "Mercado de Abastos de Mérida Yucatán", low: 25, high: 35, value: 30 },
  { label: "Central de Abastos de Tijuana Frontera", low: 28, high: 39, value: 35 },
  { label: "Mercado de Abastos de Chihuahua Capital", low: 26, high: 34, value: 30 },
  { label: "Central de Abastos de Veracruz Puerto", low: 24, high: 33, value: 29 },
  { label: "Mercado de Abastos de Morelia Michoacán", low: 23, high: 31, value: 27 },
  { label: "Central de Abastos de Culiacán Sinaloa", low: 25, high: 36, value: 31 },
  { label: "Mercado de Abastos de Tuxtla Gutiérrez", low: 26, high: 37, value: 33 },
  { label: "Central de Abastos de Campeche Histórico", low: 24, high: 32, value: 28 },
];

<RangeChart
  ariaLabel="Rango de precio del jitomate por central con 18 nombres largos"
  groups={groups}
  formatY={(v: number) => \`$\${v} /kg\`}
  sortGroups="desc"
/>`}
      >
        <RangeChart
          ariaLabel="Rango de precio del jitomate por central con 18 nombres largos"
          groups={[
            {
              label: "Central de Abastos de Iztapalapa",
              low: 22,
              high: 30,
              value: 26,
            },
            {
              label: "Central de Abastos de Ecatepec de Morelos",
              low: 24,
              high: 33,
              value: 29,
            },
            {
              label: "Mercado de Abastos de Guadalajara",
              low: 21,
              high: 28,
              value: 24,
            },
            {
              label: "Central de Abastos de Monterrey",
              low: 25,
              high: 34,
              value: 31,
            },
            {
              label: "Mercado Hidalgo de la Ciudad de Puebla",
              low: 23,
              high: 31,
              value: 27,
            },
            {
              label: "Central de Abastos de Villahermosa",
              low: 26,
              high: 36,
              value: 32,
            },
            {
              label: "Mercado de Abastos de León Guanajuato",
              low: 22,
              high: 29,
              value: 25,
            },
            {
              label: "Central de Abastos de Oaxaca de Juárez",
              low: 27,
              high: 38,
              value: 34,
            },
            {
              label: "Mercado de Abastos de Toluca de Lerdo",
              low: 23,
              high: 30,
              value: 26,
            },
            {
              label: "Central de Abastos de Querétaro Capital",
              low: 24,
              high: 32,
              value: 28,
            },
            {
              label: "Mercado de Abastos de Mérida Yucatán",
              low: 25,
              high: 35,
              value: 30,
            },
            {
              label: "Central de Abastos de Tijuana Frontera",
              low: 28,
              high: 39,
              value: 35,
            },
            {
              label: "Mercado de Abastos de Chihuahua Capital",
              low: 26,
              high: 34,
              value: 30,
            },
            {
              label: "Central de Abastos de Veracruz Puerto",
              low: 24,
              high: 33,
              value: 29,
            },
            {
              label: "Mercado de Abastos de Morelia Michoacán",
              low: 23,
              high: 31,
              value: 27,
            },
            {
              label: "Central de Abastos de Culiacán Sinaloa",
              low: 25,
              high: 36,
              value: 31,
            },
            {
              label: "Mercado de Abastos de Tuxtla Gutiérrez",
              low: 26,
              high: 37,
              value: 33,
            },
            {
              label: "Central de Abastos de Campeche Histórico",
              low: 24,
              high: 32,
              value: 28,
            },
          ]}
          formatY={(v: number) => `$${v} /kg`}
          sortGroups="desc"
        />
      </DemoExample>
    </div>
  );
}
