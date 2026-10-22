import { Histogram } from "@carlos-burelo/klin";
import { DemoExample } from "../../components/docs/demo-example";

const valoresEstres: number[] = Array.from({ length: 500 }, (_, i) =>
  Math.round(
    50 + 28 * Math.sin(i / 9) + 12 * Math.sin(i / 3.7) + ((i * 13) % 17) - 8,
  ),
);

export default function HistogramExamples() {
  return (
    <div className="flex flex-col gap-6">
      <DemoExample
        caption="Edades de asistentes en ocho intervalos"
        code={`import { Histogram } from "@carlos-burelo/klin";

const values = [
  18, 19, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34,
  35, 36, 38, 40, 42, 45, 48, 52,
];

<Histogram
  ariaLabel="Histograma de edades de asistentes en ocho intervalos"
  bins={8}
  values={values}
/>`}
      >
        <Histogram
          ariaLabel="Histograma de edades de asistentes en ocho intervalos"
          bins={8}
          values={[
            18, 19, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35,
            36, 38, 40, 42, 45, 48, 52,
          ]}
        />
      </DemoExample>
      <DemoExample
        caption="Tiempos de espera en cuatro intervalos con color propio"
        code={`import { Histogram } from "@carlos-burelo/klin";

const values = [
  5, 8, 10, 12, 14, 15, 16, 18, 20, 22, 25, 28, 30, 35, 40, 48,
];

<Histogram
  ariaLabel="Histograma de minutos de espera en cuatro intervalos"
  bins={4}
  color="#7c3aed"
  format={(v: number) => \`\${v} min\`}
  values={values}
/>`}
      >
        <Histogram
          ariaLabel="Histograma de minutos de espera en cuatro intervalos"
          bins={4}
          color="#7c3aed"
          format={(v: number) => `${v} min`}
          values={[
            5, 8, 10, 12, 14, 15, 16, 18, 20, 22, 25, 28, 30, 35, 40, 48,
          ]}
        />
      </DemoExample>
      <DemoExample
        caption="Temperaturas con negativos y punto de congelación anotado"
        code={`import { Histogram } from "@carlos-burelo/klin";

const values = [-4, -3, -2, -2, -1, 0, 1, 1, 2, 3, 3, 4, 5, 6, 7, 8];

<Histogram
  ariaLabel="Histograma de temperaturas bajo y sobre cero con congelación anotada"
  bins={6}
  format={(v: number) => \`\${v} °C\`}
  annotations={[{ value: 0, label: "Congelación" }]}
  values={values}
/>`}
      >
        <Histogram
          ariaLabel="Histograma de temperaturas bajo y sobre cero con congelación anotada"
          bins={6}
          format={(v: number) => `${v} °C`}
          annotations={[{ value: 0, label: "Congelación" }]}
          values={[-4, -3, -2, -2, -1, 0, 1, 1, 2, 3, 3, 4, 5, 6, 7, 8]}
        />
      </DemoExample>
      <DemoExample
        caption="Cubetas automáticas con estrategia Freedman-Diaconis"
        code={`import { Histogram } from "@carlos-burelo/klin";

const values = [
  18, 19, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34,
  35, 36, 38, 40, 42, 45, 48, 52,
];

<Histogram
  ariaLabel="Histograma de edades con cubetas Freedman-Diaconis"
  values={values}
  binStrategy="freedman"
/>`}
      >
        <Histogram
          ariaLabel="Histograma de edades con cubetas Freedman-Diaconis"
          values={[
            18, 19, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35,
            36, 38, 40, 42, 45, 48, 52,
          ]}
          binStrategy="freedman"
        />
      </DemoExample>
      <DemoExample
        caption="Eje Y en porcentaje con conteos normalizados"
        code={`import { Histogram } from "@carlos-burelo/klin";

const values = [
  5, 8, 10, 12, 14, 15, 16, 18, 20, 22, 25, 28, 30, 35, 40, 48,
];

<Histogram
  ariaLabel="Histograma de esperas en porcentaje con eje normalizado"
  values={values}
  bins={4}
  normalize
/>`}
      >
        <Histogram
          ariaLabel="Histograma de esperas en porcentaje con eje normalizado"
          values={[
            5, 8, 10, 12, 14, 15, 16, 18, 20, 22, 25, 28, 30, 35, 40, 48,
          ]}
          bins={4}
          normalize
        />
      </DemoExample>
      <DemoExample
        caption="Estrés: 500 datos deterministas en 30 cubetas con media y mediana"
        code={`import { Histogram } from "@carlos-burelo/klin";

const valoresEstres: number[] = Array.from(
  { length: 500 },
  (_, i) =>
    Math.round(
      50 +
        28 * Math.sin(i / 9) +
        12 * Math.sin(i / 3.7) +
        ((i * 13) % 17) -
        8,
    ),
);

<Histogram
  ariaLabel="Histograma de 500 folios de trámite con media y mediana marcadas"
  values={valoresEstres}
  bins={30}
  showMean
  showMedian
/>`}
      >
        <Histogram
          ariaLabel="Histograma de 500 folios de trámite con media y mediana marcadas"
          values={valoresEstres}
          bins={30}
          showMean
          showMedian
        />
      </DemoExample>
    </div>
  );
}
