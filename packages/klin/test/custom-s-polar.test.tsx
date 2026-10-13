/**
 * klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE).
 *
 * Props simples (S) de CUSTOMIZATION.md (polares y medidores):
 * cada bloque verifica que el default preserva la salida actual
 * y que cada prop nueva cambia el output.
 */
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, test } from "vitest";
import type { BulletRow } from "../src/components/bullet-chart";
import { BulletChart } from "../src/components/bullet-chart";
import { DonutChart, PieChart } from "../src/components/donut-chart";
import { GaugeChart } from "../src/components/gauge-chart";
import { ProgressList } from "../src/components/progress-list";
import { RadarChart } from "../src/components/radar-chart";
import { RadialProgress } from "../src/components/radial-progress";
import { Sparkline } from "../src/components/sparkline";
import { WaffleChart } from "../src/components/waffle-chart";

const DONUT_DATA = [
  { label: "A", value: 30 },
  { label: "B", value: 70 },
];

describe("DonutChart/PieChart props S", () => {
  test("default preserva salida: 2 arcos, total y leyenda sin etiquetas internas", () => {
    const html = renderToStaticMarkup(
      <DonutChart ariaLabel="dona" data={DONUT_DATA} />,
    );
    expect(html.match(/<path/g)?.length).toBe(2);
    expect(html).toContain("Total");
    expect(html).toContain("A · 30");
    expect(html.match(/<text/g)?.length).toBe(2);
  });

  test("startAngle rota las rebanadas", () => {
    const base = renderToStaticMarkup(
      <DonutChart ariaLabel="dona" data={DONUT_DATA} />,
    );
    const html = renderToStaticMarkup(
      <DonutChart ariaLabel="dona" data={DONUT_DATA} startAngle={Math.PI} />,
    );
    expect(html).not.toBe(base);
  });

  test("padAngle separa las rebanadas", () => {
    const base = renderToStaticMarkup(
      <DonutChart ariaLabel="dona" data={DONUT_DATA} />,
    );
    const html = renderToStaticMarkup(
      <DonutChart ariaLabel="dona" data={DONUT_DATA} padAngle={0.05} />,
    );
    expect(html).not.toBe(base);
  });

  test("cornerRadius redondea los arcos", () => {
    const base = renderToStaticMarkup(
      <DonutChart ariaLabel="dona" data={DONUT_DATA} />,
    );
    const html = renderToStaticMarkup(
      <DonutChart ariaLabel="dona" data={DONUT_DATA} cornerRadius={6} />,
    );
    expect(html).not.toBe(base);
  });

  test("sortSlices ordena de mayor a menor (default respeta la entrada)", () => {
    const data = [
      { label: "Chica", value: 10 },
      { label: "Grande", value: 90 },
    ];
    const base = renderToStaticMarkup(
      <DonutChart ariaLabel="dona" data={data} />,
    );
    expect(base.indexOf("Chica")).toBeLessThan(base.indexOf("Grande"));
    const html = renderToStaticMarkup(
      <DonutChart ariaLabel="dona" data={data} sortSlices />,
    );
    expect(html.indexOf("Grande")).toBeLessThan(html.indexOf("Chica"));
  });

  test("innerLabels=percent pinta el % dentro del arco grande", () => {
    const html = renderToStaticMarkup(
      <DonutChart ariaLabel="dona" data={DONUT_DATA} innerLabels="percent" />,
    );
    expect(html).toContain("30%</text>");
    expect(html).toContain("70%</text>");
    expect(html.match(/<text/g)?.length).toBe(4);
  });

  test("PieChart propaga las props nuevas", () => {
    const base = renderToStaticMarkup(
      <PieChart ariaLabel="torta" data={DONUT_DATA} />,
    );
    expect(base.match(/<path/g)?.length).toBe(2);
    const html = renderToStaticMarkup(
      <PieChart
        ariaLabel="torta"
        data={DONUT_DATA}
        innerLabels="percent"
        cornerRadius={4}
      />,
    );
    expect(html).not.toBe(base);
    expect(html).toContain("30%</text>");
  });
});

