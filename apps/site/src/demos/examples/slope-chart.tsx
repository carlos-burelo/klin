import type { SlopeDatum } from "@carlos-burelo/klin";
import { SlopeChart } from "@carlos-burelo/klin";
import { DemoExample } from "../../components/docs/demo-example";

const pobreza: SlopeDatum[] = [
  { label: "Chiapas", from: 68, to: 58 },
  { label: "Oaxaca", from: 62, to: 52 },
  { label: "Veracruz", from: 51, to: 44 },
  { label: "Jalisco", from: 36, to: 30 },
  { label: "Nuevo León", from: 28, to: 22 },
];

const salario: SlopeDatum[] = [
  { label: "Manufactura", from: 12500, to: 15200 },
  { label: "Servicios", from: 13000, to: 15800 },
  { label: "Comercio", from: 10800, to: 12100 },
  { label: "Construcción", from: 11400, to: 10900 },
];

const escolaridad: SlopeDatum[] = [
  { label: "Chiapas", from: 7.8, to: 9.1 },
  { label: "Oaxaca", from: 8.1, to: 9.4 },
  { label: "CDMX", from: 11.2, to: 11.9 },
];

export default function SlopeChartExamples() {
  return (
    <div className="flex flex-col gap-6">
      <DemoExample
        caption="Dos años en porcentaje con bajadas generalizadas"
        code={`import type { SlopeDatum } from "@carlos-burelo/klin";
import { SlopeChart } from "@carlos-burelo/klin";

const pobreza: SlopeDatum[] = [
  { label: "Chiapas", from: 68, to: 58 },
  { label: "Oaxaca", from: 62, to: 52 },
  { label: "Veracruz", from: 51, to: 44 },
  { label: "Jalisco", from: 36, to: 30 },
  { label: "Nuevo León", from: 28, to: 22 },
];

<SlopeChart
  data={pobreza}
  fromLabel="2020"
  toLabel="2024"
  formatY={(v: number) => \`\${v} %\`}
  ariaLabel="Pobreza laboral por estado entre 2020 y 2024: todos los estados la reducen y Chiapas sigue con el nivel más alto"
/>`}
      >
        <SlopeChart
          data={pobreza}
          fromLabel="2020"
          toLabel="2024"
          formatY={(v: number) => `${v} %`}
          ariaLabel="Pobreza laboral por estado entre 2020 y 2024: todos los estados la reducen y Chiapas sigue con el nivel más alto"
        />
      </DemoExample>
      <DemoExample
        caption="Salarios en moneda con un sector a la baja"
        code={`import type { SlopeDatum } from "@carlos-burelo/klin";
import { SlopeChart } from "@carlos-burelo/klin";

const salario: SlopeDatum[] = [
  { label: "Manufactura", from: 12500, to: 15200 },
  { label: "Servicios", from: 13000, to: 15800 },
  { label: "Comercio", from: 10800, to: 12100 },
  { label: "Construcción", from: 11400, to: 10900 },
];

<SlopeChart
  data={salario}
  fromLabel="2022"
  toLabel="2025"
  formatY={(v: number) =>
    new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
      maximumFractionDigits: 0,
    }).format(v)
  }
  ariaLabel="Salario mensual promedio por sector entre 2022 y 2025 en pesos: todos suben salvo construcción, que retrocede"
/>`}
      >
        <SlopeChart
          data={salario}
          fromLabel="2022"
          toLabel="2025"
          formatY={(v: number) =>
            new Intl.NumberFormat("es-MX", {
              style: "currency",
              currency: "MXN",
              maximumFractionDigits: 0,
            }).format(v)
          }
          ariaLabel="Salario mensual promedio por sector entre 2022 y 2025 en pesos: todos suben salvo construcción, que retrocede"
        />
      </DemoExample>
      <DemoExample
        caption="Decimales con altura personalizada"
        code={`import type { SlopeDatum } from "@carlos-burelo/klin";
import { SlopeChart } from "@carlos-burelo/klin";

const escolaridad: SlopeDatum[] = [
  { label: "Chiapas", from: 7.8, to: 9.1 },
  { label: "Oaxaca", from: 8.1, to: 9.4 },
  { label: "CDMX", from: 11.2, to: 11.9 },
];

<SlopeChart
  data={escolaridad}
  fromLabel="2015"
  toLabel="2025"
  height={320}
  formatY={(v: number) => \`\${v.toFixed(1)} años\`}
  ariaLabel="Escolaridad promedio por estado entre 2015 y 2025: Chiapas avanza más de un año pero CDMX mantiene la ventaja"
/>`}
      >
        <SlopeChart
          data={escolaridad}
          fromLabel="2015"
          toLabel="2025"
          height={320}
          formatY={(v: number) => `${v.toFixed(1)} años`}
          ariaLabel="Escolaridad promedio por estado entre 2015 y 2025: Chiapas avanza más de un año pero CDMX mantiene la ventaja"
        />
      </DemoExample>
    </div>
  );
}
