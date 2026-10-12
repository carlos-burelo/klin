import type { OrgNode } from "@carlos-burelo/klin";
import { ChartTooltipPortal, OrgChart } from "@carlos-burelo/klin";

const root: OrgNode = {
  name: "Mariana Solís",
  role: "Dirección general",
  children: [
    {
      name: "Raúl Cordero",
      role: "Operaciones",
      children: [
        { name: "Lucía Ferrer", role: "Logística" },
        { name: "Pedro Ibáñez", role: "Almacén" },
      ],
    },
    {
      name: "Elena Vidal",
      role: "Finanzas",
      children: [{ name: "Marco Rueda", role: "Contabilidad" }],
    },
    {
      name: "Jorge Téllez",
      role: "Tecnología",
      children: [
        { name: "Ana Beltrán", role: "Desarrollo" },
        { name: "Sara Domínguez", role: "Soporte" },
      ],
    },
  ],
};

export default function OrgChartDemo() {
  return (
    <ChartTooltipPortal>
      <OrgChart
        root={root}
        ariaLabel="Organigrama de la dirección y sus tres gerencias"
      />
    </ChartTooltipPortal>
  );
}
