import { Histogram } from "@carlos-burelo/klin";
import { DemoExample } from "../../components/docs/demo-example";

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
    </div>
  );
}
