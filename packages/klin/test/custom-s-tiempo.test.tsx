/**
 * klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE).
 */
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, test } from "vitest";
import { CalendarHeatmap } from "../src/components/calendar-heatmap";
import { ChartEmpty } from "../src/components/empty";
import { FunnelChart } from "../src/components/funnel-chart";
import { GanttChart } from "../src/components/gantt-chart";
import { KanbanBoard } from "../src/components/kanban-board";
import { ChartLegend } from "../src/components/legend";
import { MatrixHeatmap } from "../src/components/matrix-heatmap";
import { TableChart } from "../src/components/table-chart";
import { TimelineChart } from "../src/components/timeline-chart";
import { ChartTooltipPortal } from "../src/components/tooltip-portal";

function count(html: string, tag: string): number {
  return html.match(new RegExp(tag, "g"))?.length ?? 0;
}

describe("paridad S calor, tiempo y utilidades", () => {
  test("CalendarHeatmap: ventana y etiquetas", () => {
    const values = { "2026-03-02": 4, "2026-03-05": 9, "2026-03-11": 6 };
    const base = renderToStaticMarkup(
      <CalendarHeatmap
        ariaLabel="cal"
        end="2026-03-31"
        weeks={5}
        values={values}
      />,
    );
    expect(
      renderToStaticMarkup(
        <CalendarHeatmap
          ariaLabel="cal"
          end="2026-03-31"
          weeks={5}
          values={values}
          start="2026-03-01"
        />,
      ),
    ).not.toBe(base);
    const noMonths = renderToStaticMarkup(
      <CalendarHeatmap
        ariaLabel="cal"
        end="2026-03-31"
        weeks={5}
        values={values}
        showMonthLabels={false}
      />,
    );
    expect(count(noMonths, "<text")).toBeLessThan(count(base, "<text"));
    const noDays = renderToStaticMarkup(
      <CalendarHeatmap
        ariaLabel="cal"
        end="2026-03-31"
        weeks={5}
        values={values}
        showWeekdayLabels={false}
      />,
    );
    expect(count(noDays, "<text")).toBeLessThan(count(base, "<text"));
  });

  test("MatrixHeatmap: valores y faltantes", () => {
    const props = {
      ariaLabel: "matriz",
      rows: ["A", "B"],
      cols: ["X", "Y"],
      values: [
        [1, 2],
        [3, 4],
      ],
    };
    const base = renderToStaticMarkup(<MatrixHeatmap {...props} />);
    const always = renderToStaticMarkup(
      <MatrixHeatmap {...props} showValues="always" />,
    );
    expect(count(always, "<text")).toBeGreaterThanOrEqual(count(base, "<text"));
    expect(
      renderToStaticMarkup(<MatrixHeatmap {...props} showValues="never" />),
    ).not.toBe(base);
    const missing = renderToStaticMarkup(
      <MatrixHeatmap
        ariaLabel="matriz"
        rows={["A"]}
        cols={["X"]}
        values={[[Number.NaN]]}
        missingLabel="s/d"
      />,
    );
    expect(missing).toContain("s/d");
  });

  test("GanttChart: progreso, hoy y medidas", () => {
    const tasks = [
      {
        label: "Diseño",
        start: "2026-02-01",
        end: "2026-02-08",
        progress: 100,
      },
      { label: "Dev", start: "2026-02-09", end: "2026-02-18", progress: 60 },
    ];
    const base = renderToStaticMarkup(
      <GanttChart ariaLabel="gantt" tasks={tasks} />,
    );
    expect(
      renderToStaticMarkup(
        <GanttChart ariaLabel="gantt" tasks={tasks} showProgress={false} />,
      ),
    ).not.toBe(base);
    expect(
      renderToStaticMarkup(
        <GanttChart ariaLabel="gantt" tasks={tasks} today="2026-02-10" />,
      ),
    ).not.toBe(base);
    expect(
      renderToStaticMarkup(
        <GanttChart
          ariaLabel="gantt"
          tasks={tasks}
          rowHeight={40}
          labelWidth={200}
        />,
      ),
    ).not.toBe(base);
  });

  test("TimelineChart: lado, fechas y densidad", () => {
    const events = [
      { date: "ene", label: "Uno" },
      { date: "feb", label: "Dos" },
      { date: "mar", label: "Tres" },
    ];
    const base = renderToStaticMarkup(
      <TimelineChart ariaLabel="linea-tiempo" events={events} />,
    );
    expect(
      renderToStaticMarkup(
        <TimelineChart ariaLabel="linea-tiempo" events={events} side="left" />,
      ),
    ).not.toBe(base);
    expect(
      renderToStaticMarkup(
        <TimelineChart
          ariaLabel="linea-tiempo"
          events={events}
          showDates={false}
        />,
      ),
    ).not.toBe(base);
    const noDates = renderToStaticMarkup(
      <TimelineChart
        ariaLabel="linea-tiempo"
        events={events}
        showDates={false}
      />,
    );
    expect(count(noDates, "<text")).toBeLessThan(count(base, "<text"));
    expect(
      renderToStaticMarkup(
        <TimelineChart
          ariaLabel="linea-tiempo"
          events={events}
          density="compact"
        />,
      ),
    ).not.toBe(base);
  });

  test("FunnelChart: caídas y base", () => {
    const stages = [
      { label: "A", value: 100 },
      { label: "B", value: 60 },
      { label: "C", value: 30 },
    ];
    const base = renderToStaticMarkup(
      <FunnelChart ariaLabel="embudo" stages={stages} />,
    );
    expect(
      renderToStaticMarkup(
        <FunnelChart ariaLabel="embudo" stages={stages} showDropOff={false} />,
      ),
    ).not.toBe(base);
    expect(
      renderToStaticMarkup(
        <FunnelChart ariaLabel="embudo" stages={stages} baseline="previous" />,
      ),
    ).not.toBe(base);
  });

  test("KanbanBoard: campos, WIP, colapso y densidad", () => {
    const columns = [
      {
        title: "Todo",
        cards: [
          { title: "A", tag: "Docs", assignee: "Ana", due: "2026-01-01" },
        ],
      },
      { title: "Hecho", limit: 1, cards: [{ title: "B" }, { title: "C" }] },
    ];
    const base = renderToStaticMarkup(
      <KanbanBoard ariaLabel="kanban" columns={columns} />,
    );
    expect(
      renderToStaticMarkup(
        <KanbanBoard
          ariaLabel="kanban"
          columns={columns}
          cardFields={["assignee", "due"]}
        />,
      ),
    ).toContain("Ana");
    expect(
      renderToStaticMarkup(
        <KanbanBoard ariaLabel="kanban" columns={columns} wipWarn={false} />,
      ),
    ).not.toBe(base);
    const collapsed = renderToStaticMarkup(
      <KanbanBoard
        ariaLabel="kanban"
        columns={columns}
        collapsedColumns={["Todo"]}
      />,
    );
    expect(collapsed).not.toContain("Redactar");
    expect(collapsed).not.toBe(base);
    expect(
      renderToStaticMarkup(
        <KanbanBoard ariaLabel="kanban" columns={columns} density="compact" />,
      ),
    ).not.toBe(base);
  });

  test("ChartLegend: layout, align, shape y tope", () => {
    const items = [
      { label: "A", color: "var(--chart-1)" },
      { label: "B", color: "var(--chart-2)" },
      { label: "C", color: "var(--chart-3)" },
    ];
    const base = renderToStaticMarkup(<ChartLegend items={items} />);
    expect(
      renderToStaticMarkup(<ChartLegend items={items} layout="column" />),
    ).not.toBe(base);
    expect(
      renderToStaticMarkup(<ChartLegend items={items} align="start" />),
    ).not.toBe(base);
    expect(
      renderToStaticMarkup(<ChartLegend items={items} shape="dot" />),
    ).not.toBe(base);
    const capped = renderToStaticMarkup(
      <ChartLegend items={items} maxItems={2} />,
    );
    expect(capped).toContain("+1");
    expect(capped).not.toContain(">C<");
  });

  test("ChartEmpty: tamaño e icono", () => {
    const base = renderToStaticMarkup(<ChartEmpty title="Nada" />);
    expect(
      renderToStaticMarkup(<ChartEmpty title="Nada" size="sm" />),
    ).not.toBe(base);
    expect(
      renderToStaticMarkup(<ChartEmpty title="Nada" icon={<span>!</span>} />),
    ).toContain("<span>!</span>");
  });

  test("ChartTooltipPortal: retardo y ancho", () => {
    const base = renderToStaticMarkup(
      <ChartTooltipPortal>
        <span>hola</span>
      </ChartTooltipPortal>,
    );
    expect(base).toContain("hola");
    expect(
      renderToStaticMarkup(
        <ChartTooltipPortal delay={200} maxWidth={320}>
          <span>hola</span>
        </ChartTooltipPortal>,
      ),
    ).not.toBe(base);
  });

  test("TableChart: altura, %, estado, densidad y tope", () => {
    const props = {
      ariaLabel: "tabla",
      columns: [
        { key: "v", label: "Valor" },
        { key: "w", label: "Otro" },
      ],
      rows: [
        { label: "A", values: { v: 10, w: 4 } },
        { label: "B", values: { v: 20, w: 8 } },
      ],
      bars: [{ key: "v" }, { key: "w" }],
    };
    const base = renderToStaticMarkup(<TableChart {...props} />);
    expect(base).toContain("50%");
    expect(
      renderToStaticMarkup(<TableChart {...props} barHeight="sm" />),
    ).not.toBe(base);
    const noPct = renderToStaticMarkup(
      <TableChart {...props} showPercent={false} />,
    );
    expect(noPct).not.toContain("ml-1");
    expect(
      renderToStaticMarkup(
        <TableChart
          {...props}
          status={(pct: number) => (pct >= 50 ? "ok" : "bad")}
        />,
      ),
    ).not.toBe(base);
    expect(
      renderToStaticMarkup(<TableChart {...props} density="compact" />),
    ).not.toBe(base);
    const capped = renderToStaticMarkup(<TableChart {...props} maxRows={1} />);
    expect(capped).not.toContain(">B<");
    expect(capped).toContain(">A<");
  });
});
