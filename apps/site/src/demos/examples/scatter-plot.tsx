import type { ScatterPoint } from "@carlos-burelo/klin";
import { ScatterPlot } from "@carlos-burelo/klin";
import { DemoExample } from "../../components/docs/demo-example";

const sucursales: ScatterPoint[] = [
  { x: 42, y: 61, label: "Norte A" },
  { x: 48, y: 66, label: "Norte B" },
  { x: 45, y: 58, label: "Norte C" },
  { x: 51, y: 63, label: "Norte D" },
  { x: 44, y: 69, label: "Norte E" },
  { x: 72, y: 41, label: "Centro A" },
  { x: 68, y: 48, label: "Centro B" },
  { x: 75, y: 44, label: "Centro C" },
  { x: 70, y: 38, label: "Centro D" },
  { x: 77, y: 50, label: "Centro E" },
  { x: 30, y: 25, label: "Sur A" },
  { x: 34, y: 31, label: "Sur B" },
  { x: 28, y: 22, label: "Sur C" },
  { x: 36, y: 28, label: "Sur D" },
  { x: 60, y: 72, label: "Insurgentes" },
  { x: 20, y: 55, label: "Doctores" },
];

const riesgo: ScatterPoint[] = [
  { x: -8, y: 12, label: "Afores" },
  { x: -5, y: 7, label: "Bonos M" },
  { x: -3, y: -4, label: "Fibras" },
  { x: 4, y: 14, label: "Tech MX" },
  { x: 7, y: 9, label: "Retail" },
  { x: 9, y: -6, label: "Cripto" },
  { x: 6, y: -3, label: "Startups" },
  { x: -6, y: -8, label: "Cetes 28d" },
  { x: 3, y: 5, label: "Energía" },
  { x: -2, y: 3, label: "Salud" },
];

const sueldos: ScatterPoint[] = [
  { x: 1, y: 12, label: "Ana" },
  { x: 2, y: 13.5, label: "Beto" },
  { x: 3, y: 12.8, label: "Carla" },
  { x: 4, y: 14.2, label: "Diego" },
  { x: 5, y: 13.1, label: "Elena" },
  { x: 6, y: 15.4, label: "Fer" },
  { x: 7, y: 14.8, label: "Gaby" },
  { x: 8, y: 38, label: "Dirección" },
  { x: 2.5, y: 6.2, label: "Becario" },
];

const nubeEstres: ScatterPoint[] = Array.from({ length: 400 }, (_, i) => {
  const g = i % 4;
  const bx = [-40, 30, -25, 45][g] ?? 0;
  const by = [35, 40, -30, -35][g] ?? 0;
  return {
    x:
      Math.round(
        (bx + 14 * Math.sin(i * 1.7 + g) + ((i * 5 + g) % 11) - 5) * 10,
      ) / 10,
    y:
      Math.round(
        (by + 12 * Math.cos(i * 2.3 + g * 2) + ((i * 3 + g * 7) % 9) - 4) * 10,
      ) / 10,
    label: `Punto ${i + 1} del cuadrante ${g + 1}`,
  };
});

