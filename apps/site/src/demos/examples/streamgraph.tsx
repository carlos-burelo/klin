import type { ChartSeries } from "@carlos-burelo/klin";
import { Streamgraph } from "@carlos-burelo/klin";
import { DemoExample } from "../../components/docs/demo-example";

const seriesEnergia: ChartSeries[] = [
  { key: "solar", label: "Solar" },
  { key: "eolica", label: "Eólica" },
  { key: "hidro", label: "Hidro" },
];

const datosEnergia: Array<Record<string, string | number>> = [
  { mes: "Ene", solar: 30, eolica: 50, hidro: 40 },
  { mes: "Feb", solar: 45, eolica: 55, hidro: 38 },
  { mes: "Mar", solar: 60, eolica: 48, hidro: 42 },
  { mes: "Abr", solar: 80, eolica: 44, hidro: 45 },
  { mes: "May", solar: 95, eolica: 40, hidro: 43 },
];

const seriesGasto: ChartSeries[] = [
  { key: "nomina", label: "Nómina" },
  { key: "obra", label: "Obra" },
];

const datosGasto: Array<Record<string, string | number>> = [
  { trim: "T1", nomina: 4_200_000, obra: 900_000 },
  { trim: "T2", nomina: 4_350_000, obra: 1_400_000 },
  { trim: "T3", nomina: 4_400_000, obra: 1_100_000 },
  { trim: "T4", nomina: 4_600_000, obra: 700_000 },
];

const datosIntermitentes: Array<Record<string, string | number>> = [
  { mes: "Ene", solar: 30, eolica: 0, hidro: 40 },
  { mes: "Feb", solar: 0, eolica: 55, hidro: 38 },
  { mes: "Mar", solar: 60, eolica: 48, hidro: 0 },
  { mes: "Abr", solar: 80, eolica: 0, hidro: 45 },
];

const seriesEstres: ChartSeries[] = [
  { key: "s1", label: "Serie 1" },
  { key: "s2", label: "Serie 2" },
  { key: "s3", label: "Serie 3" },
  { key: "s4", label: "Serie 4" },
  { key: "s5", label: "Serie 5" },
  { key: "s6", label: "Serie 6" },
  { key: "s7", label: "Serie 7" },
];

const datosEstres: Array<Record<string, string | number>> = Array.from(
  { length: 24 },
  (_, i) => {
    const fila: Record<string, string | number> = { sem: `S${i + 1}` };
    for (let s = 0; s < 7; s += 1) {
      fila[`s${s + 1}`] =
        40 + Math.round(25 * Math.sin((i + s * 3) / 3)) + ((i * (s + 2)) % 17);
    }
    return fila;
  },
);

