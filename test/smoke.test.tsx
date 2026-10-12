/**
 * klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE).
 *
 * Smoke SSR de TODOS los componentes exportados en src/index.ts:
 * renderToStaticMarkup con datos mínimos válidos + invariantes
 * (role, aria-label, sin "NaN", tip/title) + caso vacío con EMPTY_TITLE.
 */
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, test } from "vitest";
import { ArcDiagram } from "../src/components/arc-diagram";
import { ArchitectureDiagram } from "../src/components/architecture-diagram";
import { AreaChart } from "../src/components/area-chart";
import { BarChart } from "../src/components/bar-chart";
import { BoxPlot } from "../src/components/box-plot";
import { BulletChart } from "../src/components/bullet-chart";
import { CalendarHeatmap } from "../src/components/calendar-heatmap";
import { ClassDiagram } from "../src/components/class-diagram";
import { DivergingBar } from "../src/components/diverging-bar";
import { DonutChart, PieChart } from "../src/components/donut-chart";
import { ChartEmpty, EMPTY_TITLE } from "../src/components/empty";
import { ErDiagram } from "../src/components/er-diagram";
import { FlowChart } from "../src/components/flow-chart";
import { FunnelChart } from "../src/components/funnel-chart";
import { GanttChart } from "../src/components/gantt-chart";
import { GaugeChart } from "../src/components/gauge-chart";
import { HorizontalBarChart } from "../src/components/hbar-chart";
import { MatrixHeatmap } from "../src/components/heatmap";
import { Histogram } from "../src/components/histogram";
import { KanbanBoard } from "../src/components/kanban-board";
import { ChartLegend } from "../src/components/legend";
import { LineChart } from "../src/components/line-chart";
import { LollipopChart } from "../src/components/lollipop-chart";
import { MindmapDiagram } from "../src/components/mindmap-diagram";
import { NetworkGraph } from "../src/components/network-graph";
import { NetworkTopology } from "../src/components/network-topology";
import { OrgChart } from "../src/components/org-chart";
import { ParetoChart } from "../src/components/pareto-chart";
import { ProgressList } from "../src/components/progress-list";
import { PyramidChart } from "../src/components/pyramid-chart";
import { QuadrantChart } from "../src/components/quadrant-chart";
import { RadarChart } from "../src/components/radar-chart";
import { RadialProgress } from "../src/components/radial-progress";
import { SankeyDiagram } from "../src/components/sankey-diagram";
import { ScatterPlot } from "../src/components/scatter-plot";
import { SequenceDiagram } from "../src/components/sequence-diagram";
import { Sparkline } from "../src/components/sparkline";
import { StackedBar } from "../src/components/stacked-bar";
import { StateDiagram } from "../src/components/state-diagram";
import { Streamgraph } from "../src/components/streamgraph";
import { SunburstChart } from "../src/components/sunburst-chart";
import { TimelineChart } from "../src/components/timeline-chart";
import { ChartTooltipPortal } from "../src/components/tooltip-portal";
import { TreeView } from "../src/components/tree-view";
import { TreemapChart } from "../src/components/treemap-chart";
import { UseCaseDiagram } from "../src/components/usecase-diagram";
import type { VennSet } from "../src/components/venn-diagram";
import { VennDiagram } from "../src/components/venn-diagram";
import { VerticalStackedBar } from "../src/components/vstacked-bar";
import { WaffleChart } from "../src/components/waffle-chart";
import { WardleyMap } from "../src/components/wardley-map";
import { WaterfallChart } from "../src/components/waterfall-chart";

/** Invariantes comunes de todo smoke con datos válidos. */
function expectSmoke(html: string, label: string, role = 'role="img"') {
  expect(html).toContain(role);
  expect(html).toContain(`aria-label="${label}"`);
  expect(html).not.toContain("NaN");
  expect(html.includes("data-chart-tip") || html.includes("<title>")).toBe(
    true,
  );
}

/** Invariante de caso vacío: estado homogéneo con EMPTY_TITLE. */
function expectEmpty(html: string) {
  expect(html).toContain('role="status"');
  expect(html).toContain(EMPTY_TITLE);
  expect(html).not.toContain("<svg");
}

