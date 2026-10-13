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
    </div>
  );
}
