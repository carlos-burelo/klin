import type { MindNode } from "@carlos-burelo/klin";
import { ChartTooltipPortal, MindmapDiagram } from "@carlos-burelo/klin";

const root: MindNode = {
  label: "Lanzamiento app",
  children: [
    {
      label: "Diseño",
      children: [{ label: "Identidad" }, { label: "Prototipos" }],
    },
    {
      label: "Desarrollo",
      children: [{ label: "API pública" }, { label: "App móvil" }],
    },
    {
      label: "Mercadotecnia",
      children: [{ label: "Campaña radial" }, { label: "Alianzas" }],
    },
  ],
};

export default function MindmapDiagramDemo() {
  return (
    <ChartTooltipPortal>
      <MindmapDiagram
        root={root}
        ariaLabel="Mapa mental del plan de lanzamiento de la aplicación"
      />
    </ChartTooltipPortal>
  );
}