describe("GaugeChart props S", () => {
  test("default preserva salida 0–100 con 5 marcas", () => {
    const html = renderToStaticMarkup(
      <GaugeChart ariaLabel="vel" value={72} />,
    );
    expect(html).toContain("72%");
    expect(html).toContain(">100</text>");
    expect(html.match(/<line/g)?.length).toBe(5);
  });

  test("min/max reescalan marcas y valor", () => {
    const base = renderToStaticMarkup(
      <GaugeChart ariaLabel="vel" value={50} />,
    );
    const html = renderToStaticMarkup(
      <GaugeChart ariaLabel="vel" value={50} min={20} max={80} />,
    );
    expect(html).toContain(">20</text>");
    expect(html).toContain(">80</text>");
    expect(html).toContain("50%");
    expect(html).not.toBe(base);
  });

  test("showNeedle pinta aguja en lugar del arco", () => {
    const base = renderToStaticMarkup(
      <GaugeChart ariaLabel="vel" value={72} />,
    );
    const html = renderToStaticMarkup(
      <GaugeChart ariaLabel="vel" value={72} showNeedle />,
    );
    expect(html.match(/<line/g)?.length).toBe(6);
    expect(html).not.toBe(base);
  });

  test("emptyDescription aparece en el estado vacío", () => {
    const html = renderToStaticMarkup(
      <GaugeChart
        ariaLabel="vel"
        value={Number.NaN}
        emptyDescription="sin lectura"
      />,
    );
    expect(html).toContain("sin lectura");
  });
});

describe("RadialProgress props S", () => {
  test("default preserva anillo continuo 0–100", () => {
    const html = renderToStaticMarkup(
      <RadialProgress ariaLabel="anillo" value={65} />,
    );
    expect(html).toContain("65%");
    expect(html.match(/<path/g)?.length).toBe(2);
  });

  test("min/max reescalan el avance", () => {
    const base = renderToStaticMarkup(
      <RadialProgress ariaLabel="anillo" value={65} />,
    );
    const html = renderToStaticMarkup(
      <RadialProgress ariaLabel="anillo" value={65} min={20} max={80} />,
    );
    expect(html).toContain("65%");
    expect(html).not.toBe(base);
  });

  test("trackStyle=ticks segmenta la pista", () => {
    const html = renderToStaticMarkup(
      <RadialProgress ariaLabel="anillo" value={65} trackStyle="ticks" />,
    );
    expect(html.match(/<path/g)?.length).toBeGreaterThan(2);
  });

  test("emptyDescription aparece en el estado vacío", () => {
    const html = renderToStaticMarkup(
      <RadialProgress
        ariaLabel="anillo"
        value={Number.NaN}
        emptyDescription="sin avance"
      />,
    );
    expect(html).toContain("sin avance");
  });
});

describe("WaffleChart props S", () => {
  const parts = [
    { label: "A", value: 60 },
    { label: "B", value: 40 },
  ];

  test("default preserva 100 celdas y leyenda con valores", () => {
    const html = renderToStaticMarkup(
      <WaffleChart ariaLabel="waffle" parts={parts} />,
    );
    expect(html.match(/<rect/g)?.length).toBe(100);
    expect(html).toContain("A · 60%");
  });

  test("columns reparte las 100 celdas", () => {
    const base = renderToStaticMarkup(
      <WaffleChart ariaLabel="waffle" parts={parts} />,
    );
    const html = renderToStaticMarkup(
      <WaffleChart ariaLabel="waffle" parts={parts} columns={5} />,
    );
    expect(html.match(/<rect/g)?.length).toBe(100);
    expect(html).not.toBe(base);
  });

  test("gap cambia la separación", () => {
    const base = renderToStaticMarkup(
      <WaffleChart ariaLabel="waffle" parts={parts} />,
    );
    const html = renderToStaticMarkup(
      <WaffleChart ariaLabel="waffle" parts={parts} gap={0} />,
    );
    expect(html).not.toBe(base);
  });

  test("cellRadius cambia la esquina de celda", () => {
    const html = renderToStaticMarkup(
      <WaffleChart ariaLabel="waffle" parts={parts} cellRadius={0} />,
    );
    expect(html).toContain('rx="0"');
  });

  test("showLegendValues=false oculta los valores de la leyenda", () => {
    const html = renderToStaticMarkup(
      <WaffleChart ariaLabel="waffle" parts={parts} showLegendValues={false} />,
    );
    expect(html).not.toContain("A ·");
    expect(html).toContain(">A</span>");
  });
});

