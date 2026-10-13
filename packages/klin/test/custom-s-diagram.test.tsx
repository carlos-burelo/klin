/**
 * klin — © 2026 Carlos Burelo — AGPL-3.0-or-later (ver LICENSE).
 *
 * Props simples (S) de CUSTOMIZATION.md: cada diagrama con datos fijos
 * verifica que los defaults explícitos no cambian el output y que cada
 * prop no-default sí lo cambia.
 */
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, test } from "vitest";
import type { ArcDiagramProps } from "../src/components/arc-diagram";
import { ArcDiagram } from "../src/components/arc-diagram";
import type { ArchitectureDiagramProps } from "../src/components/architecture-diagram";
import { ArchitectureDiagram } from "../src/components/architecture-diagram";
import type { ClassDiagramProps } from "../src/components/class-diagram";
import { ClassDiagram } from "../src/components/class-diagram";
import type { ErDiagramProps } from "../src/components/er-diagram";
import { ErDiagram } from "../src/components/er-diagram";
import type { MindmapDiagramProps } from "../src/components/mindmap-diagram";
import { MindmapDiagram } from "../src/components/mindmap-diagram";
import type { NetworkGraphProps } from "../src/components/network-graph";
import { NetworkGraph } from "../src/components/network-graph";
import type { NetworkTopologyProps } from "../src/components/network-topology";
import { NetworkTopology } from "../src/components/network-topology";
import type { OrgChartProps } from "../src/components/org-chart";
import { OrgChart } from "../src/components/org-chart";
import type { SequenceDiagramProps } from "../src/components/sequence-diagram";
import { SequenceDiagram } from "../src/components/sequence-diagram";
import type { StateDiagramProps } from "../src/components/state-diagram";
import { StateDiagram } from "../src/components/state-diagram";
import type { UseCaseDiagramProps } from "../src/components/usecase-diagram";
import { UseCaseDiagram } from "../src/components/usecase-diagram";

/** Ocurrencias de una etiqueta de apertura en el markup. */
function countTags(html: string, tag: string): number {
  return html.match(new RegExp(`<${tag}`, "g"))?.length ?? 0;
}

