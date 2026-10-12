import type { TreeItem } from "@carlos-burelo/klin";
import { TreeView } from "@carlos-burelo/klin";

const items: TreeItem[] = [
  {
    label: "Registro civil",
    detail: "Oficialía 01",
    badge: 3,
    children: [
      { label: "Acta de nacimiento", detail: "Copia certificada", badge: 45 },
      { label: "Acta de matrimonio", detail: "Registro y copias", badge: 18 },
      { label: "CURP", detail: "Trámite gratuito", badge: 120 },
    ],
  },
  {
    label: "Catastro",
    detail: "Dirección de ingresos",
    badge: 2,
    children: [
      { label: "Predial", detail: "Pago anual y parcialidades", badge: 340 },
      {
        label: "Traslado de dominio",
        detail: "Requiere avalúo vigente",
        badge: 27,
      },
    ],
  },
  {
    label: "Obras públicas",
    detail: "Ventanilla técnica",
    badge: 2,
    children: [
      { label: "Licencia de construcción", detail: "Obra menor y mayor" },
      { label: "Permiso de banqueta", detail: "Reparación y rampas" },
    ],
  },
];

export default function TreeViewDemo() {
  return (
    <TreeView
      items={items}
      ariaLabel="Catálogo de trámites municipales por dependencia"
    />
  );
}