describe("RadarChart props S", () => {
  const axes = ["A", "B", "C"];
  const series = [
    { label: "S1", values: [3, 4, 5] },
    { label: "S2", values: [5, 2, 4] },
  ];

  test("default preserva relleno y vértices", () => {
    const html = renderToStaticMarkup(
      <RadarChart ariaLabel="radar" axes={axes} series={series} />,
    );
    expect(html.match(/<circle/g)?.length).toBe(6);
    expect(html).toContain('fill-opacity="0.18"');
  });

  test("fillOpacity se aplica único y por serie", () => {
    const single = renderToStaticMarkup(
      <RadarChart
        ariaLabel="radar"
        axes={axes}
        series={series}
        fillOpacity={0.5}
      />,
    );
    expect(single).toContain('fill-opacity="0.5"');
    const perSeries = renderToStaticMarkup(
      <RadarChart
        ariaLabel="radar"
        axes={axes}
        series={series}
        fillOpacity={[0.1, 0.4]}
      />,
    );
    expect(perSeries).toContain('fill-opacity="0.1"');
    expect(perSeries).toContain('fill-opacity="0.4"');
  });

  test("showVertices=false oculta los vértices", () => {
    const html = renderToStaticMarkup(
      <RadarChart
        ariaLabel="radar"
        axes={axes}
        series={series}
        showVertices={false}
      />,
    );
    expect(html.match(/<circle/g)).toBeNull();
  });

  test("scale=sqrt comprime los valores altos", () => {
    const base = renderToStaticMarkup(
      <RadarChart ariaLabel="radar" axes={axes} series={series} />,
    );
    const html = renderToStaticMarkup(
      <RadarChart ariaLabel="radar" axes={axes} series={series} scale="sqrt" />,
    );
    expect(html).not.toBe(base);
  });
});

describe("BulletChart props S", () => {
  const rows: BulletRow[] = [
    { label: "A", value: 72, target: 90, ranges: [40, 70, 100] },
  ];

  test("default preserva valor/meta y bandas", () => {
    const html = renderToStaticMarkup(
      <BulletChart ariaLabel="balas" rows={rows} />,
    );
    expect(html).toContain("72 / 90");
  });

  test("bands cambia los colores", () => {
    const html = renderToStaticMarkup(
      <BulletChart
        ariaLabel="balas"
        rows={rows}
        bands={["hotpink", "hotpink", "hotpink"]}
      />,
    );
    expect(html).toContain("hotpink");
  });

  test("showTargetLabel=false oculta la meta", () => {
    const html = renderToStaticMarkup(
      <BulletChart ariaLabel="balas" rows={rows} showTargetLabel={false} />,
    );
    expect(html).not.toContain("72 / 90");
    expect(html).toContain("72");
  });

  test("scaleMax fijo reescala las barras", () => {
    const base = renderToStaticMarkup(
      <BulletChart ariaLabel="balas" rows={rows} />,
    );
    const html = renderToStaticMarkup(
      <BulletChart ariaLabel="balas" rows={rows} scaleMax={200} />,
    );
    expect(html).not.toBe(base);
  });

  test("height fija el alto de la pista", () => {
    const html = renderToStaticMarkup(
      <BulletChart ariaLabel="balas" rows={rows} height={40} />,
    );
    expect(html).toContain("height:40px");
  });

  test("id prefija los clipPath", () => {
    const html = renderToStaticMarkup(
      <BulletChart ariaLabel="balas" rows={rows} id="bala" />,
    );
    expect(html).toContain('id="bala-bullet-0"');
    expect(html).toContain("url(#bala-bullet-0)");
  });
});