describe("props simples (S) de diagramas", () => {
  test("ArcDiagram: nodeSize, sortBy, showLabels", () => {
    const props: ArcDiagramProps = {
      ariaLabel: "arcos",
      nodes: [
        { id: "a", label: "Mango" },
        { id: "b", label: "Alfa" },
        { id: "hub", label: "Beta" },
      ],
      edges: [
        { from: "hub", to: "a" },
        { from: "hub", to: "b" },
      ],
    };
    const base = renderToStaticMarkup(<ArcDiagram {...props} />);
    const explicit = renderToStaticMarkup(
      <ArcDiagram
        {...props}
        nodeSize="degree"
        sortBy="degree"
        showLabels="all"
      />,
    );
    expect(explicit).toBe(base);
    expect(countTags(base, "text")).toBe(3);

    const fixed = renderToStaticMarkup(
      <ArcDiagram {...props} nodeSize="auto" />,
    );
    expect(fixed).not.toBe(base);

    const byLabel = renderToStaticMarkup(
      <ArcDiagram {...props} sortBy="label" />,
    );
    expect(byLabel).not.toBe(base);
    const byOrder = renderToStaticMarkup(
      <ArcDiagram {...props} sortBy="order" />,
    );
    expect(byOrder).not.toBe(base);

    const ends = renderToStaticMarkup(
      <ArcDiagram {...props} showLabels="ends" />,
    );
    expect(countTags(ends, "text")).toBe(2);
    const none = renderToStaticMarkup(
      <ArcDiagram {...props} showLabels="none" />,
    );
    expect(countTags(none, "text")).toBe(0);
  });

  test("ArchitectureDiagram: statusColors, showBadges, compact", () => {
    const props: ArchitectureDiagramProps = {
      ariaLabel: "arq",
      nodes: [
        { id: "web", label: "Web", sub: "v2", kind: "service" },
        { id: "db", label: "DB", kind: "database" },
      ],
      edges: [{ from: "web", to: "db", label: "lee" }],
    };
    const base = renderToStaticMarkup(<ArchitectureDiagram {...props} />);
    const explicit = renderToStaticMarkup(
      <ArchitectureDiagram {...props} showBadges compact={false} />,
    );
    expect(explicit).toBe(base);
    expect(base).toContain(">base<");

    const recolor = renderToStaticMarkup(
      <ArchitectureDiagram
        {...props}
        statusColors={{ database: "var(--mi-base)" }}
      />,
    );
    expect(recolor).not.toBe(base);
    expect(recolor).toContain("var(--mi-base)");

    const bare = renderToStaticMarkup(
      <ArchitectureDiagram {...props} showBadges={false} />,
    );
    expect(bare).not.toBe(base);
    expect(bare).not.toContain(">base<");

    const compact = renderToStaticMarkup(
      <ArchitectureDiagram {...props} compact />,
    );
    expect(compact).not.toBe(base);
    const heightOf = (html: string) =>
      Number(html.match(/viewBox="0 0 [\d.]+ ([\d.]+)"/)?.[1] ?? Number.NaN);
    expect(heightOf(compact)).toBeLessThan(heightOf(base));
  });

  test("ClassDiagram: showMethods, showAttributes, visibility, memberLimit", () => {
    const props: ClassDiagramProps = {
      ariaLabel: "clases",
      nodes: [
        {
          id: "c",
          name: "Cuenta",
          attributes: ["+id: number", "-secreto: string", "nombre: string"],
          methods: ["+run(): void", "#ayuda(): void"],
        },
      ],
      edges: [],
    };
    const base = renderToStaticMarkup(<ClassDiagram {...props} />);
    const explicit = renderToStaticMarkup(
      <ClassDiagram
        {...props}
        showMethods
        showAttributes
        visibility="all"
        memberLimit={12}
      />,
    );
    expect(explicit).toBe(base);
    expect(base).toContain("secreto");

    const noMethods = renderToStaticMarkup(
      <ClassDiagram {...props} showMethods={false} />,
    );
    expect(noMethods).not.toBe(base);
    expect(noMethods).not.toContain("run()");

    const noAttrs = renderToStaticMarkup(
      <ClassDiagram {...props} showAttributes={false} />,
    );
    expect(noAttrs).not.toBe(base);
    expect(noAttrs).not.toContain("secreto");

    const pub = renderToStaticMarkup(
      <ClassDiagram {...props} visibility="public" />,
    );
    expect(pub).not.toBe(base);
    expect(pub).toContain("nombre");
    expect(pub).not.toContain("secreto");
    expect(pub).not.toContain("ayuda");

    const capped = renderToStaticMarkup(
      <ClassDiagram {...props} memberLimit={2} />,
    );
    expect(capped).not.toBe(base);
    expect(capped).toContain("+3 más");
    expect(base).not.toContain("más");
  });

  test("ErDiagram: showKeys, crowFoot, showWeak", () => {
    const props: ErDiagramProps = {
      ariaLabel: "er",
      entities: [
        {
          id: "u",
          name: "Usuario",
          weak: true,
          attributes: [{ name: "id", key: "PK" }, { name: "nombre" }],
        },
        {
          id: "p",
          name: "Pedido",
          attributes: [
            { name: "id", key: "PK" },
            { name: "usuarioId", key: "FK" },
          ],
        },
      ],
      relations: [{ from: "u", to: "p", label: "1:N" }],
    };
    const base = renderToStaticMarkup(<ErDiagram {...props} />);
    const explicit = renderToStaticMarkup(
      <ErDiagram {...props} showKeys crowFoot showWeak />,
    );
    expect(explicit).toBe(base);
    expect(base).toContain("PK");

    const noKeys = renderToStaticMarkup(
      <ErDiagram {...props} showKeys={false} />,
    );
    expect(noKeys).not.toBe(base);
    expect(noKeys).not.toContain("PK");

    const noCrow = renderToStaticMarkup(
      <ErDiagram {...props} crowFoot={false} />,
    );
    expect(noCrow).not.toBe(base);
    expect(countTags(base, "line")).toBeGreaterThan(countTags(noCrow, "line"));

    const noWeak = renderToStaticMarkup(
      <ErDiagram {...props} showWeak={false} />,
    );
    expect(noWeak).not.toBe(base);
    expect(countTags(base, "rect")).toBeGreaterThan(countTags(noWeak, "rect"));
  });

  test("StateDiagram: showInitial", () => {
    const props: StateDiagramProps = {
      ariaLabel: "estados",
      nodes: [
        { id: "a", label: "Reposo" },
        { id: "b", label: "Activo" },
      ],
      edges: [{ from: "a", to: "b", label: "iniciar" }],
    };
    const base = renderToStaticMarkup(<StateDiagram {...props} />);
    const explicit = renderToStaticMarkup(
      <StateDiagram {...props} showInitial />,
    );
    expect(explicit).toBe(base);
    expect(base).toContain("<title>Inicial</title>");

    const bare = renderToStaticMarkup(
      <StateDiagram {...props} showInitial={false} />,
    );
    expect(bare).not.toBe(base);
    expect(bare).not.toContain("Inicial");

    const declared = renderToStaticMarkup(
      <StateDiagram
        ariaLabel="estados"
        nodes={[
          { id: "i", label: "", kind: "initial" },
          { id: "a", label: "Reposo" },
        ]}
        edges={[{ from: "i", to: "a" }]}
      />,
    );
    expect(declared.match(/Inicial/g)?.length).toBe(1);
  });

  test("MindmapDiagram: depthColors, nodeWidth", () => {
    const props: MindmapDiagramProps = {
      ariaLabel: "mapa",
      root: {
        label: "Raíz",
        children: [
          { label: "Rama", children: [{ label: "Hoja" }] },
          { label: "Otra" },
        ],
      },
    };
    const base = renderToStaticMarkup(<MindmapDiagram {...props} />);
    const explicit = renderToStaticMarkup(
      <MindmapDiagram {...props} nodeWidth={150} />,
    );
    expect(explicit).toBe(base);

    const tinted = renderToStaticMarkup(
      <MindmapDiagram
        {...props}
        depthColors={["var(--dc0)", "var(--dc1)", "var(--dc2)"]}
      />,
    );
    expect(tinted).not.toBe(base);
    expect(tinted).toContain("var(--dc1)");

    const wide = renderToStaticMarkup(
      <MindmapDiagram {...props} nodeWidth={200} />,
    );
    expect(wide).not.toBe(base);
    expect(wide).toContain('width="200"');
  });

  test("NetworkGraph: forces, nodeSize, showIsolated, ticks", () => {
    const props: NetworkGraphProps = {
      ariaLabel: "red",
      nodes: [{ id: "a" }, { id: "b" }, { id: "c" }],
      edges: [{ from: "a", to: "b" }],
    };
    const base = renderToStaticMarkup(<NetworkGraph {...props} />);
    const explicit = renderToStaticMarkup(
      <NetworkGraph {...props} nodeSize="degree" showIsolated ticks={300} />,
    );
    expect(explicit).toBe(base);
    expect(base).toContain("(0 conexiones)");

    const pushed = renderToStaticMarkup(
      <NetworkGraph {...props} forces={{ distance: 220 }} />,
    );
    expect(pushed).not.toBe(base);

    const fixed = renderToStaticMarkup(
      <NetworkGraph {...props} nodeSize="fixed" />,
    );
    expect(fixed).not.toBe(base);
    expect(fixed.match(/r="8"/g)?.length).toBe(3);

    const connected = renderToStaticMarkup(
      <NetworkGraph {...props} showIsolated={false} />,
    );
    expect(connected).not.toBe(base);
    expect(connected).not.toContain("(0 conexiones)");

    const rough = renderToStaticMarkup(<NetworkGraph {...props} ticks={5} />);
    expect(rough).not.toBe(base);
  });

  test("NetworkTopology: linkLegend, glyphSize, statusColors", () => {
    const props: NetworkTopologyProps = {
      ariaLabel: "topo",
      nodes: [
        { id: "inet", label: "Internet", role: "internet" },
        { id: "srv", label: "App", role: "server" },
      ],
      edges: [{ from: "inet", to: "srv", status: "down", label: "fibra" }],
    };
    const base = renderToStaticMarkup(<NetworkTopology {...props} />);
    const explicit = renderToStaticMarkup(
      <NetworkTopology {...props} linkLegend glyphSize={7} />,
    );
    expect(explicit).toBe(base);
    expect(base).toContain("Caído");

    const bare = renderToStaticMarkup(
      <NetworkTopology {...props} linkLegend={false} />,
    );
    expect(bare).not.toBe(base);
    expect(bare).not.toContain("Caído");

    const big = renderToStaticMarkup(
      <NetworkTopology {...props} glyphSize={14} />,
    );
    expect(big).not.toBe(base);
    expect(big).toContain("scale(2)");

    const recolor = renderToStaticMarkup(
      <NetworkTopology {...props} statusColors={{ down: "var(--mi-rojo)" }} />,
    );
    expect(recolor).not.toBe(base);
    expect(recolor).toContain("var(--mi-rojo)");
  });

  test("OrgChart: showRole, showAvatar, collapseDepth", () => {
    const props: OrgChartProps = {
      ariaLabel: "org",
      root: {
        name: "Ada Lovelace",
        role: "Dirección",
        children: [{ name: "Alan Turing", role: "Ingeniería" }],
      },
    };
    const base = renderToStaticMarkup(<OrgChart {...props} />);
    const explicit = renderToStaticMarkup(
      <OrgChart {...props} showRole showAvatar={false} />,
    );
    expect(explicit).toBe(base);
    expect(base).toContain("Dirección");

    const bare = renderToStaticMarkup(<OrgChart {...props} showRole={false} />);
    expect(bare).not.toBe(base);
    expect(bare).not.toContain("Dirección");

    const avatars = renderToStaticMarkup(<OrgChart {...props} showAvatar />);
    expect(avatars).not.toBe(base);
    expect(avatars).toContain("AL");

    const pruned = renderToStaticMarkup(
      <OrgChart {...props} collapseDepth={0} />,
    );
    expect(pruned).not.toBe(base);
    expect(pruned).not.toContain("Alan Turing");
  });

  test("SequenceDiagram: showNumbers", () => {
    const props: SequenceDiagramProps = {
      ariaLabel: "sec",
      participants: ["A", "B"],
      messages: [
        { from: "A", to: "B", label: "hola" },
        { from: "B", to: "A", label: "ok", kind: "return" },
      ],
    };
    const base = renderToStaticMarkup(<SequenceDiagram {...props} />);
    const explicit = renderToStaticMarkup(
      <SequenceDiagram {...props} showNumbers />,
    );
    expect(explicit).toBe(base);
    expect(base).toContain("1. hola");

    const bare = renderToStaticMarkup(
      <SequenceDiagram {...props} showNumbers={false} />,
    );
    expect(bare).not.toBe(base);
    expect(bare).not.toContain("1. hola");
    expect(bare).toContain("hola");
  });

  test("UseCaseDiagram: boundary, showStereotypes", () => {
    const props: UseCaseDiagramProps = {
      ariaLabel: "casos",
      actors: [{ id: "u", label: "Usuario" }],
      usecases: [
        { id: "c1", label: "Entrar" },
        { id: "c2", label: "Pagar" },
      ],
      edges: [
        { from: "u", to: "c1" },
        { from: "c1", to: "c2", kind: "include" },
      ],
    };
    const base = renderToStaticMarkup(<UseCaseDiagram {...props} />);
    const explicit = renderToStaticMarkup(
      <UseCaseDiagram {...props} showStereotypes />,
    );
    expect(explicit).toBe(base);
    expect(base).toContain("«include»");

    const framed = renderToStaticMarkup(
      <UseCaseDiagram {...props} boundary="Sistema" />,
    );
    expect(framed).not.toBe(base);
    expect(framed).toContain("Sistema");

    const bare = renderToStaticMarkup(
      <UseCaseDiagram {...props} showStereotypes={false} />,
    );
    expect(bare).not.toBe(base);
    expect(bare).not.toContain("include");
  });
});

describe("MindmapDiagram: color por rama y color propio", () => {
  const root = {
    label: "App",
    children: [
      { label: "Diseño", children: [{ label: "UI" }] },
      { label: "Dev", children: [{ label: "API" }] },
    ],
  };
  test("cada rama usa su color de serie (no todo chart-1)", () => {
    const html = renderToStaticMarkup(
      <MindmapDiagram ariaLabel="mapa" root={root} />,
    );
    expect(html).toContain("var(--chart-1)");
    expect(html).toContain("var(--chart-2)");
  });
  test("color propio del nodo gana a la rama", () => {
    const html = renderToStaticMarkup(
      <MindmapDiagram
        ariaLabel="mapa"
        root={{
          label: "App",
          children: [{ label: "Diseño", color: "var(--chart-5)" }],
        }}
      />,
    );
    expect(html).toContain("var(--chart-5)");
  });
});
