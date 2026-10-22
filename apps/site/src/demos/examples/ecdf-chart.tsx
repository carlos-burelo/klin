import { ECDFChart } from "@carlos-burelo/klin";
import { DemoExample } from "../../components/docs/demo-example";

const groups = [
  { label: "2024", values: [120, 150, 180, 200, 240, 300, 380] },
  { label: "2025", values: [100, 130, 160, 190, 220, 260] },
];

const gruposEstres = Array.from({ length: 6 }, (_, g) => ({
  label: `Sucursal ${g + 1} del Bajío`,
  values: Array.from(
    { length: 80 },
    (_, i) =>
      Math.round(
        (90 +
          g * 25 +
          60 * Math.abs(Math.sin(i / 8 + g)) +
          ((i * 11 + g * 5) % 23)) *
          10,
      ) / 10,
  ),
}));

export default function ECDFChartExamples() {
  return (
    <div className="flex flex-col gap-6">
      <DemoExample
        caption="Dos cohortes anuales en escalones"
        code={`import { ECDFChart } from "@carlos-burelo/klin";

const groups = [
  { label: "2024", values: [120, 150, 180, 200, 240, 300, 380] },
  { label: "2025", values: [100, 130, 160, 190, 220, 260] },
];

<ECDFChart
  ariaLabel="Fracción de tickets bajo cada tiempo de cierre en horas"
  groups={groups}
/>`}
      >
        <ECDFChart
          ariaLabel="Fracción de tickets bajo cada tiempo de cierre en horas"
          groups={groups}
        />
      </DemoExample>
      <DemoExample
        caption="Con puntos y eje X formateado"
        code={`import { ECDFChart } from "@carlos-burelo/klin";

<ECDFChart
  ariaLabel="ECDF con vértices visibles"
  groups={groups}
  showPoints
  formatX={(v: number) => \`\${v} h\`}
/>`}
      >
        <ECDFChart
          ariaLabel="ECDF con vértices visibles"
          groups={groups}
          showPoints
          formatX={(v: number) => `${v} h`}
        />
      </DemoExample>
      <DemoExample
        caption="Mediana marcada al 50 % de probabilidad"
        code={`import { ECDFChart } from "@carlos-burelo/klin";

const groups = [
  { label: "2024", values: [120, 150, 180, 200, 240, 300, 380] },
  { label: "2025", values: [100, 130, 160, 190, 220, 260] },
];

<ECDFChart
  ariaLabel="ECDF de tiempos de cierre con mediana marcada"
  groups={groups}
  showMedian
  formatX={(v: number) => \`\${v} h\`}
/>`}
      >
        <ECDFChart
          ariaLabel="ECDF de tiempos de cierre con mediana marcada"
          groups={groups}
          showMedian
          formatX={(v: number) => `${v} h`}
        />
      </DemoExample>
      <DemoExample
        caption="Estrés: 6 sucursales con 480 tiempos de cierre y mediana marcada"
        code={`import { ECDFChart } from "@carlos-burelo/klin";

const gruposEstres = Array.from({ length: 6 }, (_, g) => ({
  label: \`Sucursal \${g + 1} del Bajío\`,
  values: Array.from(
    { length: 80 },
    (_, i) =>
      Math.round(
        (90 + g * 25 + 60 * Math.abs(Math.sin(i / 8 + g)) + ((i * 11 + g * 5) % 23)) * 10,
      ) / 10,
  ),
});

<ECDFChart
  ariaLabel="Fracción de tickets bajo cada tiempo de cierre en seis sucursales"
  groups={gruposEstres}
  showMedian
  formatX={(v: number) => \`\${v} h\`}
/>`}
      >
        <ECDFChart
          ariaLabel="Fracción de tickets bajo cada tiempo de cierre en seis sucursales"
          groups={gruposEstres}
          showMedian
          formatX={(v: number) => `${v} h`}
        />
      </DemoExample>
    </div>
  );
}
