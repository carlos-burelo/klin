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

const rezago: SlopeDatum[] = [
  { label: "Heroica Ciudad de Juchitán de Zaragoza", from: 42, to: 31 },
  { label: "San Juan Bautista Tuxtepec", from: 38, to: 29 },
  { label: "Santa Cruz Xoxocotlán", from: 35, to: 27 },
  { label: "San Pedro Tlaquepaque", from: 28, to: 24 },
  { label: "San Andrés Cholula", from: 26, to: 19 },
  { label: "Heroica Puebla de Zaragoza", from: 24, to: 21 },
  { label: "Ciudad General Escobedo", from: 22, to: 25 },
  { label: "San Nicolás de los Garza", from: 21, to: 17 },
  { label: "Santiago de Querétaro", from: 19, to: 15 },
  { label: "San Luis Río Colorado", from: 23, to: 20 },
  { label: "Villa de Álvarez", from: 18, to: 22 },
  { label: "Gustavo A. Madero", from: 25, to: 18 },
  { label: "Venustiano Carranza", from: 20, to: 23 },
  { label: "Álvaro Obregón", from: 16, to: 13 },
  { label: "Miguel Hidalgo", from: 14, to: 16 },
  { label: "Benito Juárez", from: 12, to: 9 },
  { label: "Coyoacán", from: 11, to: 14 },
  { label: "Tlalpan", from: 15, to: 11 },
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
      <DemoExample
        caption="Subidas y bajadas con colores propios y delta visible"
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
  colorUp="var(--chart-2)"
  colorDown="var(--chart-5)"
  showDelta
  ariaLabel="Salario por sector con subidas en verde y caída de construcción en rojo"
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
          colorUp="var(--chart-2)"
          colorDown="var(--chart-5)"
          showDelta
          ariaLabel="Salario por sector con subidas en verde y caída de construcción en rojo"
        />
      </DemoExample>
      <DemoExample
        caption="Estrés: 18 municipios con nombres largos y cruces apretados"
        code={`import type { SlopeDatum } from "@carlos-burelo/klin";
import { SlopeChart } from "@carlos-burelo/klin";

const rezago: SlopeDatum[] = [
  { label: "Heroica Ciudad de Juchitán de Zaragoza", from: 42, to: 31 },
  { label: "San Juan Bautista Tuxtepec", from: 38, to: 29 },
  { label: "Santa Cruz Xoxocotlán", from: 35, to: 27 },
  { label: "San Pedro Tlaquepaque", from: 28, to: 24 },
  { label: "San Andrés Cholula", from: 26, to: 19 },
  { label: "Heroica Puebla de Zaragoza", from: 24, to: 21 },
  { label: "Ciudad General Escobedo", from: 22, to: 25 },
  { label: "San Nicolás de los Garza", from: 21, to: 17 },
  { label: "Santiago de Querétaro", from: 19, to: 15 },
  { label: "San Luis Río Colorado", from: 23, to: 20 },
  { label: "Villa de Álvarez", from: 18, to: 22 },
  { label: "Gustavo A. Madero", from: 25, to: 18 },
  { label: "Venustiano Carranza", from: 20, to: 23 },
  { label: "Álvaro Obregón", from: 16, to: 13 },
  { label: "Miguel Hidalgo", from: 14, to: 16 },
  { label: "Benito Juárez", from: 12, to: 9 },
  { label: "Coyoacán", from: 11, to: 14 },
  { label: "Tlalpan", from: 15, to: 11 },
];

<SlopeChart
  data={rezago}
  fromLabel="2020"
  toLabel="2025"
  formatY={(v: number) => \`\${v} %\`}
  showDelta
  ariaLabel="Rezago educativo por municipio entre 2020 y 2025 con nombres largos"
/>`}
      >
        <SlopeChart
          data={rezago}
          fromLabel="2020"
          toLabel="2025"
          formatY={(v: number) => `${v} %`}
          showDelta
          ariaLabel="Rezago educativo por municipio entre 2020 y 2025 con nombres largos"
        />
      </DemoExample>
    </div>
  );
}
