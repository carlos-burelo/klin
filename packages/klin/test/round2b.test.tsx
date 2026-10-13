/**
 * klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE).
 */
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, test } from "vitest";
import { EMPTY_TITLE } from "../src/components/empty";
import {
  computeFishboneLayout,
  FishboneDiagram,
  MAX_FISHBONE_CAUSES,
  MAX_FISHBONE_SUBCAUSES,
} from "../src/components/fishbone-diagram";
import {
  computeTableLayout,
  MAX_TABLE_COLUMNS,
  MAX_TABLE_ROWS,
  TableChart,
} from "../src/components/table-chart";

const causes = [
  {
    label: "Métodos",
    subcauses: ["Falta de estándar", "Pasos extra", "Sin checklist"],
  },
  { label: "Mano de obra", subcauses: ["Rotación", "Capacitación"] },
  { label: "Materiales", subcauses: ["Proveedor único"] },
];

describe("FishboneDiagram SSR (sin JS)", () => {
  test("pinta espina + diagonales por causa con su tip", () => {
    const html = renderToStaticMarkup(
      <FishboneDiagram
        ariaLabel="ishikawa demo"
        effect="Defectos"
        causes={causes}
      />,
    );
    expect(html).toContain('role="img"');
    expect(html).toContain('aria-label="ishikawa demo"');
    // 1 espina + 3 diagonales + 6 ticks.
    expect(html.match(/<line/g)?.length).toBe(10);
    // Un tip por causa + cabeza efecto.
    expect(html.match(/data-chart-tip/g)?.length).toBe(4);
    expect(html).toContain("Métodos: 3 subcausas");
    expect(html).toContain("Materiales: 1 subcausas");
    expect(html).toContain("Defectos");
  });

  test("respeta aria-describedby y usa minWidth en el svg", () => {
    const html = renderToStaticMarkup(
      <FishboneDiagram
        ariaLabel="ishikawa demo"
        ariaDescribedBy="desc-ishikawa"
        effect="Defectos"
        causes={causes}
      />,
    );
    expect(html).toContain('aria-describedby="desc-ishikawa"');
    expect(html).toContain("min-width");
  });

  test("aplica caps: 8 causas y 6 subcausas (muestra 4 + resto)", () => {
    const many = Array.from({ length: 10 }, (_, i) => ({
      label: `Causa ${i}`,
      subcauses: Array.from({ length: 8 }, (_, k) => `Sub ${k}`),
    }));
    const layout = computeFishboneLayout("Efecto", many);
    expect(layout.causes.length).toBe(MAX_FISHBONE_CAUSES);
    expect(layout.causes[0]?.subcauses.length).toBe(MAX_FISHBONE_SUBCAUSES);
    expect(layout.causes[0]?.shown.length).toBe(4);
    expect(layout.causes[0]?.hidden).toBe(2);
    const html = renderToStaticMarkup(
      <FishboneDiagram ariaLabel="caps" effect="Efecto" causes={many} />,
    );
    expect(html.match(/data-chart-tip/g)?.length).toBe(MAX_FISHBONE_CAUSES + 1);
    expect(html).toContain("Causa 0: 6 subcausas");
    expect(html).toContain("+2 más");
    expect(html).not.toContain("Causa 8");
  });

  test("vacío pinta el estado homogéneo", () => {
    const html = renderToStaticMarkup(
      <FishboneDiagram ariaLabel="vacío" effect="Defectos" causes={[]} />,
    );
    expect(html).toContain(EMPTY_TITLE);
    expect(html).not.toContain("<svg");
    const htmlEfecto = renderToStaticMarkup(
      <FishboneDiagram ariaLabel="vacío" effect="  " causes={causes} />,
    );
    expect(htmlEfecto).toContain(EMPTY_TITLE);
    const htmlCustom = renderToStaticMarkup(
      <FishboneDiagram
        ariaLabel="vacío"
        effect="Defectos"
        causes={[]}
        emptyTitle="Nada que analizar"
      />,
    );
    expect(htmlCustom).toContain("Nada que analizar");
  });
});

const columns = [
  { key: "q1", label: "T1" },
  { key: "q2", label: "T2" },
];

const rows = [
  { label: "Norte", values: { q1: 80, q2: 40 } },
  { label: "Sur", values: { q1: 20, q2: 60 } },
];

describe("TableChart SSR (sin JS, sin SVG)", () => {
  test("pinta filas + celdas tabulares + barras con su tip", () => {
    const html = renderToStaticMarkup(
      <TableChart
        ariaLabel="tabla demo"
        columns={columns}
        rows={rows}
        bars={[{ key: "q1" }, { key: "q2", max: 100 }]}
      />,
    );
    expect(html).toContain('role="img"');
    expect(html).toContain('aria-label="tabla demo"');
    expect(html).not.toContain("<svg");
    expect(html).toContain("Norte");
    expect(html).toContain("T1");
    // q1 usa máximo de columna (80): Norte 100%, Sur 25%.
    expect(html).toContain("width:100%");
    expect(html).toContain("width:25%");
    expect(html).toContain("Norte · T1: 80 (100% del máximo)");
    // q2 usa máximo explícito (100): Sur 60%.
    expect(html).toContain("width:60%");
    expect(html.match(/data-chart-tip/g)?.length).toBe(4);
  });

  test("formatea con locale es-MX y sanea no-finitos a 0", () => {
    const html = renderToStaticMarkup(
      <TableChart
        ariaLabel="tabla rara"
        columns={[{ key: "v", label: "Valor" }]}
        rows={[
          { label: "Grande", values: { v: 1234.5 } },
          { label: "Raro", values: { v: Number.NaN } },
          { label: "Sin dato", values: {} },
        ]}
        bars={[{ key: "v" }]}
      />,
    );
    expect(html).toContain("1,234.5");
    expect(html).toContain(">0<");
    expect(html).toContain("width:0%");
  });

  test("cómputo puro aplica caps de filas y columnas", () => {
    const manyRows = Array.from({ length: MAX_TABLE_ROWS + 5 }, (_, i) => ({
      label: `Fila ${i}`,
      values: { v: i },
    }));
    const manyCols = Array.from({ length: MAX_TABLE_COLUMNS + 3 }, (_, i) => ({
      key: `c${i}`,
      label: `C${i}`,
    }));
    const layout = computeTableLayout(manyRows, manyCols, []);
    expect(layout.rows.length).toBe(MAX_TABLE_ROWS);
    expect(layout.columns.length).toBe(MAX_TABLE_COLUMNS);
  });

  test("vacío pinta el estado homogéneo", () => {
    const htmlFilas = renderToStaticMarkup(
      <TableChart ariaLabel="vacío" columns={columns} rows={[]} />,
    );
    expect(htmlFilas).toContain(EMPTY_TITLE);
    expect(htmlFilas).not.toContain("<svg");
    const htmlCols = renderToStaticMarkup(
      <TableChart ariaLabel="vacío" columns={[]} rows={rows} />,
    );
    expect(htmlCols).toContain(EMPTY_TITLE);
  });
});
