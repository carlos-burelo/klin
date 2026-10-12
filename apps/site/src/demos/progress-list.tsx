import type { ProgressRow } from "@carlos-burelo/klin";
import { ChartTooltipPortal, ProgressList } from "@carlos-burelo/klin";

const rows: ProgressRow[] = [
  {
    label: "Migración a la nube",
    value: 85,
    total: 100,
    detail: "Fase de réplicas",
  },
  {
    label: "Capacitación de cajeros",
    value: 32,
    total: 40,
    detail: "Sucursales del centro",
  },
  {
    label: "Inventario anual",
    value: 12,
    total: 18,
    detail: "Bodegas contadas",
  },
  { label: "Auditoría externa", value: 4, total: 6 },
];

export default function ProgressListDemo() {
  return (
    <ChartTooltipPortal>
      <ProgressList
        rows={rows}
        ariaLabel="Avance de los cuatro proyectos prioritarios del trimestre"
      />
    </ChartTooltipPortal>
  );
}
