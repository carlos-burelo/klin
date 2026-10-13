import type { ErEntity, ErRelation } from "@carlos-burelo/klin";
import { ErDiagram } from "@carlos-burelo/klin";
import { DemoExample } from "../../components/docs/demo-example";

const bibliotecaEntities: ErEntity[] = [
  {
    id: "libro",
    name: "Libro",
    attributes: [
      { key: "PK", name: "id" },
      { name: "título" },
      { name: "año" },
    ],
  },
  {
    id: "prestamo",
    name: "Préstamo",
    attributes: [
      { key: "PK", name: "id" },
      { key: "FK", name: "libro_id" },
      { key: "FK", name: "socio_id" },
      { name: "fecha" },
    ],
  },
  {
    id: "socio",
    name: "Socio",
    attributes: [
      { key: "PK", name: "id" },
      { name: "nombre" },
      { name: "teléfono" },
    ],
  },
];

const bibliotecaRelations: ErRelation[] = [
  { from: "libro", to: "prestamo", label: "1:N" },
  { from: "socio", to: "prestamo", label: "1:N" },
];

const escuelaEntities: ErEntity[] = [
  {
    id: "estudiante",
    name: "Estudiante",
    attributes: [{ key: "PK", name: "matrícula" }, { name: "nombre" }],
  },
  {
    id: "credencial",
    name: "Credencial",
    attributes: [{ key: "PK", name: "folio" }, { name: "vigencia" }],
  },
  {
    id: "grupo",
    name: "Grupo",
    attributes: [{ key: "PK", name: "clave" }, { name: "turno" }],
  },
];

const escuelaRelations: ErRelation[] = [
  { from: "estudiante", to: "credencial", label: "1:1" },
  { from: "grupo", to: "estudiante", label: "1:N" },
];

export default function ERDiagramExamples() {
  return (
    <div className="flex flex-col gap-6">
      <DemoExample
        caption="dirección horizontal con claves foráneas y cardinalidad 1:N"
        code={`import { ErDiagram } from "@carlos-burelo/klin";

const entities = [
  {
    id: "libro",
    name: "Libro",
    attributes: [
      { key: "PK", name: "id" },
      { name: "título" },
      { name: "año" },
    ],
  },
  {
    id: "prestamo",
    name: "Préstamo",
    attributes: [
      { key: "PK", name: "id" },
      { key: "FK", name: "libro_id" },
      { key: "FK", name: "socio_id" },
      { name: "fecha" },
    ],
  },
  {
    id: "socio",
    name: "Socio",
    attributes: [
      { key: "PK", name: "id" },
      { name: "nombre" },
      { name: "teléfono" },
    ],
  },
];

const relations = [
  { from: "libro", to: "prestamo", label: "1:N" },
  { from: "socio", to: "prestamo", label: "1:N" },
];

<ErDiagram
  ariaLabel="Diagrama entidad-relación de biblioteca con préstamos"
  entities={entities}
  relations={relations}
  direction="LR"
/>`}
      >
        <ErDiagram
          ariaLabel="Diagrama entidad-relación de biblioteca con préstamos"
          entities={bibliotecaEntities}
          relations={bibliotecaRelations}
          direction="LR"
        />
      </DemoExample>
      <DemoExample
        caption="dirección vertical con relación uno a uno"
        code={`import { ErDiagram } from "@carlos-burelo/klin";

const entities = [
  {
    id: "estudiante",
    name: "Estudiante",
    attributes: [{ key: "PK", name: "matrícula" }, { name: "nombre" }],
  },
  {
    id: "credencial",
    name: "Credencial",
    attributes: [{ key: "PK", name: "folio" }, { name: "vigencia" }],
  },
  {
    id: "grupo",
    name: "Grupo",
    attributes: [{ key: "PK", name: "clave" }, { name: "turno" }],
  },
];

const relations = [
  { from: "estudiante", to: "credencial", label: "1:1" },
  { from: "grupo", to: "estudiante", label: "1:N" },
];

<ErDiagram
  ariaLabel="Diagrama entidad-relación de escuela con credencial uno a uno"
  entities={entities}
  relations={relations}
  direction="TB"
/>`}
      >
        <ErDiagram
          ariaLabel="Diagrama entidad-relación de escuela con credencial uno a uno"
          entities={escuelaEntities}
          relations={escuelaRelations}
          direction="TB"
        />
      </DemoExample>
    </div>
  );
}