const cat2 = [
  { month: "Ene", desktop: 186, mobile: 80 },
  { month: "Feb", desktop: 305, mobile: 200 },
];
const series2 = [
  { key: "desktop", label: "Desktop" },
  { key: "mobile", label: "Mobile" },
];

describe("smoke SSR todos los componentes", () => {
  test("ArcDiagram", () => {
    const html = renderToStaticMarkup(
      <ArcDiagram
        ariaLabel="arcos"
        nodes={[
          { id: "a", label: "A" },
          { id: "b", label: "B" },
        ]}
        links={[{ from: "a", to: "b" }]}
      />,
    );
    expectSmoke(html, "arcos");
  });

  test("ArchitectureDiagram", () => {
    const html = renderToStaticMarkup(
      <ArchitectureDiagram
        ariaLabel="arq"
        nodes={[
          { id: "web", label: "Web", kind: "service" },
          { id: "db", label: "DB", kind: "database" },
        ]}
        edges={[{ from: "web", to: "db", label: "lee" }]}
      />,
    );
    expectSmoke(html, "arq");
  });

  test("AreaChart", () => {
    const html = renderToStaticMarkup(
      <AreaChart ariaLabel="areas" data={cat2} xKey="month" series={series2} />,
    );
    expectSmoke(html, "areas");
  });

  test("BarChart", () => {
    const html = renderToStaticMarkup(
      <BarChart ariaLabel="barras" data={cat2} xKey="month" series={series2} />,
    );
    expectSmoke(html, "barras");
    expect(html).toContain("data-chart-tip");
  });

  test("BoxPlot", () => {
    const html = renderToStaticMarkup(
      <BoxPlot
        ariaLabel="cajas"
        groups={[
          { label: "G1", values: [1, 2, 3, 4, 5, 6, 7, 8] },
          { label: "G2", values: [2, 3, 4, 5, 6, 7, 8, 9] },
        ]}
      />,
    );
    expectSmoke(html, "cajas");
  });

  test("BulletChart", () => {
    const html = renderToStaticMarkup(
      <BulletChart
        ariaLabel="balas"
        rows={[
          { label: "A", value: 72, target: 90, ranges: [40, 70, 100] },
          { label: "B", value: 50, target: 60, ranges: [40, 70, 100] },
        ]}
      />,
    );
    expectSmoke(html, "balas");
    expect(html).toContain("72 / 90");
  });

  test("CalendarHeatmap", () => {
    const html = renderToStaticMarkup(
      <CalendarHeatmap
        ariaLabel="cal"
        values={{ "2026-10-05": 4, "2026-10-08": 7 }}
        end="2026-10-11"
        weeks={2}
      />,
    );
    expectSmoke(html, "cal");
  });

  test("ClassDiagram", () => {
    const html = renderToStaticMarkup(
      <ClassDiagram
        ariaLabel="clases"
        nodes={[
          { id: "a", name: "A", attributes: ["x: number"], methods: ["run()"] },
          { id: "b", name: "B" },
        ]}
        edges={[{ from: "b", to: "a", kind: "inheritance" }]}
      />,
    );
    expectSmoke(html, "clases");
  });

  test("DivergingBar", () => {
    const html = renderToStaticMarkup(
      <DivergingBar
        ariaLabel="div"
        data={[
          { g: "Q1", no: 20, yes: 60 },
          { g: "Q2", no: 30, yes: 50 },
        ]}
        yKey="g"
        left={{ key: "no", label: "No" }}
        right={{ key: "yes", label: "Sí" }}
      />,
    );
    expectSmoke(html, "div");
  });

  test("DonutChart", () => {
    const html = renderToStaticMarkup(
      <DonutChart
        ariaLabel="dona"
        data={[
          { label: "A", value: 30 },
          { label: "B", value: 70 },
        ]}
      />,
    );
    expectSmoke(html, "dona");
    expect(html).toContain("100");
  });

  test("PieChart", () => {
    const html = renderToStaticMarkup(
      <PieChart
        ariaLabel="torta"
        data={[
          { label: "A", value: 30 },
          { label: "B", value: 70 },
        ]}
      />,
    );
    expectSmoke(html, "torta");
  });

  test("ChartEmpty", () => {
    const html = renderToStaticMarkup(<ChartEmpty />);
    expect(html).toContain('role="status"');
    expect(html).toContain(EMPTY_TITLE);
  });

  test("ErDiagram", () => {
    const html = renderToStaticMarkup(
      <ErDiagram
        ariaLabel="er"
        entities={[
          {
            id: "u",
            name: "User",
            attributes: [{ name: "id", key: "PK" }, { name: "name" }],
          },
          {
            id: "p",
            name: "Post",
            attributes: [
              { name: "id", key: "PK" },
              { name: "userId", key: "FK" },
            ],
          },
        ]}
        relations={[{ from: "u", to: "p", label: "1:N" }]}
      />,
    );
    expectSmoke(html, "er");
    expect(html).toContain("1:N");
  });

  test("FlowChart", () => {
    const html = renderToStaticMarkup(
      <FlowChart
        ariaLabel="flujo"
        nodes={[
          { id: "ini", label: "Inicio", kind: "start" },
          { id: "rev", label: "¿OK?", kind: "decision" },
          { id: "fin", label: "Fin", kind: "end" },
        ]}
        edges={[
          { from: "ini", to: "rev" },
          { from: "rev", to: "fin", label: "sí" },
        ]}
      />,
    );
    expectSmoke(html, "flujo");
  });

  test("FunnelChart", () => {
    const html = renderToStaticMarkup(
      <FunnelChart
        ariaLabel="embudo"
        stages={[
          { label: "Visitas", value: 1000 },
          { label: "Registro", value: 400 },
          { label: "Pago", value: 120 },
        ]}
      />,
    );
    expectSmoke(html, "embudo");
  });

  test("GanttChart", () => {
    const html = renderToStaticMarkup(
      <GanttChart
        ariaLabel="gantt"
        tasks={[
          { label: "A", start: "2026-09-01", end: "2026-09-10", progress: 50 },
          { label: "B", start: "2026-09-05", end: "2026-09-20" },
        ]}
      />,
    );
    expectSmoke(html, "gantt");
  });

  test("GaugeChart", () => {
    const html = renderToStaticMarkup(
      <GaugeChart ariaLabel="vel" value={72} label="Cobertura" />,
    );
    expectSmoke(html, "vel");
  });

  test("HorizontalBarChart", () => {
    const html = renderToStaticMarkup(
      <HorizontalBarChart
        ariaLabel="hbars"
        data={[
          { y: "A", v: 10 },
          { y: "B", v: 20 },
        ]}
        yKey="y"
        series={[{ key: "v", label: "V" }]}
      />,
    );
    expectSmoke(html, "hbars");
  });

  test("MatrixHeatmap", () => {
    const html = renderToStaticMarkup(
      <MatrixHeatmap
        ariaLabel="matriz"
        rows={["F1", "F2"]}
        cols={["C1", "C2"]}
        values={[
          [1, 2],
          [3, 4],
        ]}
      />,
    );
    expectSmoke(html, "matriz");
  });

  test("Histogram", () => {
    const html = renderToStaticMarkup(
      <Histogram ariaLabel="histo" values={[1, 2, 2, 3, 3, 3, 4, 4, 5, 6]} />,
    );
    expectSmoke(html, "histo");
  });

  test("KanbanBoard", () => {
    const html = renderToStaticMarkup(
      <KanbanBoard
        ariaLabel="kanban"
        columns={[
          { title: "Todo", cards: [{ title: "T1", tag: "bug" }] },
          { title: "Done", cards: [{ title: "T2" }] },
        ]}
      />,
    );
    expectSmoke(html, "kanban");
  });

  test("ChartLegend", () => {
    const html = renderToStaticMarkup(
      <ChartLegend
        items={[
          { label: "A", color: "red" },
          { label: "B", color: "blue" },
        ]}
      />,
    );
    expect(html).toContain("A");
    expect(html).toContain("B");
    expect(html).not.toContain("NaN");
  });

  test("LineChart", () => {
    const html = renderToStaticMarkup(
      <LineChart
        ariaLabel="lineas"
        data={cat2}
        xKey="month"
        series={series2}
      />,
    );
    expectSmoke(html, "lineas");
    expect(html).toContain("<path");
  });

  test("LollipopChart", () => {
    const html = renderToStaticMarkup(
      <LollipopChart
        ariaLabel="pals"
        data={[
          { m: "A", v: 10 },
          { m: "B", v: 20 },
        ]}
        xKey="m"
        yKey="v"
      />,
    );
    expectSmoke(html, "pals");
  });

  test("MindmapDiagram", () => {
    const html = renderToStaticMarkup(
      <MindmapDiagram
        ariaLabel="mental"
        root={{
          label: "R",
          children: [
            { label: "A" },
            { label: "B", children: [{ label: "B1" }] },
          ],
        }}
      />,
    );
    expectSmoke(html, "mental");
  });

  test("NetworkGraph", () => {
    const html = renderToStaticMarkup(
      <NetworkGraph
        ariaLabel="red"
        nodes={[{ id: "a" }, { id: "b" }, { id: "c" }]}
        links={[
          { from: "a", to: "b" },
          { from: "b", to: "c" },
        ]}
      />,
    );
    expectSmoke(html, "red");
  });

  test("NetworkTopology", () => {
    const html = renderToStaticMarkup(
      <NetworkTopology
        ariaLabel="topo"
        nodes={[
          { id: "inet", label: "Internet", role: "internet" },
          { id: "fw", label: "FW", role: "firewall" },
          { id: "srv", label: "App", role: "server" },
        ]}
        links={[
          { from: "inet", to: "fw" },
          { from: "fw", to: "srv", status: "down", label: "caído" },
        ]}
      />,
    );
    expectSmoke(html, "topo");
  });

  test("OrgChart", () => {
    const html = renderToStaticMarkup(
      <OrgChart
        ariaLabel="org"
        root={{
          name: "CEO",
          role: "Dir",
          children: [{ name: "CTO" }, { name: "CFO" }],
        }}
      />,
    );
    expectSmoke(html, "org");
  });

  test("ParetoChart", () => {
    const html = renderToStaticMarkup(
      <ParetoChart
        ariaLabel="pareto"
        data={[
          { causa: "A", n: 30 },
          { causa: "B", n: 70 },
        ]}
        xKey="causa"
        yKey="n"
      />,
    );
    expectSmoke(html, "pareto");
  });

  test("ProgressList", () => {
    const html = renderToStaticMarkup(
      <ProgressList
        ariaLabel="avances"
        rows={[
          { label: "A", value: 30, total: 100 },
          { label: "B", value: 75, total: 100 },
        ]}
      />,
    );
    expectSmoke(html, "avances");
  });

  test("PyramidChart", () => {
    const html = renderToStaticMarkup(
      <PyramidChart
        ariaLabel="pira"
        groups={["18-30", "31-45"]}
        left={{ label: "H", values: [30, 40] }}
        right={{ label: "M", values: [35, 45] }}
      />,
    );
    expectSmoke(html, "pira");
  });

  test("QuadrantChart", () => {
    const html = renderToStaticMarkup(
      <QuadrantChart
        ariaLabel="cuad"
        points={[
          { x: 0.2, y: 0.8, label: "A" },
          { x: 0.7, y: 0.3, label: "B" },
        ]}
      />,
    );
    expectSmoke(html, "cuad");
  });

  test("RadarChart", () => {
    const html = renderToStaticMarkup(
      <RadarChart
        ariaLabel="radar"
        axes={["A", "B", "C"]}
        series={[
          { label: "S1", values: [3, 4, 5] },
          { label: "S2", values: [5, 2, 4] },
        ]}
      />,
    );
    expectSmoke(html, "radar");
  });

  test("RadialProgress", () => {
    const html = renderToStaticMarkup(
      <RadialProgress ariaLabel="anillo" value={65} />,
    );
    expectSmoke(html, "anillo");
  });

  test("SankeyDiagram", () => {
    const html = renderToStaticMarkup(
      <SankeyDiagram
        ariaLabel="sankey"
        nodes={[
          { id: "a", label: "A" },
          { id: "b", label: "B" },
          { id: "c", label: "C" },
        ]}
        flows={[
          { from: "a", to: "b", value: 10 },
          { from: "b", to: "c", value: 5 },
        ]}
      />,
    );
    expectSmoke(html, "sankey");
  });

  test("ScatterPlot", () => {
    const html = renderToStaticMarkup(
      <ScatterPlot
        ariaLabel="disp"
        points={[
          { x: 1, y: 2, label: "a" },
          { x: 3, y: 1 },
          { x: 2, y: 4, label: "c" },
        ]}
      />,
    );
    expectSmoke(html, "disp");
  });

  test("SequenceDiagram", () => {
    const html = renderToStaticMarkup(
      <SequenceDiagram
        ariaLabel="sec"
        participants={["A", "B"]}
        messages={[
          { from: "A", to: "B", label: "hola" },
          { from: "B", to: "A", label: "ok", kind: "return" },
        ]}
      />,
    );
    expectSmoke(html, "sec");
  });

  test("Sparkline", () => {
    const html = renderToStaticMarkup(
      <Sparkline ariaLabel="mini" values={[3, 5, 2, 8, 6, 4]} />,
    );
    expectSmoke(html, "mini");
  });

  test("StackedBar", () => {
    const html = renderToStaticMarkup(
      <StackedBar
        ariaLabel="apiladas"
        rows={[
          { label: "A", values: { x: 3, y: 1 } },
          { label: "B", values: { x: 2, y: 2 } },
        ]}
        segments={[
          { key: "x", label: "X" },
          { key: "y", label: "Y" },
        ]}
      />,
    );
    expectSmoke(html, "apiladas");
  });

  test("StateDiagram", () => {
    const html = renderToStaticMarkup(
      <StateDiagram
        ariaLabel="estados"
        nodes={[
          { id: "a", label: "Listo", kind: "initial" },
          { id: "b", label: "Activo", kind: "state" },
          { id: "c", label: "Fin", kind: "final" },
        ]}
        edges={[
          { from: "a", to: "b", label: "iniciar" },
          { from: "b", to: "c", label: "cerrar" },
        ]}
      />,
    );
    expectSmoke(html, "estados");
  });

  test("Streamgraph", () => {
    const html = renderToStaticMarkup(
      <Streamgraph
        ariaLabel="rios"
        data={[
          { x: "Ene", a: 10, b: 20 },
          { x: "Feb", a: 15, b: 25 },
          { x: "Mar", a: 8, b: 30 },
        ]}
        xKey="x"
        series={[
          { key: "a", label: "A" },
          { key: "b", label: "B" },
        ]}
      />,
    );
    expectSmoke(html, "rios");
  });

  test("SunburstChart", () => {
    const html = renderToStaticMarkup(
      <SunburstChart
        ariaLabel="sol"
        data={[
          {
            label: "A",
            children: [
              { label: "A1", value: 30 },
              { label: "A2", value: 70 },
            ],
          },
          { label: "B", value: 20 },
        ]}
      />,
    );
    expectSmoke(html, "sol");
  });

  test("TimelineChart", () => {
    const html = renderToStaticMarkup(
      <TimelineChart
        ariaLabel="hitos"
        events={[
          { date: "2026-01-01", label: "Inicio" },
          { date: "2026-06-01", label: "Lanzamiento", done: true },
        ]}
      />,
    );
    expectSmoke(html, "hitos");
  });

  test("ChartTooltipPortal SSR pinta hijos sin portal", () => {
    const html = renderToStaticMarkup(
      <ChartTooltipPortal>
        <span>hola</span>
      </ChartTooltipPortal>,
    );
    expect(html).toContain("hola");
    expect(html).toContain("relative");
    expect(html).not.toContain('role="tooltip"');
  });

  test("TreeView", () => {
    const html = renderToStaticMarkup(
      <TreeView
        ariaLabel="arbol"
        items={[
          { label: "R", children: [{ label: "H1" }, { label: "H2" }] },
          { label: "S" },
        ]}
      />,
    );
    expectSmoke(html, "arbol", 'role="tree"');
  });

  test("TreemapChart", () => {
    const html = renderToStaticMarkup(
      <TreemapChart
        ariaLabel="mapa"
        data={[
          { label: "A", value: 30 },
          {
            label: "B",
            children: [
              { label: "B1", value: 20 },
              { label: "B2", value: 50 },
            ],
          },
        ]}
      />,
    );
    expectSmoke(html, "mapa");
  });

  test("UseCaseDiagram", () => {
    const html = renderToStaticMarkup(
      <UseCaseDiagram
        ariaLabel="casos"
        actors={[{ id: "u", label: "Usuario" }]}
        usecases={[
          { id: "c1", label: "Entrar" },
          { id: "c2", label: "Salir" },
        ]}
        edges={[
          { from: "u", to: "c1" },
          { from: "c1", to: "c2", kind: "include" },
        ]}
      />,
    );
    expectSmoke(html, "casos");
  });

  test("VennDiagram", () => {
    const html = renderToStaticMarkup(
      <VennDiagram
        ariaLabel="venn"
        sets={[
          { label: "A", value: 10 },
          { label: "B", value: 20 },
        ]}
        intersections={[{ sets: [0, 1], value: 5 }]}
      />,
    );
    expectSmoke(html, "venn");
  });

  test("VerticalStackedBar", () => {
    const html = renderToStaticMarkup(
      <VerticalStackedBar
        ariaLabel="vapiladas"
        data={[
          { m: "Ene", a: 10, b: 20 },
          { m: "Feb", a: 15, b: 5 },
        ]}
        xKey="m"
        series={[
          { key: "a", label: "A" },
          { key: "b", label: "B" },
        ]}
      />,
    );
    expectSmoke(html, "vapiladas");
  });

  test("WaffleChart", () => {
    const html = renderToStaticMarkup(
      <WaffleChart
        ariaLabel="waffle"
        parts={[
          { label: "A", value: 60 },
          { label: "B", value: 40 },
        ]}
      />,
    );
    expectSmoke(html, "waffle");
  });

  test("WardleyMap", () => {
    const html = renderToStaticMarkup(
      <WardleyMap
        ariaLabel="wardley"
        nodes={[
          { id: "a", label: "A", x: 0.2, y: 0.8 },
          { id: "b", label: "B", x: 0.7, y: 0.3 },
        ]}
        links={[{ from: "a", to: "b" }]}
      />,
    );
    expectSmoke(html, "wardley");
  });

  test("WaterfallChart", () => {
    const html = renderToStaticMarkup(
      <WaterfallChart
        ariaLabel="caja"
        steps={[
          { label: "Inicio", value: 100 },
          { label: "Gasto", value: -30 },
        ]}
      />,
    );
    expectSmoke(html, "caja");
  });
});