describe("ProgressList props S", () => {
  const rows = [
    { label: "A", value: 30, total: 100 },
    { label: "B", value: 75, total: 100 },
  ];

  test("default preserva filas, anchos y tips", () => {
    const html = renderToStaticMarkup(
      <ProgressList ariaLabel="avances" rows={rows} />,
    );
    expect(html).toContain("30 · 30%");
    expect(html).toContain("width:30%");
    expect(html).toContain("A: 30 de 100");
  });

  test("barHeight=sm afina la barra", () => {
    const html = renderToStaticMarkup(
      <ProgressList ariaLabel="avances" rows={rows} barHeight="sm" />,
    );
    expect(html).toContain("h-1");
    expect(html).not.toContain("h-2");
  });

  test("showPercent=false oculta el %", () => {
    const html = renderToStaticMarkup(
      <ProgressList ariaLabel="avances" rows={rows} showPercent={false} />,
    );
    expect(html).toContain(">30</span>");
    expect(html).not.toContain("· 30%");
  });

  test("status colorea la barra por umbral", () => {
    const base = renderToStaticMarkup(
      <ProgressList ariaLabel="avances" rows={rows} />,
    );
    expect(base).toContain("var(--chart-1)");
    const html = renderToStaticMarkup(
      <ProgressList
        ariaLabel="avances"
        rows={rows}
        status={(pct) => (pct >= 70 ? "ok" : pct >= 40 ? "warn" : "bad")}
      />,
    );
    expect(html).toContain("var(--destructive)");
    expect(html).toContain("var(--chart-2)");
    expect(html).not.toBe(base);
  });
});

describe("Sparkline props S", () => {
  const values = [3, 5, 2, 8, 6, 4];

  test("default preserva línea + área + punto final", () => {
    const html = renderToStaticMarkup(
      <Sparkline ariaLabel="mini" values={values} />,
    );
    expect(html.match(/<path/g)?.length).toBe(2);
    expect(html.match(/<circle/g)?.length).toBe(1);
    expect(html).not.toContain("<rect");
    expect(html).not.toContain("stroke-dasharray");
  });

  test("kind=area enfatiza el relleno", () => {
    const html = renderToStaticMarkup(
      <Sparkline ariaLabel="mini" values={values} kind="area" />,
    );
    expect(html).toContain('opacity="0.35"');
  });

  test("kind=bar pinta una barra por valor", () => {
    const html = renderToStaticMarkup(
      <Sparkline ariaLabel="mini" values={values} kind="bar" />,
    );
    expect(html.match(/<rect/g)?.length).toBe(values.length);
    expect(html.match(/<path/g)).toBeNull();
  });

  test("showLastDot=false oculta el punto final", () => {
    const html = renderToStaticMarkup(
      <Sparkline ariaLabel="mini" values={values} showLastDot={false} />,
    );
    expect(html.match(/<circle/g)).toBeNull();
  });

  test("showMinMax marca mínimo y máximo", () => {
    const html = renderToStaticMarkup(
      <Sparkline ariaLabel="mini" values={values} showMinMax />,
    );
    expect(html.match(/<circle/g)?.length).toBe(3);
    expect(html).toContain("Máx:");
    expect(html).toContain("Mín:");
  });

  test("reference pinta la línea de meta", () => {
    const html = renderToStaticMarkup(
      <Sparkline ariaLabel="mini" values={values} reference={5} />,
    );
    expect(html).toContain("stroke-dasharray");
    expect(html).toContain("Meta:");
  });
});
