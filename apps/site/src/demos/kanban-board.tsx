import type { KanbanColumn } from "@carlos-burelo/klin";
import { ChartTooltipPortal, KanbanBoard } from "@carlos-burelo/klin";

const columns: KanbanColumn[] = [
  {
    title: "Por hacer",
    cards: [
      {
        title: "Redactar guía de publicación",
        tag: "Docs",
        tagColor: "var(--chart-3)",
      },
      {
        title: "Auditar accesibilidad del catálogo",
        tag: "Calidad",
        tagColor: "var(--chart-4)",
      },
    ],
  },
  {
    title: "En curso",
    limit: 3,
    cards: [
      {
        title: "Migrar fichas de producto al nuevo tema",
        tag: "Frontend",
        tagColor: "var(--chart-1)",
      },
      {
        title: "Conciliar inventario con el almacén norte",
        tag: "Operación",
        tagColor: "var(--chart-2)",
      },
    ],
  },
  {
    title: "En revisión",
    limit: 2,
    cards: [
      {
        title: "Validar precios de mayoreo con finanzas",
        tag: "Revisión",
        tagColor: "var(--chart-5)",
      },
    ],
  },
  {
    title: "Hecho",
    cards: [
      { title: "Publicar catálogo de primavera" },
      { title: "Respaldar base de clientes" },
    ],
  },
];

export default function KanbanBoardDemo() {
  return (
    <ChartTooltipPortal>
      <KanbanBoard
        columns={columns}
        ariaLabel="Tablero kanban del sprint de lanzamiento"
      />
    </ChartTooltipPortal>
  );
}