describe("casos vacíos pintan EMPTY_TITLE", () => {
  test("ArcDiagram vacío", () => {
    expectEmpty(
      renderToStaticMarkup(<ArcDiagram ariaLabel="x" nodes={[]} links={[]} />),
    );
  });
  test("ArchitectureDiagram vacío", () => {
    expectEmpty(
      renderToStaticMarkup(
        <ArchitectureDiagram ariaLabel="x" nodes={[]} edges={[]} />,
      ),
    );
  });
  test("AreaChart vacía", () => {
    expectEmpty(
      renderToStaticMarkup(
        <AreaChart ariaLabel="x" data={[]} xKey="m" series={series2} />,
      ),
    );
  });
  test("BarChart vacía", () => {
    expectEmpty(
      renderToStaticMarkup(
        <BarChart ariaLabel="x" data={[]} xKey="m" series={series2} />,
      ),
    );
  });
  test("BoxPlot vacío", () => {
    expectEmpty(renderToStaticMarkup(<BoxPlot ariaLabel="x" groups={[]} />));
  });
  test("BulletChart vacío", () => {
    expectEmpty(renderToStaticMarkup(<BulletChart ariaLabel="x" rows={[]} />));
  });
  test("CalendarHeatmap vacío", () => {
    expectEmpty(
      renderToStaticMarkup(<CalendarHeatmap ariaLabel="x" values={{}} />),
    );
  });
  test("ClassDiagram vacío", () => {
    expectEmpty(
      renderToStaticMarkup(
        <ClassDiagram ariaLabel="x" nodes={[]} edges={[]} />,
      ),
    );
  });
  test("DivergingBar vacía", () => {
    expectEmpty(
      renderToStaticMarkup(
        <DivergingBar
          ariaLabel="x"
          data={[]}
          yKey="g"
          left={{ key: "no", label: "No" }}
          right={{ key: "yes", label: "Sí" }}
        />,
      ),
    );
  });
  test("DonutChart vacío", () => {
    expectEmpty(renderToStaticMarkup(<DonutChart ariaLabel="x" data={[]} />));
  });
  test("PieChart vacío", () => {
    expectEmpty(renderToStaticMarkup(<PieChart ariaLabel="x" data={[]} />));
  });
  test("ErDiagram vacío", () => {
    expectEmpty(
      renderToStaticMarkup(
        <ErDiagram ariaLabel="x" entities={[]} relations={[]} />,
      ),
    );
  });
  test("FlowChart vacío", () => {
    expectEmpty(
      renderToStaticMarkup(<FlowChart ariaLabel="x" nodes={[]} edges={[]} />),
    );
  });
  test("FunnelChart vacío", () => {
    expectEmpty(
      renderToStaticMarkup(<FunnelChart ariaLabel="x" stages={[]} />),
    );
  });
  test("GanttChart vacío", () => {
    expectEmpty(renderToStaticMarkup(<GanttChart ariaLabel="x" tasks={[]} />));
  });
  test("GaugeChart NaN pinta vacío", () => {
    expectEmpty(
      renderToStaticMarkup(<GaugeChart ariaLabel="x" value={Number.NaN} />),
    );
  });
  test("HorizontalBarChart vacía", () => {
    expectEmpty(
      renderToStaticMarkup(
        <HorizontalBarChart
          ariaLabel="x"
          data={[]}
          yKey="y"
          series={[{ key: "v", label: "V" }]}
        />,
      ),
    );
  });
  test("MatrixHeatmap vacío", () => {
    expectEmpty(
      renderToStaticMarkup(
        <MatrixHeatmap ariaLabel="x" rows={[]} cols={[]} values={[]} />,
      ),
    );
  });
  test("Histogram vacío", () => {
    expectEmpty(renderToStaticMarkup(<Histogram ariaLabel="x" values={[]} />));
  });
  test("KanbanBoard vacío", () => {
    expectEmpty(
      renderToStaticMarkup(<KanbanBoard ariaLabel="x" columns={[]} />),
    );
  });
  test("ChartLegend vacía retorna null", () => {
    expect(renderToStaticMarkup(<ChartLegend items={[]} />)).toBe("");
  });
  test("LineChart vacía", () => {
    expectEmpty(
      renderToStaticMarkup(
        <LineChart ariaLabel="x" data={[]} xKey="m" series={series2} />,
      ),
    );
  });
  test("LollipopChart vacío", () => {
    expectEmpty(
      renderToStaticMarkup(
        <LollipopChart ariaLabel="x" data={[]} xKey="m" yKey="v" />,
      ),
    );
  });
  test("MindmapDiagram vacío", () => {
    expectEmpty(
      renderToStaticMarkup(
        <MindmapDiagram ariaLabel="x" root={{ label: "" }} />,
      ),
    );
  });
  test("NetworkGraph vacío", () => {
    expectEmpty(
      renderToStaticMarkup(
        <NetworkGraph ariaLabel="x" nodes={[]} links={[]} />,
      ),
    );
  });
  test("NetworkTopology vacía", () => {
    expectEmpty(
      renderToStaticMarkup(
        <NetworkTopology ariaLabel="x" nodes={[]} links={[]} />,
      ),
    );
  });
  test("OrgChart vacío", () => {
    expectEmpty(
      renderToStaticMarkup(<OrgChart ariaLabel="x" root={{ name: "" }} />),
    );
  });
  test("ParetoChart vacío", () => {
    expectEmpty(
      renderToStaticMarkup(
        <ParetoChart ariaLabel="x" data={[]} xKey="c" yKey="n" />,
      ),
    );
  });
  test("ProgressList vacía", () => {
    expectEmpty(renderToStaticMarkup(<ProgressList ariaLabel="x" rows={[]} />));
  });
  test("PyramidChart vacío", () => {
    expectEmpty(
      renderToStaticMarkup(
        <PyramidChart
          ariaLabel="x"
          groups={[]}
          left={{ label: "L", values: [] }}
          right={{ label: "R", values: [] }}
        />,
      ),
    );
  });
  test("QuadrantChart vacío", () => {
    expectEmpty(
      renderToStaticMarkup(<QuadrantChart ariaLabel="x" points={[]} />),
    );
  });
  test("RadarChart vacío", () => {
    expectEmpty(
      renderToStaticMarkup(<RadarChart ariaLabel="x" axes={[]} series={[]} />),
    );
  });
  test("RadialProgress NaN pinta vacío", () => {
    expectEmpty(
      renderToStaticMarkup(<RadialProgress ariaLabel="x" value={Number.NaN} />),
    );
  });
  test("SankeyDiagram vacío", () => {
    expectEmpty(
      renderToStaticMarkup(
        <SankeyDiagram ariaLabel="x" nodes={[]} flows={[]} />,
      ),
    );
  });
  test("ScatterPlot vacío", () => {
    expectEmpty(
      renderToStaticMarkup(<ScatterPlot ariaLabel="x" points={[]} />),
    );
  });
  test("SequenceDiagram vacío", () => {
    expectEmpty(
      renderToStaticMarkup(
        <SequenceDiagram ariaLabel="x" participants={[]} messages={[]} />,
      ),
    );
  });
  test("Sparkline vacía", () => {
    expectEmpty(renderToStaticMarkup(<Sparkline ariaLabel="x" values={[]} />));
  });
  test("StackedBar vacía", () => {
    expectEmpty(
      renderToStaticMarkup(
        <StackedBar
          ariaLabel="x"
          rows={[]}
          segments={[{ key: "x", label: "X" }]}
        />,
      ),
    );
  });
  test("StateDiagram vacío", () => {
    expectEmpty(
      renderToStaticMarkup(
        <StateDiagram ariaLabel="x" nodes={[]} edges={[]} />,
      ),
    );
  });
  test("Streamgraph vacío", () => {
    expectEmpty(
      renderToStaticMarkup(
        <Streamgraph ariaLabel="x" data={[]} xKey="m" series={series2} />,
      ),
    );
  });
  test("SunburstChart vacío", () => {
    expectEmpty(
      renderToStaticMarkup(<SunburstChart ariaLabel="x" data={[]} />),
    );
  });
  test("TimelineChart vacía", () => {
    expectEmpty(
      renderToStaticMarkup(<TimelineChart ariaLabel="x" events={[]} />),
    );
  });
  test("TreeView vacío", () => {
    expectEmpty(renderToStaticMarkup(<TreeView ariaLabel="x" items={[]} />));
  });
  test("TreemapChart vacío", () => {
    expectEmpty(renderToStaticMarkup(<TreemapChart ariaLabel="x" data={[]} />));
  });
  test("UseCaseDiagram vacío", () => {
    expectEmpty(
      renderToStaticMarkup(
        <UseCaseDiagram ariaLabel="x" actors={[]} usecases={[]} edges={[]} />,
      ),
    );
  });
  test("VennDiagram vacío", () => {
    expectEmpty(
      renderToStaticMarkup(
        <VennDiagram
          ariaLabel="x"
          sets={[] as unknown as [VennSet, VennSet]}
        />,
      ),
    );
  });
  test("VerticalStackedBar vacía", () => {
    expectEmpty(
      renderToStaticMarkup(
        <VerticalStackedBar
          ariaLabel="x"
          data={[]}
          xKey="m"
          series={series2}
        />,
      ),
    );
  });
  test("WaffleChart vacío", () => {
    expectEmpty(renderToStaticMarkup(<WaffleChart ariaLabel="x" parts={[]} />));
  });
  test("WardleyMap vacío", () => {
    expectEmpty(
      renderToStaticMarkup(<WardleyMap ariaLabel="x" nodes={[]} links={[]} />),
    );
  });
  test("WaterfallChart vacío", () => {
    expectEmpty(
      renderToStaticMarkup(<WaterfallChart ariaLabel="x" steps={[]} />),
    );
  });
});
