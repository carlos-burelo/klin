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

const pacienteEntities: ErEntity[] = [
  {
    id: "paciente",
    name: "Paciente",
    attributes: [
      { key: "PK", name: "id" },
      { name: "nombre" },
      { name: "nacimiento" },
      { name: "teléfono" },
      { name: "dirección" },
      { name: "seguro" },
    ],
  },
  {
    id: "cita",
    name: "Cita",
    attributes: [
      { key: "PK", name: "folio" },
      { key: "FK", name: "paciente_id" },
      { name: "fecha" },
    ],
  },
];

const pacienteRelations: ErRelation[] = [
  { from: "paciente", to: "cita", label: "1:N" },
];

const estresEntities: ErEntity[] = [
  {
    id: "e-alumno",
    name: "Alumno",
    attributes: [
      { key: "PK", name: "matrícula" },
      { name: "nombre" },
      { name: "curp" },
      { name: "ingreso" },
      { name: "carrera" },
      { name: "semestre" },
      { name: "promedio" },
      { name: "estatus" },
    ],
  },
  {
    id: "e-inscripcion",
    name: "Inscripción",
    attributes: [
      { key: "PK", name: "folio" },
      { key: "FK", name: "matrícula" },
      { key: "FK", name: "grupo_id" },
      { name: "fecha" },
      { name: "periodo" },
    ],
  },
  {
    id: "e-grupo",
    name: "Grupo",
    attributes: [
      { key: "PK", name: "clave" },
      { name: "turno" },
      { name: "cupo" },
      { name: "aula" },
    ],
  },
  {
    id: "e-materia",
    name: "Materia",
    attributes: [
      { key: "PK", name: "clave" },
      { name: "nombre" },
      { name: "créditos" },
    ],
  },
  {
    id: "e-docente",
    name: "Docente",
    attributes: [
      { key: "PK", name: "id" },
      { name: "nombre" },
      { name: "plaza" },
    ],
  },
];

const estresRelations: ErRelation[] = [
  { from: "e-alumno", to: "e-inscripcion", label: "1:N" },
  { from: "e-grupo", to: "e-inscripcion", label: "1:N" },
  { from: "e-grupo", to: "e-materia", label: "N:1" },
  { from: "e-docente", to: "e-grupo", label: "1:N" },
  { from: "e-docente", to: "e-materia", label: "N:M" },
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
      <DemoExample
        caption="paciente con seis atributos colapsados a tres visibles"
        code={`import { ErDiagram } from "@carlos-burelo/klin";

const entities = [
  {
    id: "paciente",
    name: "Paciente",
    attributes: [
      { key: "PK", name: "id" },
      { name: "nombre" },
      { name: "nacimiento" },
      { name: "teléfono" },
      { name: "dirección" },
      { name: "seguro" },
    ],
  },
  {
    id: "cita",
    name: "Cita",
    attributes: [
      { key: "PK", name: "folio" },
      { key: "FK", name: "paciente_id" },
      { name: "fecha" },
    ],
  },
];

const relations = [{ from: "paciente", to: "cita", label: "1:N" }];

<ErDiagram
  ariaLabel="Diagrama de paciente con atributos colapsados a tres"
  entities={entities}
  relations={relations}
  direction="LR"
  attributeLimit={3}
/>`}
      >
        <ErDiagram
          ariaLabel="Diagrama de paciente con atributos colapsados a tres"
          entities={pacienteEntities}
          relations={pacienteRelations}
          direction="LR"
          attributeLimit={3}
        />
      </DemoExample>
      <DemoExample
        caption="estrés escolar con 5 entidades, 8 atributos y malla de relaciones"
        code={`import { ErDiagram } from "@carlos-burelo/klin";

const entities = [
  {
    id: "e-alumno",
    name: "Alumno",
    attributes: [
      { key: "PK", name: "matrícula" },
      { name: "nombre" },
      { name: "curp" },
      { name: "ingreso" },
      { name: "carrera" },
      { name: "semestre" },
      { name: "promedio" },
      { name: "estatus" },
    ],
  },
  {
    id: "e-inscripcion",
    name: "Inscripción",
    attributes: [
      { key: "PK", name: "folio" },
      { key: "FK", name: "matrícula" },
      { key: "FK", name: "grupo_id" },
      { name: "fecha" },
      { name: "periodo" },
    ],
  },
  {
    id: "e-grupo",
    name: "Grupo",
    attributes: [
      { key: "PK", name: "clave" },
      { name: "turno" },
      { name: "cupo" },
      { name: "aula" },
    ],
  },
  {
    id: "e-materia",
    name: "Materia",
    attributes: [
      { key: "PK", name: "clave" },
      { name: "nombre" },
      { name: "créditos" },
    ],
  },
  {
    id: "e-docente",
    name: "Docente",
    attributes: [
      { key: "PK", name: "id" },
      { name: "nombre" },
      { name: "plaza" },
    ],
  },
];

const relations = [
  { from: "e-alumno", to: "e-inscripcion", label: "1:N" },
  { from: "e-grupo", to: "e-inscripcion", label: "1:N" },
  { from: "e-grupo", to: "e-materia", label: "N:1" },
  { from: "e-docente", to: "e-grupo", label: "1:N" },
  { from: "e-docente", to: "e-materia", label: "N:M" },
];

<ErDiagram
  ariaLabel="Esquema escolar denso con atributos colapsados a cuatro"
  entities={entities}
  relations={relations}
  direction="LR"
  attributeLimit={4}
/>`}
      >
        <ErDiagram
          ariaLabel="Esquema escolar denso con atributos colapsados a cuatro"
          entities={estresEntities}
          relations={estresRelations}
          direction="LR"
          attributeLimit={4}
        />
      </DemoExample>
    </div>
  );
}
