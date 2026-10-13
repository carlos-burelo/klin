import type { KanbanColumn } from "@carlos-burelo/klin";
import { KanbanBoard } from "@carlos-burelo/klin";
import { DemoExample } from "../../components/docs/demo-example";

const sprintColumns: KanbanColumn[] = [
  {
    title: "Por hacer",
    limit: 3,
    cards: [
      { title: "Diseñar cartel de la feria", tag: "Diseño" },
      { title: "Cotizar lonas", tag: "Logística" },
    ],
  },
  {
    title: "En curso",
    limit: 2,
    cards: [
      { title: "Instalar carpas", tag: "Montaje" },
      { title: "Probar sonido", tag: "Montaje" },
      { title: "Recibir expositores", tag: "Atención" },
    ],
  },
  {
    title: "Hecho",
    limit: 5,
    cards: [{ title: "Publicar programa" }],
  },
];

const mantenimientoColumns: KanbanColumn[] = [
  {
    title: "Reportado",
    cards: [
      {
        title: "Fuga en baño del piso 2",
        tag: "Plomería",
        tagColor: "var(--chart-1)",
      },
      { title: "Luminaria fundida en pasillo" },
    ],
  },
  {
    title: "Atendiendo",
    cards: [
      {
        title: "Pintar salón 4",
        tag: "Pintura",
        tagColor: "var(--chart-3)",
      },
    ],
  },
  {
    title: "Cerrado",
    cards: [
      { title: "Reparar chapa de bodega" },
      { title: "Podar jardín frontal" },
    ],
  },
];

export default function KanbanBoardExamples() {
  return (
    <div className="flex flex-col gap-6">
      <DemoExample
        caption="sprint con límites WIP y columna excedida"
        code={`import { KanbanBoard } from "@carlos-burelo/klin";

const columns = [
  {
    title: "Por hacer",
    limit: 3,
    cards: [
      { title: "Diseñar cartel de la feria", tag: "Diseño" },
      { title: "Cotizar lonas", tag: "Logística" },
    ],
  },
  {
    title: "En curso",
    limit: 2,
    cards: [
      { title: "Instalar carpas", tag: "Montaje" },
      { title: "Probar sonido", tag: "Montaje" },
      { title: "Recibir expositores", tag: "Atención" },
    ],
  },
  {
    title: "Hecho",
    limit: 5,
    cards: [{ title: "Publicar programa" }],
  },
];

<KanbanBoard
  ariaLabel="Tablero kanban de feria con límite de trabajo en curso excedido"
  columns={columns}
/>`}
      >
        <KanbanBoard
          ariaLabel="Tablero kanban de feria con límite de trabajo en curso excedido"
          columns={sprintColumns}
        />
      </DemoExample>
      <DemoExample
        caption="mantenimiento sin límites y tarjetas con o sin etiqueta"
        code={`import { KanbanBoard } from "@carlos-burelo/klin";

const columns = [
  {
    title: "Reportado",
    cards: [
      {
        title: "Fuga en baño del piso 2",
        tag: "Plomería",
        tagColor: "var(--chart-1)",
      },
      { title: "Luminaria fundida en pasillo" },
    ],
  },
  {
    title: "Atendiendo",
    cards: [
      {
        title: "Pintar salón 4",
        tag: "Pintura",
        tagColor: "var(--chart-3)",
      },
    ],
  },
  {
    title: "Cerrado",
    cards: [
      { title: "Reparar chapa de bodega" },
      { title: "Podar jardín frontal" },
    ],
  },
];

<KanbanBoard
  ariaLabel="Tablero kanban de mantenimiento sin límites de trabajo en curso"
  columns={columns}
/>`}
      >
        <KanbanBoard
          ariaLabel="Tablero kanban de mantenimiento sin límites de trabajo en curso"
          columns={mantenimientoColumns}
        />
      </DemoExample>
    </div>
  );
}