export default function StreamgraphExamples() {
  return (
    <div className="flex flex-col gap-6">
      <DemoExample
        caption="tres fuentes de energía con leyenda"
        code={`import type { ChartSeries } from "@carlos-burelo/klin";
import { Streamgraph } from "@carlos-burelo/klin";

const seriesEnergia: ChartSeries[] = [
  { key: "solar", label: "Solar" },
  { key: "eolica", label: "Eólica" },
  { key: "hidro", label: "Hidro" },
];

const datosEnergia: Array<Record<string, string | number>> = [
  { mes: "Ene", solar: 30, eolica: 50, hidro: 40 },
  { mes: "Feb", solar: 45, eolica: 55, hidro: 38 },
  { mes: "Mar", solar: 60, eolica: 48, hidro: 42 },
  { mes: "Abr", solar: 80, eolica: 44, hidro: 45 },
  { mes: "May", solar: 95, eolica: 40, hidro: 43 },
];

<Streamgraph
  data={datosEnergia}
  xKey="mes"
  series={seriesEnergia}
  ariaLabel="Generación mensual por fuente de energía"
/>`}
      >
        <Streamgraph
          data={datosEnergia}
          xKey="mes"
          series={seriesEnergia}
          ariaLabel="Generación mensual por fuente de energía"
        />
      </DemoExample>
      <DemoExample
        caption="dos rubros con formato moneda y sin leyenda"
        code={`import type { ChartSeries } from "@carlos-burelo/klin";
import { Streamgraph } from "@carlos-burelo/klin";

const seriesGasto: ChartSeries[] = [
  { key: "nomina", label: "Nómina" },
  { key: "obra", label: "Obra" },
];

const datosGasto: Array<Record<string, string | number>> = [
  { trim: "T1", nomina: 4_200_000, obra: 900_000 },
  { trim: "T2", nomina: 4_350_000, obra: 1_400_000 },
  { trim: "T3", nomina: 4_400_000, obra: 1_100_000 },
  { trim: "T4", nomina: 4_600_000, obra: 700_000 },
];

<Streamgraph
  data={datosGasto}
  xKey="trim"
  series={seriesGasto}
  formatY={(v) =>
    new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
      maximumFractionDigits: 0,
    }).format(v)
  }
  showLegend={false}
  ariaLabel="Gasto trimestral en nómina y obra en pesos"
/>`}
      >
        <Streamgraph
          data={datosGasto}
          xKey="trim"
          series={seriesGasto}
          formatY={(v) =>
            new Intl.NumberFormat("es-MX", {
              style: "currency",
              currency: "MXN",
              maximumFractionDigits: 0,
            }).format(v)
          }
          showLegend={false}
          ariaLabel="Gasto trimestral en nómina y obra en pesos"
        />
      </DemoExample>
      <DemoExample
        caption="series intermitentes con ceros"
        code={`import type { ChartSeries } from "@carlos-burelo/klin";
import { Streamgraph } from "@carlos-burelo/klin";

const seriesEnergia: ChartSeries[] = [
  { key: "solar", label: "Solar" },
  { key: "eolica", label: "Eólica" },
  { key: "hidro", label: "Hidro" },
];

const datosIntermitentes: Array<Record<string, string | number>> = [
  { mes: "Ene", solar: 30, eolica: 0, hidro: 40 },
  { mes: "Feb", solar: 0, eolica: 55, hidro: 38 },
  { mes: "Mar", solar: 60, eolica: 48, hidro: 0 },
  { mes: "Abr", solar: 80, eolica: 0, hidro: 45 },
];

<Streamgraph
  data={datosIntermitentes}
  xKey="mes"
  series={seriesEnergia}
  ariaLabel="Generación con meses en cero por fuente"
/>`}
      >
        <Streamgraph
          data={datosIntermitentes}
          xKey="mes"
          series={seriesEnergia}
          ariaLabel="Generación con meses en cero por fuente"
        />
      </DemoExample>
      <DemoExample
        caption="silueta simétrica centrada en cero"
        code={`import type { ChartSeries } from "@carlos-burelo/klin";
import { Streamgraph } from "@carlos-burelo/klin";

const seriesEnergia: ChartSeries[] = [
  { key: "solar", label: "Solar" },
  { key: "eolica", label: "Eólica" },
  { key: "hidro", label: "Hidro" },
];

const datosEnergia: Array<Record<string, string | number>> = [
  { mes: "Ene", solar: 30, eolica: 50, hidro: 40 },
  { mes: "Feb", solar: 45, eolica: 55, hidro: 38 },
  { mes: "Mar", solar: 60, eolica: 48, hidro: 42 },
  { mes: "Abr", solar: 80, eolica: 44, hidro: 45 },
  { mes: "May", solar: 95, eolica: 40, hidro: 43 },
];

<Streamgraph
  data={datosEnergia}
  xKey="mes"
  series={seriesEnergia}
  offset="silhouette"
  ariaLabel="Generación mensual con silueta simétrica centrada"
/>`}
      >
        <Streamgraph
          data={datosEnergia}
          xKey="mes"
          series={seriesEnergia}
          offset="silhouette"
          ariaLabel="Generación mensual con silueta simétrica centrada"
        />
      </DemoExample>
      <DemoExample
        caption="estrés: 7 capas y 24 semanas con generador determinista"
        code={`import type { ChartSeries } from "@carlos-burelo/klin";
import { Streamgraph } from "@carlos-burelo/klin";

const seriesEstres: ChartSeries[] = [
  { key: "s1", label: "Serie 1" },
  { key: "s2", label: "Serie 2" },
  { key: "s3", label: "Serie 3" },
  { key: "s4", label: "Serie 4" },
  { key: "s5", label: "Serie 5" },
  { key: "s6", label: "Serie 6" },
  { key: "s7", label: "Serie 7" },
];

const datosEstres: Array<Record<string, string | number>> = Array.from(
  { length: 24 },
  (_, i) => {
    const fila: Record<string, string | number> = { sem: \`S\${i + 1}\` };
    for (let s = 0; s < 7; s += 1) {
      fila[\`s\${s + 1}\`] =
        40 + Math.round(25 * Math.sin((i + s * 3) / 3)) + ((i * (s + 2)) % 17);
    }
    return fila;
  },
);

<Streamgraph
  data={datosEstres}
  xKey="sem"
  series={seriesEstres}
  ariaLabel="Consumo semanal por línea con siete capas y 24 semanas"
/>`}
      >
        <Streamgraph
          data={datosEstres}
          xKey="sem"
          series={seriesEstres}
          ariaLabel="Consumo semanal por línea con siete capas y 24 semanas"
        />
      </DemoExample>
    </div>
  );
}
