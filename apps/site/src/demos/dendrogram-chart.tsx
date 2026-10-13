import type { DendrogramNode } from "@carlos-burelo/klin";
import { ChartTooltipPortal, DendrogramChart } from "@carlos-burelo/klin";

const root: DendrogramNode = {
  label: "Sistema educativo",
  children: [
    {
      label: "Básica",
      children: [
        { label: "Preescolar" },
        { label: "Primaria" },
        { label: "Secundaria" },
      ],
    },
    {
      label: "Media superior",
      children: [{ label: "Bachillerato" }, { label: "Profesional técnico" }],
    },
    {
      label: "Superior",
      children: [
        { label: "Licenciatura" },
        { label: "Posgrado" },
        { label: "Normal" },
      ],
    },
  ],
};

export default function DendrogramChartDemo() {
  return (
    <ChartTooltipPortal>
      <DendrogramChart
        root={root}
        ariaLabel="Estructura del sistema educativo mexicano por nivel y modalidad: la educación básica reúne más modalidades y la media superior es la más compacta"
      />
    </ChartTooltipPortal>
  );
}