export default function ScatterPlotExamples() {
  return (
    <div className="flex flex-col gap-6">
      <DemoExample
        caption="tres grupos con color por zona y ruido real"
        code={`import type { ScatterPoint } from "@carlos-burelo/klin";
import { ScatterPlot } from "@carlos-burelo/klin";

const sucursales: ScatterPoint[] = [
  { x: 42, y: 61, label: "Norte A" },
  { x: 48, y: 66, label: "Norte B" },
  { x: 72, y: 41, label: "Centro A" },
  { x: 68, y: 48, label: "Centro B" },
  { x: 30, y: 25, label: "Sur A" },
  { x: 60, y: 72, label: "Insurgentes" },
  // …16 puntos en 3 nubes + 2 atípicos
];

<ScatterPlot
  points={sucursales}
  xLabel="Tráfico (miles)"
  yLabel="Ticket promedio"
  itemColor={(p) =>
    (p.label ?? "").startsWith("Norte")
      ? "var(--chart-1)"
      : (p.label ?? "").startsWith("Centro")
        ? "var(--chart-2)"
        : "var(--chart-4)"
  }
  ariaLabel="Tráfico contra ticket por sucursal: tres nubes por zona más dos atípicas"
/>`}
      >
        <ScatterPlot
          points={sucursales}
          xLabel="Tráfico (miles)"
          yLabel="Ticket promedio"
          itemColor={(p) =>
            (p.label ?? "").startsWith("Norte")
              ? "var(--chart-1)"
              : (p.label ?? "").startsWith("Centro")
                ? "var(--chart-2)"
                : "var(--chart-4)"
          }
          ariaLabel="Tráfico contra ticket por sucursal: tres nubes por zona más dos atípicas"
        />
      </DemoExample>
      <DemoExample
        caption="cuatro cuadrantes con negativos y cruz en medias"
        code={`import type { ScatterPoint } from "@carlos-burelo/klin";
import { ScatterPlot } from "@carlos-burelo/klin";

const riesgo: ScatterPoint[] = [
  { x: -8, y: 12, label: "Afores" },
  { x: -3, y: -4, label: "Fibras" },
  { x: 4, y: 14, label: "Tech MX" },
  { x: 9, y: -6, label: "Cripto" },
  // …10 activos en los 4 cuadrantes
];

<ScatterPlot
  points={riesgo}
  xLabel="Riesgo"
  yLabel="Rendimiento %"
  quadrants
  itemColor={(p) =>
    p.x >= 0 && p.y >= 0
      ? "var(--chart-1)"
      : p.x < 0 && p.y >= 0
        ? "var(--chart-2)"
        : "var(--chart-5)"
  }
  ariaLabel="Riesgo contra rendimiento: Tech MX lidera el cuadrante ideal, Cripto rinde poco con mucho riesgo"
/>`}
      >
        <ScatterPlot
          points={riesgo}
          xLabel="Riesgo"
          yLabel="Rendimiento %"
          quadrants
          itemColor={(p) =>
            p.x >= 0 && p.y >= 0
              ? "var(--chart-1)"
              : p.x < 0 && p.y >= 0
                ? "var(--chart-2)"
                : "var(--chart-5)"
          }
          ariaLabel="Riesgo contra rendimiento: Tech MX lidera el cuadrante ideal, Cripto rinde poco con mucho riesgo"
        />
      </DemoExample>
      <DemoExample
        caption="atípicos destacados con formato moneda"
        code={`import type { ScatterPoint } from "@carlos-burelo/klin";
import { ScatterPlot } from "@carlos-burelo/klin";

const sueldos: ScatterPoint[] = [
  { x: 1, y: 12, label: "Ana" },
  { x: 4, y: 14.2, label: "Diego" },
  { x: 8, y: 38, label: "Dirección" },
  { x: 2.5, y: 6.2, label: "Becario" },
  // …7 sueldos base entre 12 y 15 mil
];

<ScatterPlot
  points={sueldos}
  xLabel="Antigüedad (años)"
  yLabel="Sueldo (miles)"
  color="var(--chart-1)"
  itemColor={(p) =>
    p.label === "Dirección" || p.label === "Becario"
      ? "var(--chart-5)"
      : undefined
  }
  format={(v: number) =>
    new Intl.NumberFormat("es-MX", {
      maximumFractionDigits: 1,
    }).format(v)
  }
  ariaLabel="Sueldo por antigüedad: banda de 12 a 15 mil con dos atípicos fuera"
/>`}
      >
        <ScatterPlot
          points={sueldos}
          xLabel="Antigüedad (años)"
          yLabel="Sueldo (miles)"
          color="var(--chart-1)"
          itemColor={(p) =>
            p.label === "Dirección" || p.label === "Becario"
              ? "var(--chart-5)"
              : undefined
          }
          format={(v: number) =>
            new Intl.NumberFormat("es-MX", {
              maximumFractionDigits: 1,
            }).format(v)
          }
          ariaLabel="Sueldo por antigüedad: banda de 12 a 15 mil con dos atípicos fuera"
        />
      </DemoExample>
      <DemoExample
        caption="banda salarial esperada como anotación horizontal"
        code={`import type { ScatterPoint } from "@carlos-burelo/klin";
import { ScatterPlot } from "@carlos-burelo/klin";

const sueldos: ScatterPoint[] = [
  { x: 1, y: 12, label: "Ana" },
  { x: 4, y: 14.2, label: "Diego" },
  { x: 8, y: 38, label: "Dirección" },
  { x: 2.5, y: 6.2, label: "Becario" },
  // …7 sueldos base entre 12 y 15 mil
];

<ScatterPlot
  points={sueldos}
  xLabel="Antigüedad (años)"
  yLabel="Sueldo (miles)"
  annotations={[{ value: 15, label: "Tope banda" }]}
  ariaLabel="Sueldo por antigüedad con tope de banda anotado en 15 mil"
/>`}
      >
        <ScatterPlot
          points={sueldos}
          xLabel="Antigüedad (años)"
          yLabel="Sueldo (miles)"
          annotations={[{ value: 15, label: "Tope banda" }]}
          ariaLabel="Sueldo por antigüedad con tope de banda anotado en 15 mil"
        />
      </DemoExample>
      <DemoExample
        caption="Estrés: 400 puntos deterministas en 4 cuadrantes con negativos"
        code={`import type { ScatterPoint } from "@carlos-burelo/klin";
import { ScatterPlot } from "@carlos-burelo/klin";

const nubeEstres: ScatterPoint[] = Array.from({ length: 400 }, (_, i) => {
  const g = i % 4;
  const bx = [-40, 30, -25, 45][g] ?? 0;
  const by = [35, 40, -30, -35][g] ?? 0;
  return {
    x:
      Math.round(
        (bx + 14 * Math.sin(i * 1.7 + g) + ((i * 5 + g) % 11) - 5) * 10,
      ) / 10,
    y:
      Math.round(
        (by + 12 * Math.cos(i * 2.3 + g * 2) + ((i * 3 + g * 7) % 9) - 4) * 10,
      ) / 10,
    label: \`Punto \${i + 1} del cuadrante \${g + 1}\`,
  };
});

<ScatterPlot
  points={nubeEstres}
  xLabel="Desviación X"
  yLabel="Desviación Y"
  quadrants
  pointRadius={2}
  ariaLabel="Nube de 400 lecturas de sensores en cuatro cuadrantes con cruz en medias"
/>`}
      >
        <ScatterPlot
          points={nubeEstres}
          xLabel="Desviación X"
          yLabel="Desviación Y"
          quadrants
          pointRadius={2}
          ariaLabel="Nube de 400 lecturas de sensores en cuatro cuadrantes con cruz en medias"
        />
      </DemoExample>
    </div>
  );
}
