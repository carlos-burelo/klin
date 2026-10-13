export type GuideSection = {
  heading: string;
  body: string[];
  code?: { title: string; lang: "tsx" | "bash"; code: string };
  tip?: string;
};

export type Guide = {
  slug: string;
  title: string;
  description: string;
  sections: GuideSection[];
};

export const GUIDES: Guide[] = [
  {
    slug: "ssr-first",
    title: "SSR-first",
    description:
      "Por qué cada gráfica es función pura de props a SVG y qué ganas al no medir el DOM.",
    sections: [
      {
        heading: "La idea en una frase",
        body: [
          "Cada gráfica recibe props y devuelve SVG. El servidor la renderiza a HTML y el navegador la muestra sin ejecutar ni una línea de JavaScript.",
          "d3 solo hace matemática (escalas, formas, layouts). Nada de d3-selection, ResizeObserver ni ResponsiveContainer: lo responsivo sale de viewBox + w-full h-auto.",
        ],
        code: {
          title: "page.tsx — Server Component",
          lang: "tsx",
          code: `import { BarChart } from "@carlos-burelo/klin";

// Esto escupe <svg>, no <canvas>
<BarChart ariaLabel="Ventas por trimestre" data={data} xKey="t" series={series} />`,
        },
      },
      {
        heading: "Qué no hay",
        body: [
          "Sin estado interno, sin handlers en el núcleo, sin medición del DOM. Cada forma lleva <title> nativo y data-chart-tip con el mismo texto: sin JS hay tooltip accesible, con JS el portal lo enriquece.",
          "Si no hay datos, se renderiza ChartEmpty homogéneo: nunca SVG roto ni NaN (todo input pasa por toNumber, cartesianos usan domainWithZero).",
        ],
      },
      {
        heading: "Cuándo envolver en portal",
        body: [
          "Solo si quieres tooltip rico con posición y estilos. El portal es el único use client del paquete: delegación de mouseover sobre [data-chart-tip] + createPortal a document.body.",
          "Sin portal la gráfica se ve idéntica; solo pierdes el tooltip flotante.",
        ],
        code: {
          title: "Tooltip opcional",
          lang: "tsx",
          code: `import { BarChart, ChartTooltipPortal } from "@carlos-burelo/klin";

<ChartTooltipPortal>
  <BarChart ariaLabel="Ventas" data={data} xKey="t" series={series} />
</ChartTooltipPortal>`,
        },
        tip: "En tablas densas con muchas sparklines, omite el portal: los <title> nativos bastan.",
      },
    ],
  },
  {
    slug: "tema",
    title: "Tema por tokens",
    description:
      "Cómo klin usa var(--chart-1…5) para claro/oscuro automático sin hex sueltos.",
    sections: [
      {
        heading: "Tokens, no hex",
        body: [
          "Los colores por defecto son var(--chart-1…5). Cualquier serie acepta override con otro token (var(--primary), var(--muted-foreground)…): la gráfica hereda tu tema sin props extra.",
          "La serie N usa seriesColor(N, override) con fallback a CHART_TOKEN.chart1. Geometría y tipografía también salen de constantes (BAR_RADIUS, LINE_WIDTH, TICK_FONT_SIZE…), no de mágicos.",
        ],
        code: {
          title: "globals.css",
          lang: "bash",
          code: `@import "@carlos-burelo/klin/styles.css";`,
        },
      },
      {
        heading: "Claro y oscuro",
        body: [
          "El site conmuta con la clase .dark en <html> y shiki cambia de github-light a github-dark con los mismos tokens. Tus gráficas hacen lo mismo gratis porque solo referencian variables.",
          "Texto de ejes a 11px var(--muted-foreground), valores destacados con tabular-nums, leyenda text-xs vía ChartLegend.",
        ],
        tip: "Si tu UI ya define --chart-1…5 (shadcn), klin los respeta sin configuración.",
      },
    ],
  },
  {
    slug: "tooltip",
    title: "Tooltip portal",
    description:
      "El único cliente del paquete: delegación + portal, con <title> nativo como base.",
    sections: [
      {
        heading: "Cómo funciona",
        body: [
          "El núcleo no tiene JS: cada forma lleva <title> (texto plano) + data-chart-tip con el mismo texto. ChartTooltipPortal escucha mouseover por delegación, sigue focus/touch, cierra con Escape y voltea si no cabe abajo.",
          "El formato es contexto · serie: valor (parte · extra): dona/sankey/treemap con % del total, multi-serie con % del grupo, funnel con % del inicio · % previo, calendario con fecha (weekday), gantt con fechas · progreso · N días.",
        ],
        code: {
          title: "Uso",
          lang: "tsx",
          code: `import { ChartTooltipPortal, DonutChart } from "@carlos-burelo/klin";

<ChartTooltipPortal>
  <DonutChart ariaLabel="Reparto" data={data} labelKey="s" valueKey="n" />
</ChartTooltipPortal>`,
        },
      },
      {
        heading: "Rendimiento",
        body: [
          "Un solo listener por portal, acelerado con rAF. Puedes envolver muchas gráficas en un único portal en vez de uno por gráfica.",
        ],
        tip: "En SSR el portal no renderiza nada extra: el HTML sigue siendo SVG puro.",
      },
    ],
  },
  {
    slug: "accesibilidad",
    title: "Accesibilidad",
    description:
      "role=img, aria-label obligatoria, <title> por forma y vacíos homogéneos.",
    sections: [
      {
        heading: "Contrato a11y",
        body: [
          "Toda gráfica exige ariaLabel descriptivo; la raíz usa role=img con <title>. Cada forma lleva su propio <title> nativo (tooltip sin JS y lector de pantalla) más data-chart-tip para el portal.",
          "Claves duplicadas permitidas (stableKey), ticks d3 por valor, clipPath con useId (multi-chart seguro).",
        ],
        code: {
          title: "Ejemplo",
          lang: "tsx",
          code: `<BarChart
  ariaLabel="Egresados por carrera en miles, Medicina lidera"
  data={data}
  xKey="carrera"
  series={[{ key: "egresados", label: "Egresados" }]}
/>`,
        },
      },
      {
        heading: "Vacíos y táctil",
        body: [
          "Sin datos se renderiza ChartEmpty (título + descripción), nunca SVG roto. Los <title> nativos cubren táctil sin JS; el portal añade focus/touch cuando hay JS.",
        ],
        tip: "Describe la conclusión en ariaLabel, no solo el tipo: “cae 20% en Feb” > “gráfica de barras”.",
      },
    ],
  },
];

export function getGuide(slug: string) {
  return GUIDES.find((g) => g.slug === slug);
}
