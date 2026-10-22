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

const solicitudesColumns: KanbanColumn[] = [
  {
    title: "Recibidas",
    cards: [
      { title: "Credencial de Ana", tag: "Trámite" },
      { title: "Constancia de Luis", tag: "Trámite" },
      { title: "Boleta de María", tag: "Trámite" },
      { title: "Carta de Pedro", tag: "Trámite" },
    ],
  },
  {
    title: "Entregadas",
    cards: [{ title: "Acta de Nadia", tag: "Trámite" }],
  },
];

const estresColumns: KanbanColumn[] = [
  {
    title: "Backlog",
    limit: 10,
    cards: [
      { title: "Pintar salón 1", tag: "A" },
      { title: "Pintar salón 2", tag: "A" },
      { title: "Pintar salón 3", tag: "A" },
      { title: "Podar jardín norte", tag: "B" },
      { title: "Podar jardín sur", tag: "B" },
      { title: "Reparar banca 1", tag: "C" },
      { title: "Reparar banca 2", tag: "C" },
      { title: "Lavar tinacos", tag: "D" },
    ],
  },
  {
    title: "Por hacer",
    limit: 10,
    cards: [
      { title: "Cambiar chapa 1", tag: "A" },
      { title: "Cambiar chapa 2", tag: "A" },
      { title: "Fumigar aulas", tag: "B" },
      { title: "Revisar extintores", tag: "B" },
      { title: "Purgar cisterna", tag: "C" },
      { title: "Nivelar patio", tag: "C" },
      { title: "Sellar goteras", tag: "D" },
      { title: "Rotular señales", tag: "D" },
    ],
  },
  {
    title: "En curso",
    limit: 10,
    cards: [
      { title: "Impermeabilizar techo", tag: "A" },
      { title: "Cambiar luminarias", tag: "A" },
      { title: "Reparar bomba", tag: "B" },
      { title: "Pintar fachada", tag: "B" },
      { title: "Ajustar puertas", tag: "C" },
      { title: "Reponer vidrios", tag: "C" },
      { title: "Desazolvar dren", tag: "D" },
      { title: "Podar árboles", tag: "D" },
    ],
  },
  {
    title: "Hecho",
    limit: 10,
    cards: [
      { title: "Barrer plaza", tag: "A" },
      { title: "Regar jardines", tag: "A" },
      { title: "Aceitar bisagras", tag: "B" },
      { title: "Apretar tornillería", tag: "B" },
      { title: "Limpiar canaletas", tag: "C" },
      { title: "Ordenar bodega", tag: "C" },
      { title: "Recoger cascajo", tag: "D" },
      { title: "Cerrar bitácora", tag: "D" },
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
      <DemoExample
        caption="solicitudes recortadas a dos tarjetas con conteos"
        code={`import { KanbanBoard } from "@carlos-burelo/klin";

const columns = [
  {
    title: "Recibidas",
    cards: [
      { title: "Credencial de Ana", tag: "Trámite" },
      { title: "Constancia de Luis", tag: "Trámite" },
      { title: "Boleta de María", tag: "Trámite" },
      { title: "Carta de Pedro", tag: "Trámite" },
    ],
  },
  {
    title: "Entregadas",
    cards: [{ title: "Acta de Nadia", tag: "Trámite" }],
  },
];

<KanbanBoard
  ariaLabel="Tablero de solicitudes recortado con conteos por columna"
  columns={columns}
  maxCards={2}
  showCounts
/>`}
      >
        <KanbanBoard
          ariaLabel="Tablero de solicitudes recortado con conteos por columna"
          columns={solicitudesColumns}
          maxCards={2}
          showCounts
        />
      </DemoExample>
      <DemoExample
        caption="estrés de mantenimiento con 4 columnas de 8 tarjetas recortadas"
        code={`import { KanbanBoard } from "@carlos-burelo/klin";

const columns = [
  {
    title: "Backlog",
    limit: 10,
    cards: [
      { title: "Pintar salón 1", tag: "A" },
      { title: "Pintar salón 2", tag: "A" },
      { title: "Pintar salón 3", tag: "A" },
      { title: "Podar jardín norte", tag: "B" },
      { title: "Podar jardín sur", tag: "B" },
      { title: "Reparar banca 1", tag: "C" },
      { title: "Reparar banca 2", tag: "C" },
      { title: "Lavar tinacos", tag: "D" },
    ],
  },
  {
    title: "Por hacer",
    limit: 10,
    cards: [
      { title: "Cambiar chapa 1", tag: "A" },
      { title: "Cambiar chapa 2", tag: "A" },
      { title: "Fumigar aulas", tag: "B" },
      { title: "Revisar extintores", tag: "B" },
      { title: "Purgar cisterna", tag: "C" },
      { title: "Nivelar patio", tag: "C" },
      { title: "Sellar goteras", tag: "D" },
      { title: "Rotular señales", tag: "D" },
    ],
  },
  {
    title: "En curso",
    limit: 10,
    cards: [
      { title: "Impermeabilizar techo", tag: "A" },
      { title: "Cambiar luminarias", tag: "A" },
      { title: "Reparar bomba", tag: "B" },
      { title: "Pintar fachada", tag: "B" },
      { title: "Ajustar puertas", tag: "C" },
      { title: "Reponer vidrios", tag: "C" },
      { title: "Desazolvar dren", tag: "D" },
      { title: "Podar árboles", tag: "D" },
    ],
  },
  {
    title: "Hecho",
    limit: 10,
    cards: [
      { title: "Barrer plaza", tag: "A" },
      { title: "Regar jardines", tag: "A" },
      { title: "Aceitar bisagras", tag: "B" },
      { title: "Apretar tornillería", tag: "B" },
      { title: "Limpiar canaletas", tag: "C" },
      { title: "Ordenar bodega", tag: "C" },
      { title: "Recoger cascajo", tag: "D" },
      { title: "Cerrar bitácora", tag: "D" },
    ],
  },
];

<KanbanBoard
  ariaLabel="Tablero denso de mantenimiento con cuatro columnas recortadas"
  columns={columns}
  maxCards={5}
  showCounts
/>`}
      >
        <KanbanBoard
          ariaLabel="Tablero denso de mantenimiento con cuatro columnas recortadas"
          columns={estresColumns}
          maxCards={5}
          showCounts
        />
      </DemoExample>
    </div>
  );
}
