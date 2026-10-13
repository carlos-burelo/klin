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
    </div>
  );
}
