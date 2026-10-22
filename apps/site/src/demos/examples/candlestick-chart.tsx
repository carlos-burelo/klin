import { CandlestickChart } from "@carlos-burelo/klin";
import { DemoExample } from "../../components/docs/demo-example";

export default function CandlestickChartExamples() {
  return (
    <div className="flex flex-col gap-6">
      <DemoExample
        caption="Cinco sesiones con leyenda"
        code={`import { CandlestickChart } from "@carlos-burelo/klin";

const data = [
  { dia: "Lun", apertura: 12.4, maximo: 12.7, minimo: 12.2, cierre: 12.6 },
  { dia: "Mar", apertura: 12.6, maximo: 12.9, minimo: 12.5, cierre: 12.8 },
  { dia: "Mié", apertura: 12.8, maximo: 13.0, minimo: 12.4, cierre: 12.5 },
  { dia: "Jue", apertura: 12.5, maximo: 12.7, minimo: 12.1, cierre: 12.2 },
  { dia: "Vie", apertura: 12.2, maximo: 12.6, minimo: 12.0, cierre: 12.55 },
];

<CandlestickChart
  ariaLabel="Velas diarias de Cemex en la BMV con cierre semanal al alza"
  data={data}
  labelKey="dia"
  openKey="apertura"
  highKey="maximo"
  lowKey="minimo"
  closeKey="cierre"
/>`}
      >
        <CandlestickChart
          ariaLabel="Velas diarias de Cemex en la BMV con cierre semanal al alza"
          data={[
            {
              dia: "Lun",
              apertura: 12.4,
              maximo: 12.7,
              minimo: 12.2,
              cierre: 12.6,
            },
            {
              dia: "Mar",
              apertura: 12.6,
              maximo: 12.9,
              minimo: 12.5,
              cierre: 12.8,
            },
            {
              dia: "Mié",
              apertura: 12.8,
              maximo: 13.0,
              minimo: 12.4,
              cierre: 12.5,
            },
            {
              dia: "Jue",
              apertura: 12.5,
              maximo: 12.7,
              minimo: 12.1,
              cierre: 12.2,
            },
            {
              dia: "Vie",
              apertura: 12.2,
              maximo: 12.6,
              minimo: 12.0,
              cierre: 12.55,
            },
          ]}
          labelKey="dia"
          openKey="apertura"
          highKey="maximo"
          lowKey="minimo"
          closeKey="cierre"
        />
      </DemoExample>
      <DemoExample
        caption="Tipo de cambio con resistencia anotada y sin leyenda"
        code={`import { CandlestickChart } from "@carlos-burelo/klin";

const data = [
  { dia: "Lun", apertura: 17.05, maximo: 17.12, minimo: 16.98, cierre: 17.08 },
  { dia: "Mar", apertura: 17.08, maximo: 17.2, minimo: 17.02, cierre: 17.15 },
  { dia: "Mié", apertura: 17.15, maximo: 17.22, minimo: 17.05, cierre: 17.1 },
  { dia: "Jue", apertura: 17.1, maximo: 17.18, minimo: 17.0, cierre: 17.02 },
  { dia: "Vie", apertura: 17.02, maximo: 17.1, minimo: 16.95, cierre: 17.06 },
];

<CandlestickChart
  ariaLabel="Velas diarias del dólar frente al peso con resistencia en 17.20 y cierre en 17.06"
  data={data}
  labelKey="dia"
  openKey="apertura"
  highKey="maximo"
  lowKey="minimo"
  closeKey="cierre"
  formatY={(v: number) => \`$\${v.toFixed(2)}\`}
  annotations={[{ value: 17.2, label: "Resistencia" }]}
  showLegend={false}
/>`}
      >
        <CandlestickChart
          ariaLabel="Velas diarias del dólar frente al peso con resistencia en 17.20 y cierre en 17.06"
          data={[
            {
              dia: "Lun",
              apertura: 17.05,
              maximo: 17.12,
              minimo: 16.98,
              cierre: 17.08,
            },
            {
              dia: "Mar",
              apertura: 17.08,
              maximo: 17.2,
              minimo: 17.02,
              cierre: 17.15,
            },
            {
              dia: "Mié",
              apertura: 17.15,
              maximo: 17.22,
              minimo: 17.05,
              cierre: 17.1,
            },
            {
              dia: "Jue",
              apertura: 17.1,
              maximo: 17.18,
              minimo: 17.0,
              cierre: 17.02,
            },
            {
              dia: "Vie",
              apertura: 17.02,
              maximo: 17.1,
              minimo: 16.95,
              cierre: 17.06,
            },
          ]}
          labelKey="dia"
          openKey="apertura"
          highKey="maximo"
          lowKey="minimo"
          closeKey="cierre"
          formatY={(v: number) => `$${v.toFixed(2)}`}
          annotations={[{ value: 17.2, label: "Resistencia" }]}
          showLegend={false}
        />
      </DemoExample>
      <DemoExample
        caption="Precio del aguacate por kilo en central de abastos"
        code={`import { CandlestickChart } from "@carlos-burelo/klin";

const data = [
  { dia: "Lun", apertura: 48, maximo: 52, minimo: 46, cierre: 51 },
  { dia: "Mar", apertura: 51, maximo: 55, minimo: 50, cierre: 54 },
  { dia: "Mié", apertura: 54, maximo: 58, minimo: 52, cierre: 56 },
  { dia: "Jue", apertura: 56, maximo: 57, minimo: 50, cierre: 51 },
  { dia: "Vie", apertura: 51, maximo: 53, minimo: 47, cierre: 49 },
  { dia: "Sáb", apertura: 49, maximo: 54, minimo: 48, cierre: 53 },
];

<CandlestickChart
  ariaLabel="Velas del kilo de aguacate en central de abastos con pico de 58 pesos el miércoles"
  data={data}
  labelKey="dia"
  openKey="apertura"
  highKey="maximo"
  lowKey="minimo"
  closeKey="cierre"
  formatY={(v: number) => \`$\${v} /kg\`}
/>`}
      >
        <CandlestickChart
          ariaLabel="Velas del kilo de aguacate en central de abastos con pico de 58 pesos el miércoles"
          data={[
            { dia: "Lun", apertura: 48, maximo: 52, minimo: 46, cierre: 51 },
            { dia: "Mar", apertura: 51, maximo: 55, minimo: 50, cierre: 54 },
            { dia: "Mié", apertura: 54, maximo: 58, minimo: 52, cierre: 56 },
            { dia: "Jue", apertura: 56, maximo: 57, minimo: 50, cierre: 51 },
            { dia: "Vie", apertura: 51, maximo: 53, minimo: 47, cierre: 49 },
            { dia: "Sáb", apertura: 49, maximo: 54, minimo: 48, cierre: 53 },
          ]}
          labelKey="dia"
          openKey="apertura"
          highKey="maximo"
          lowKey="minimo"
          closeKey="cierre"
          formatY={(v: number) => `$${v} /kg`}
        />
      </DemoExample>
      <DemoExample
        caption="Velas con colores propios de alcista y bajista"
        code={`import { CandlestickChart } from "@carlos-burelo/klin";

const data = [
  { dia: "Lun", apertura: 48, maximo: 52, minimo: 46, cierre: 51 },
  { dia: "Mar", apertura: 51, maximo: 55, minimo: 50, cierre: 54 },
  { dia: "Mie", apertura: 54, maximo: 58, minimo: 52, cierre: 56 },
];

<CandlestickChart
  ariaLabel="Velas con colores propios de alcista y bajista"
  data={data}
  labelKey="dia"
  openKey="apertura"
  highKey="maximo"
  lowKey="minimo"
  closeKey="cierre"
  bullColor="var(--chart-2)"
  bearColor="var(--chart-5)"
/>`}
      >
        <CandlestickChart
          ariaLabel="Velas con colores propios de alcista y bajista"
          data={[
            { dia: "Lun", apertura: 48, maximo: 52, minimo: 46, cierre: 51 },
            { dia: "Mar", apertura: 51, maximo: 55, minimo: 50, cierre: 54 },
            { dia: "Mie", apertura: 54, maximo: 58, minimo: 52, cierre: 56 },
          ]}
          labelKey="dia"
          openKey="apertura"
          highKey="maximo"
          lowKey="minimo"
          closeKey="cierre"
          bullColor="var(--chart-2)"
          bearColor="var(--chart-5)"
        />
      </DemoExample>
      <DemoExample
        caption="Estrés: 30 sesiones con rachas alcistas y bajistas entremezcladas"
        code={`import { CandlestickChart } from "@carlos-burelo/klin";

const data = [
  { dia: "S01", apertura: 48.0, maximo: 49.2, minimo: 47.4, cierre: 48.8 },
  { dia: "S02", apertura: 48.8, maximo: 50.1, minimo: 48.2, cierre: 49.6 },
  { dia: "S03", apertura: 49.6, maximo: 50.0, minimo: 48.0, cierre: 48.3 },
  { dia: "S04", apertura: 48.3, maximo: 48.9, minimo: 46.8, cierre: 47.1 },
  { dia: "S05", apertura: 47.1, maximo: 48.4, minimo: 46.5, cierre: 48.0 },
  { dia: "S06", apertura: 48.0, maximo: 49.5, minimo: 47.6, cierre: 49.1 },
  { dia: "S07", apertura: 49.1, maximo: 51.2, minimo: 48.7, cierre: 50.8 },
  { dia: "S08", apertura: 50.8, maximo: 51.4, minimo: 49.2, cierre: 49.5 },
  { dia: "S09", apertura: 49.5, maximo: 50.2, minimo: 48.1, cierre: 48.4 },
  { dia: "S10", apertura: 48.4, maximo: 49.0, minimo: 47.0, cierre: 47.3 },
  { dia: "S11", apertura: 47.3, maximo: 48.8, minimo: 46.9, cierre: 48.5 },
  { dia: "S12", apertura: 48.5, maximo: 50.3, minimo: 48.1, cierre: 49.9 },
  { dia: "S13", apertura: 49.9, maximo: 52.0, minimo: 49.4, cierre: 51.6 },
  { dia: "S14", apertura: 51.6, maximo: 52.2, minimo: 50.0, cierre: 50.4 },
  { dia: "S15", apertura: 50.4, maximo: 51.0, minimo: 48.8, cierre: 49.0 },
  { dia: "S16", apertura: 49.0, maximo: 49.6, minimo: 47.2, cierre: 47.5 },
  { dia: "S17", apertura: 47.5, maximo: 49.1, minimo: 47.0, cierre: 48.7 },
  { dia: "S18", apertura: 48.7, maximo: 50.5, minimo: 48.3, cierre: 50.1 },
  { dia: "S19", apertura: 50.1, maximo: 52.4, minimo: 49.7, cierre: 52.0 },
  { dia: "S20", apertura: 52.0, maximo: 52.6, minimo: 50.2, cierre: 50.6 },
  { dia: "S21", apertura: 50.6, maximo: 51.2, minimo: 49.0, cierre: 49.3 },
  { dia: "S22", apertura: 49.3, maximo: 49.9, minimo: 47.4, cierre: 47.7 },
  { dia: "S23", apertura: 47.7, maximo: 49.4, minimo: 47.2, cierre: 49.0 },
  { dia: "S24", apertura: 49.0, maximo: 50.8, minimo: 48.6, cierre: 50.4 },
  { dia: "S25", apertura: 50.4, maximo: 52.8, minimo: 50.0, cierre: 52.4 },
  { dia: "S26", apertura: 52.4, maximo: 53.0, minimo: 50.6, cierre: 51.0 },
  { dia: "S27", apertura: 51.0, maximo: 51.6, minimo: 49.2, cierre: 49.5 },
  { dia: "S28", apertura: 49.5, maximo: 50.1, minimo: 47.6, cierre: 47.9 },
  { dia: "S29", apertura: 47.9, maximo: 49.7, minimo: 47.4, cierre: 49.3 },
  { dia: "S30", apertura: 49.3, maximo: 51.1, minimo: 48.9, cierre: 50.7 },
];

<CandlestickChart
  ariaLabel="Treinta sesiones del kilo de aguacate con rachas alcistas y bajistas"
  data={data}
  labelKey="dia"
  openKey="apertura"
  highKey="maximo"
  lowKey="minimo"
  closeKey="cierre"
  formatY={(v: number) => \`$\${v} /kg\`}
/>`}
      >
        <CandlestickChart
          ariaLabel="Treinta sesiones del kilo de aguacate con rachas alcistas y bajistas"
          data={[
            {
              dia: "S01",
              apertura: 48.0,
              maximo: 49.2,
              minimo: 47.4,
              cierre: 48.8,
            },
            {
              dia: "S02",
              apertura: 48.8,
              maximo: 50.1,
              minimo: 48.2,
              cierre: 49.6,
            },
            {
              dia: "S03",
              apertura: 49.6,
              maximo: 50.0,
              minimo: 48.0,
              cierre: 48.3,
            },
            {
              dia: "S04",
              apertura: 48.3,
              maximo: 48.9,
              minimo: 46.8,
              cierre: 47.1,
            },
            {
              dia: "S05",
              apertura: 47.1,
              maximo: 48.4,
              minimo: 46.5,
              cierre: 48.0,
            },
            {
              dia: "S06",
              apertura: 48.0,
              maximo: 49.5,
              minimo: 47.6,
              cierre: 49.1,
            },
            {
              dia: "S07",
              apertura: 49.1,
              maximo: 51.2,
              minimo: 48.7,
              cierre: 50.8,
            },
            {
              dia: "S08",
              apertura: 50.8,
              maximo: 51.4,
              minimo: 49.2,
              cierre: 49.5,
            },
            {
              dia: "S09",
              apertura: 49.5,
              maximo: 50.2,
              minimo: 48.1,
              cierre: 48.4,
            },
            {
              dia: "S10",
              apertura: 48.4,
              maximo: 49.0,
              minimo: 47.0,
              cierre: 47.3,
            },
            {
              dia: "S11",
              apertura: 47.3,
              maximo: 48.8,
              minimo: 46.9,
              cierre: 48.5,
            },
            {
              dia: "S12",
              apertura: 48.5,
              maximo: 50.3,
              minimo: 48.1,
              cierre: 49.9,
            },
            {
              dia: "S13",
              apertura: 49.9,
              maximo: 52.0,
              minimo: 49.4,
              cierre: 51.6,
            },
            {
              dia: "S14",
              apertura: 51.6,
              maximo: 52.2,
              minimo: 50.0,
              cierre: 50.4,
            },
            {
              dia: "S15",
              apertura: 50.4,
              maximo: 51.0,
              minimo: 48.8,
              cierre: 49.0,
            },
            {
              dia: "S16",
              apertura: 49.0,
              maximo: 49.6,
              minimo: 47.2,
              cierre: 47.5,
            },
            {
              dia: "S17",
              apertura: 47.5,
              maximo: 49.1,
              minimo: 47.0,
              cierre: 48.7,
            },
            {
              dia: "S18",
              apertura: 48.7,
              maximo: 50.5,
              minimo: 48.3,
              cierre: 50.1,
            },
            {
              dia: "S19",
              apertura: 50.1,
              maximo: 52.4,
              minimo: 49.7,
              cierre: 52.0,
            },
            {
              dia: "S20",
              apertura: 52.0,
              maximo: 52.6,
              minimo: 50.2,
              cierre: 50.6,
            },
            {
              dia: "S21",
              apertura: 50.6,
              maximo: 51.2,
              minimo: 49.0,
              cierre: 49.3,
            },
            {
              dia: "S22",
              apertura: 49.3,
              maximo: 49.9,
              minimo: 47.4,
              cierre: 47.7,
            },
            {
              dia: "S23",
              apertura: 47.7,
              maximo: 49.4,
              minimo: 47.2,
              cierre: 49.0,
            },
            {
              dia: "S24",
              apertura: 49.0,
              maximo: 50.8,
              minimo: 48.6,
              cierre: 50.4,
            },
            {
              dia: "S25",
              apertura: 50.4,
              maximo: 52.8,
              minimo: 50.0,
              cierre: 52.4,
            },
            {
              dia: "S26",
              apertura: 52.4,
              maximo: 53.0,
              minimo: 50.6,
              cierre: 51.0,
            },
            {
              dia: "S27",
              apertura: 51.0,
              maximo: 51.6,
              minimo: 49.2,
              cierre: 49.5,
            },
            {
              dia: "S28",
              apertura: 49.5,
              maximo: 50.1,
              minimo: 47.6,
              cierre: 47.9,
            },
            {
              dia: "S29",
              apertura: 47.9,
              maximo: 49.7,
              minimo: 47.4,
              cierre: 49.3,
            },
            {
              dia: "S30",
              apertura: 49.3,
              maximo: 51.1,
              minimo: 48.9,
              cierre: 50.7,
            },
          ]}
          labelKey="dia"
          openKey="apertura"
          highKey="maximo"
          lowKey="minimo"
          closeKey="cierre"
          formatY={(v: number) => `$${v} /kg`}
        />
      </DemoExample>
    </div>
  );
}
