import { BeeswarmPlot } from "@carlos-burelo/klin";
import { DemoExample } from "../../components/docs/demo-example";

const puntosEstres = Array.from({ length: 400 }, (_, i) => ({
  value: Math.round((60 + 25 * Math.sin(i / 7) + ((i * 13) % 19)) * 10) / 10,
}));

export default function BeeswarmPlotExamples() {
  return (
    <div className="flex flex-col gap-6">
      <DemoExample
        caption="Calificaciones de examen con etiquetas"
        code={`import { BeeswarmPlot, type BeeswarmPoint } from "@carlos-burelo/klin";

const points: BeeswarmPoint[] = [
  { value: 78, label: "Beto" },
  { value: 81, label: "Fer" },
  { value: 83, label: "Jorge" },
  { value: 85, label: "Carla" },
  { value: 79, label: "Ana" },
  { value: 82, label: "Hugo" },
  { value: 80, label: "Gaby" },
  { value: 84, label: "Diego" },
  { value: 59, label: "Iris" },
  { value: 95, label: "Elena" },
];

<BeeswarmPlot
  ariaLabel="Calificaciones del examen de admisión del grupo 3B, amontonadas entre 78 y 85"
  points={points}
  formatX={(v: number) => \`\${v} pts\`}
/>`}
      >
        <BeeswarmPlot
          ariaLabel="Calificaciones del examen de admisión del grupo 3B, amontonadas entre 78 y 85"
          points={[
            { value: 78, label: "Beto" },
            { value: 81, label: "Fer" },
            { value: 83, label: "Jorge" },
            { value: 85, label: "Carla" },
            { value: 79, label: "Ana" },
            { value: 82, label: "Hugo" },
            { value: 80, label: "Gaby" },
            { value: 84, label: "Diego" },
            { value: 59, label: "Iris" },
            { value: 95, label: "Elena" },
          ]}
          formatX={(v: number) => `${v} pts`}
        />
      </DemoExample>
      <DemoExample
        caption="Rentas sin etiquetas con puntos más grandes"
        code={`import { BeeswarmPlot, type BeeswarmPoint } from "@carlos-burelo/klin";

const points: BeeswarmPoint[] = [
  { value: 9.8 },
  { value: 11.2 },
  { value: 12 },
  { value: 10.4 },
  { value: 9.1 },
  { value: 12.8 },
  { value: 14.2 },
  { value: 10.9 },
  { value: 11.7 },
  { value: 13.5 },
  { value: 7.9 },
  { value: 18 },
];

<BeeswarmPlot
  ariaLabel="Rentas mensuales en miles de pesos por colonia de la CDMX, concentradas entre 9 y 14 mil"
  points={points}
  radius={6}
  formatX={(v: number) => \`$\${v} mil\`}
/>`}
      >
        <BeeswarmPlot
          ariaLabel="Rentas mensuales en miles de pesos por colonia de la CDMX, concentradas entre 9 y 14 mil"
          points={[
            { value: 9.8 },
            { value: 11.2 },
            { value: 12 },
            { value: 10.4 },
            { value: 9.1 },
            { value: 12.8 },
            { value: 14.2 },
            { value: 10.9 },
            { value: 11.7 },
            { value: 13.5 },
            { value: 7.9 },
            { value: 18 },
          ]}
          radius={6}
          formatX={(v: number) => `$${v} mil`}
        />
      </DemoExample>
      <DemoExample
        caption="estrés: 400 puntos, tope del SSR, con tamaño de muestra"
        code={`import { BeeswarmPlot, type BeeswarmPoint } from "@carlos-burelo/klin";

const points: BeeswarmPoint[] = Array.from({ length: 400 }, (_, i) => ({
  value: Math.round((60 + 25 * Math.sin(i / 7) + ((i * 13) % 19)) * 10) / 10,
}));

<BeeswarmPlot
  ariaLabel="Tiempos de atención con 400 puntos, tope del SSR"
  points={points}
  radius={3}
  showSampleSize
  formatX={(v: number) => \`\${v} min\`}
/>`}
      >
        <BeeswarmPlot
          ariaLabel="Tiempos de atención con 400 puntos, tope del SSR"
          points={puntosEstres}
          radius={3}
          showSampleSize
          formatX={(v: number) => `${v} min`}
        />
      </DemoExample>
    </div>
  );
}
