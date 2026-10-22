import type { DensityPoint } from "@carlos-burelo/klin";
import { DensityContourPlot } from "@carlos-burelo/klin";
import { DemoExample } from "../../components/docs/demo-example";

const cafeterias: DensityPoint[] = [
  { x: 48, y: 210, label: "Condesa" },
  { x: 52, y: 235, label: "Roma" },
  { x: 45, y: 190, label: "Del Valle" },
  { x: 55, y: 250, label: "Polanco" },
  { x: 50, y: 220, label: "Narvarte" },
  { x: 47, y: 185, label: "Coyoacán" },
];

const cosechas: DensityPoint[] = [
  { x: 12, y: 3.2, label: "Parcela 1" },
  { x: 14, y: 3.8, label: "Parcela 2" },
  { x: 11, y: 2.9, label: "Parcela 3" },
  { x: 16, y: 4.5, label: "Parcela 4" },
  { x: 13, y: 3.5, label: "Parcela 5" },
  { x: 18, y: 5.1, label: "Parcela 6" },
  { x: 10, y: 2.4, label: "Parcela 7" },
  { x: 15, y: 4.1, label: "Parcela 8" },
];

const rentas: DensityPoint[] = [
  { x: 55, y: 9500, label: "Depto A" },
  { x: 70, y: 12500, label: "Depto B" },
  { x: 45, y: 7800, label: "Depto C" },
  { x: 90, y: 16800, label: "Depto D" },
  { x: 60, y: 10200, label: "Depto E" },
  { x: 80, y: 14400, label: "Depto F" },
];

export default function DensityContourPlotExamples() {
  return (
    <div className="flex flex-col gap-6">
      <DemoExample
        caption="densidad con etiquetas por punto"
        code={`import type { DensityPoint } from "@carlos-burelo/klin";
import { DensityContourPlot } from "@carlos-burelo/klin";

const cafeterias: DensityPoint[] = [
  { x: 48, y: 210, label: "Condesa" },
  { x: 52, y: 235, label: "Roma" },
  { x: 45, y: 190, label: "Del Valle" },
  { x: 55, y: 250, label: "Polanco" },
  { x: 50, y: 220, label: "Narvarte" },
  { x: 47, y: 185, label: "Coyoacán" },
];

<DensityContourPlot
  points={cafeterias}
  ariaLabel="Densidad de precio promedio frente a clientes por día en cafeterías"
/>`}
      >
        <DensityContourPlot
          points={cafeterias}
          ariaLabel="Densidad de precio promedio frente a clientes por día en cafeterías"
        />
      </DemoExample>
      <DemoExample
        caption="ancho de banda y niveles personalizados"
        code={`import type { DensityPoint } from "@carlos-burelo/klin";
import { DensityContourPlot } from "@carlos-burelo/klin";

const cosechas: DensityPoint[] = [
  { x: 12, y: 3.2, label: "Parcela 1" },
  { x: 14, y: 3.8, label: "Parcela 2" },
  { x: 11, y: 2.9, label: "Parcela 3" },
  { x: 16, y: 4.5, label: "Parcela 4" },
  { x: 13, y: 3.5, label: "Parcela 5" },
  { x: 18, y: 5.1, label: "Parcela 6" },
  { x: 10, y: 2.4, label: "Parcela 7" },
  { x: 15, y: 4.1, label: "Parcela 8" },
];

<DensityContourPlot
  points={cosechas}
  bandwidth={30}
  thresholds={4}
  ariaLabel="Densidad de lluvia frente a rendimiento por parcela en toneladas"
/>`}
      >
        <DensityContourPlot
          points={cosechas}
          bandwidth={30}
          thresholds={4}
          ariaLabel="Densidad de lluvia frente a rendimiento por parcela en toneladas"
        />
      </DemoExample>
      <DemoExample
        caption="formato moneda y sin leyenda"
        code={`import type { DensityPoint } from "@carlos-burelo/klin";
import { DensityContourPlot } from "@carlos-burelo/klin";

const rentas: DensityPoint[] = [
  { x: 55, y: 9500, label: "Depto A" },
  { x: 70, y: 12500, label: "Depto B" },
  { x: 45, y: 7800, label: "Depto C" },
  { x: 90, y: 16800, label: "Depto D" },
  { x: 60, y: 10200, label: "Depto E" },
  { x: 80, y: 14400, label: "Depto F" },
];

<DensityContourPlot
  points={rentas}
  format={(v) =>
    new Intl.NumberFormat("es-MX", {
      maximumFractionDigits: 0,
    }).format(v)
  }
  showLegend={false}
  ariaLabel="Densidad de superficie frente a renta mensual de departamentos"
/>`}
      >
        <DensityContourPlot
          points={rentas}
          format={(v) =>
            new Intl.NumberFormat("es-MX", {
              maximumFractionDigits: 0,
            }).format(v)
          }
          showLegend={false}
          ariaLabel="Densidad de superficie frente a renta mensual de departamentos"
        />
      </DemoExample>
      <DemoExample
        caption="color propio sin puntos de muestra"
        code={`import type { DensityPoint } from "@carlos-burelo/klin";
import { DensityContourPlot } from "@carlos-burelo/klin";

const cafeterias: DensityPoint[] = [
  { x: 48, y: 210, label: "Condesa" },
  { x: 52, y: 235, label: "Roma" },
  { x: 45, y: 190, label: "Del Valle" },
  { x: 55, y: 250, label: "Polanco" },
  { x: 50, y: 220, label: "Narvarte" },
  { x: 47, y: 185, label: "Coyoacán" },
];

<DensityContourPlot
  points={cafeterias}
  color="#db2777"
  showPoints={false}
  ariaLabel="Densidad de cafeterías solo con contornos rosas"
/>`}
      >
        <DensityContourPlot
          points={cafeterias}
          color="#db2777"
          showPoints={false}
          ariaLabel="Densidad de cafeterías solo con contornos rosas"
        />
      </DemoExample>
    </div>
  );
}
