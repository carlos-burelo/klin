import type { TreeItem } from "@carlos-burelo/klin";
import { TreeView } from "@carlos-burelo/klin";
import { DemoExample } from "../../components/docs/demo-example";

const saludItems: TreeItem[] = [
  {
    label: "Centro de salud",
    detail: "Turno matutino",
    badge: 2,
    children: [
      { label: "Consulta general", detail: "Fichas 8:00 a 10:00", badge: 30 },
      { label: "Vacunación", detail: "Cartilla vigente", badge: 50 },
    ],
  },
  {
    label: "Dental",
    detail: "Previa cita",
    badge: 1,
    children: [{ label: "Limpieza", detail: "Martes y jueves" }],
  },
];

const archivoItems: TreeItem[] = [
  {
    label: "Actas",
    children: [
      { label: "Nacimiento" },
      { label: "Matrimonio" },
      { label: "Defunción" },
    ],
  },
  {
    label: "Oficios",
    detail: "2024 a 2026",
    children: [{ label: "Entrantes" }, { label: "Salientes" }],
  },
];

const bibliotecaItems: TreeItem[] = [
  {
    label: "Fondo",
    detail: "Acervo general",
    children: [
      {
        label: "Reserva",
        detail: "Acceso restringido",
        children: [{ label: "Antiguos" }, { label: "Raros" }],
      },
      {
        label: "General",
        children: [{ label: "Novela" }, { label: "Ensayo" }],
      },
    ],
  },
];

const estresItems: TreeItem[] = [
  {
    label: "Plantel",
    detail: "Sede centro",
    badge: 4,
    children: [
      {
        label: "Edificio A",
        detail: "Aulas",
        badge: 3,
        children: [
          { label: "A-101", detail: "Primero", badge: 30 },
          { label: "A-102", detail: "Segundo", badge: 28 },
          { label: "A-103", detail: "Tercero", badge: 32 },
        ],
      },
      {
        label: "Edificio B",
        detail: "Talleres",
        badge: 3,
        children: [
          { label: "B-201", detail: "Cómputo", badge: 25 },
          { label: "B-202", detail: "Dibujo", badge: 20 },
          { label: "B-203", detail: "Música", badge: 22 },
        ],
      },
      {
        label: "Edificio C",
        detail: "Laboratorios",
        badge: 2,
        children: [
          { label: "C-301", detail: "Química", badge: 18 },
          { label: "C-302", detail: "Física", badge: 18 },
        ],
      },
      {
        label: "Patio",
        detail: "Exteriores",
        badge: 2,
        children: [
          { label: "Cancha", detail: "Deportes" },
          { label: "Foro", detail: "Eventos" },
        ],
      },
    ],
  },
];

export default function TreeViewExamples() {
  return (
    <div className="flex flex-col gap-6">
      <DemoExample
        caption="servicios de salud abiertos con insignias y detalle"
        code={`import { TreeView } from "@carlos-burelo/klin";

const items = [
  {
    label: "Centro de salud",
    detail: "Turno matutino",
    badge: 2,
    children: [
      { label: "Consulta general", detail: "Fichas 8:00 a 10:00", badge: 30 },
      { label: "Vacunación", detail: "Cartilla vigente", badge: 50 },
    ],
  },
  {
    label: "Dental",
    detail: "Previa cita",
    badge: 1,
    children: [{ label: "Limpieza", detail: "Martes y jueves" }],
  },
];

<TreeView
  ariaLabel="Árbol de servicios del centro de salud"
  items={items}
  defaultOpen
/>`}
      >
        <TreeView
          ariaLabel="Árbol de servicios del centro de salud"
          items={saludItems}
          defaultOpen
        />
      </DemoExample>
      <DemoExample
        caption="archivo municipal colapsado al cargar"
        code={`import { TreeView } from "@carlos-burelo/klin";

const items = [
  {
    label: "Actas",
    children: [
      { label: "Nacimiento" },
      { label: "Matrimonio" },
      { label: "Defunción" },
    ],
  },
  {
    label: "Oficios",
    detail: "2024 a 2026",
    children: [{ label: "Entrantes" }, { label: "Salientes" }],
  },
];

<TreeView
  ariaLabel="Árbol de archivo municipal colapsado"
  items={items}
  defaultOpen={false}
/>`}
      >
        <TreeView
          ariaLabel="Árbol de archivo municipal colapsado"
          items={archivoItems}
          defaultOpen={false}
        />
      </DemoExample>
      <DemoExample
        caption="fondo compacto limitado a dos niveles de profundidad"
        code={`import { TreeView } from "@carlos-burelo/klin";

const items = [
  {
    label: "Fondo",
    detail: "Acervo general",
    children: [
      {
        label: "Reserva",
        detail: "Acceso restringido",
        children: [{ label: "Antiguos" }, { label: "Raros" }],
      },
      {
        label: "General",
        children: [{ label: "Novela" }, { label: "Ensayo" }],
      },
    ],
  },
];

<TreeView
  ariaLabel="Árbol de fondo bibliotecario compacto con dos niveles"
  items={items}
  defaultOpen
  density="compact"
  depth={2}
/>`}
      >
        <TreeView
          ariaLabel="Árbol de fondo bibliotecario compacto con dos niveles"
          items={bibliotecaItems}
          defaultOpen
          density="compact"
          depth={2}
        />
      </DemoExample>
      <DemoExample
        caption="estrés de plantel profundo y compacto con 4 edificios y 10 aulas"
        code={`import { TreeView } from "@carlos-burelo/klin";

const items = [
  {
    label: "Plantel",
    detail: "Sede centro",
    badge: 4,
    children: [
      {
        label: "Edificio A",
        detail: "Aulas",
        badge: 3,
        children: [
          { label: "A-101", detail: "Primero", badge: 30 },
          { label: "A-102", detail: "Segundo", badge: 28 },
          { label: "A-103", detail: "Tercero", badge: 32 },
        ],
      },
      {
        label: "Edificio B",
        detail: "Talleres",
        badge: 3,
        children: [
          { label: "B-201", detail: "Cómputo", badge: 25 },
          { label: "B-202", detail: "Dibujo", badge: 20 },
          { label: "B-203", detail: "Música", badge: 22 },
        ],
      },
      {
        label: "Edificio C",
        detail: "Laboratorios",
        badge: 2,
        children: [
          { label: "C-301", detail: "Química", badge: 18 },
          { label: "C-302", detail: "Física", badge: 18 },
        ],
      },
      {
        label: "Patio",
        detail: "Exteriores",
        badge: 2,
        children: [
          { label: "Cancha", detail: "Deportes" },
          { label: "Foro", detail: "Eventos" },
        ],
      },
    ],
  },
];

<TreeView
  ariaLabel="Árbol denso del plantel con cuatro edificios y diez aulas"
  items={items}
  defaultOpen
  density="compact"
/>`}
      >
        <TreeView
          ariaLabel="Árbol denso del plantel con cuatro edificios y diez aulas"
          items={estresItems}
          defaultOpen
          density="compact"
        />
      </DemoExample>
    </div>
  );
}
