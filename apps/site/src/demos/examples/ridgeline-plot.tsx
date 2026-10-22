import { RidgelinePlot } from "@carlos-burelo/klin";
import { DemoExample } from "../../components/docs/demo-example";

const seriesEstres = Array.from({ length: 8 }, (_, g) => ({
  label: `Sucursal ${g + 1} Periférico Sur`,
  values: Array.from(
    { length: 60 },
    (_, i) =>
      Math.round(
        (30 +
          g * 8 +
          16 * Math.abs(Math.sin(i / 7 + g * 0.9)) +
          ((i * 5 + g * 11) % 13)) *
          10,
      ) / 10,
  ),
}));

export default function RidgelinePlotExamples() {
  return (
    <div className="flex flex-col gap-6">
      <DemoExample
        caption="Ventas mensuales por trimestre con leyenda"
        code={`import { RidgelinePlot, type RidgelineSeries } from "@carlos-burelo/klin";

const series: RidgelineSeries[] = [
  { label: "T1", values: [42, 48, 51, 45, 55, 50, 47, 53, 49, 52] },
  { label: "T2", values: [58, 62, 65, 60, 68, 63, 61, 66, 64, 67] },
  { label: "T3", values: [70, 75, 72, 78, 74, 80, 73, 77, 76, 79] },
  { label: "T4", values: [85, 92, 88, 95, 90, 98, 87, 93, 91, 96] },
];

<RidgelinePlot
  ariaLabel="Distribución de ventas semanales en miles de pesos por trimestre, con el pico más alto en T4 por el Buen Fin"
  series={series}
  formatX={(v: number) => \`$\${v} mil\`}
/>`}
      >
        <RidgelinePlot
          ariaLabel="Distribución de ventas semanales en miles de pesos por trimestre, con el pico más alto en T4 por el Buen Fin"
          series={[
            { label: "T1", values: [42, 48, 51, 45, 55, 50, 47, 53, 49, 52] },
            { label: "T2", values: [58, 62, 65, 60, 68, 63, 61, 66, 64, 67] },
            { label: "T3", values: [70, 75, 72, 78, 74, 80, 73, 77, 76, 79] },
            { label: "T4", values: [85, 92, 88, 95, 90, 98, 87, 93, 91, 96] },
          ]}
          formatX={(v: number) => `$${v} mil`}
        />
      </DemoExample>
      <DemoExample
        caption="Dos turnos con mayor solape y sin leyenda"
        code={`import { RidgelinePlot, type RidgelineSeries } from "@carlos-burelo/klin";

const series: RidgelineSeries[] = [
  { label: "Matutino", values: [6.5, 7, 7.2, 6.8, 7.5, 7.1, 6.9, 7.3, 7, 7.4] },
  { label: "Vespertino", values: [7.8, 8.2, 8, 8.5, 7.9, 8.3, 8.1, 8.4, 8, 8.2] },
];

<RidgelinePlot
  ariaLabel="Distribución de calificaciones de física por turno, con el vespertino por encima del matutino"
  series={series}
  overlap={0.8}
  showLegend={false}
/>`}
      >
        <RidgelinePlot
          ariaLabel="Distribución de calificaciones de física por turno, con el vespertino por encima del matutino"
          series={[
            {
              label: "Matutino",
              values: [6.5, 7, 7.2, 6.8, 7.5, 7.1, 6.9, 7.3, 7, 7.4],
            },
            {
              label: "Vespertino",
              values: [7.8, 8.2, 8, 8.5, 7.9, 8.3, 8.1, 8.4, 8, 8.2],
            },
          ]}
          overlap={0.8}
          showLegend={false}
        />
      </DemoExample>
      <DemoExample
        caption="Estrés: 8 sucursales con 480 tickets y tamaño de muestra visible"
        code={`import { RidgelinePlot, type RidgelineSeries } from "@carlos-burelo/klin";

const seriesEstres = Array.from({ length: 8 }, (_, g) => ({
  label: \`Sucursal \${g + 1} Periférico Sur\`,
  values: Array.from(
    { length: 60 },
    (_, i) =>
      Math.round(
        (30 + g * 8 + 16 * Math.abs(Math.sin(i / 7 + g * 0.9)) + ((i * 5 + g * 11) % 13)) * 10,
      ) / 10,
  ),
});

<RidgelinePlot
  ariaLabel="Distribución de minutos por ticket en ocho sucursales con 480 datos"
  series={seriesEstres}
  formatX={(v: number) => \`\${v} min\`}
  showSampleSize
/>`}
      >
        <RidgelinePlot
          ariaLabel="Distribución de minutos por ticket en ocho sucursales con 480 datos"
          series={seriesEstres}
          formatX={(v: number) => `${v} min`}
          showSampleSize
        />
      </DemoExample>
    </div>
  );
}
