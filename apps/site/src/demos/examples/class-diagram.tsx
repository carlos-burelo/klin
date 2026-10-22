import type { ClassEdge, ClassNode } from "@carlos-burelo/klin";
import { ClassDiagram } from "@carlos-burelo/klin";
import { DemoExample } from "../../components/docs/demo-example";

const herenciaNodes: ClassNode[] = [
  {
    id: "vehiculo",
    name: "Vehículo",
    attributes: ["placa: string", "modelo: string"],
    methods: ["arrancar()", "detener()"],
  },
  {
    id: "auto",
    name: "Auto",
    attributes: ["puertas: number"],
    methods: ["abrirCajuela()"],
  },
  {
    id: "moto",
    name: "Moto",
    attributes: ["cilindraje: number"],
    methods: ["hacerCaballito()"],
  },
];

const herenciaEdges: ClassEdge[] = [
  { from: "auto", to: "vehiculo", kind: "inheritance" },
  { from: "moto", to: "vehiculo", kind: "inheritance" },
];

const pedidoNodes: ClassNode[] = [
  {
    id: "pedido",
    name: "Pedido",
    attributes: ["id: string", "total: number"],
    methods: ["confirmar()", "cancelar()"],
  },
  {
    id: "linea",
    name: "Línea",
    attributes: ["cantidad: number", "precio: number"],
    methods: ["subtotal()"],
  },
  {
    id: "pagos",
    name: "Pagos",
    attributes: ["proveedor: string"],
    methods: ["cobrar()"],
  },
];

const pedidoEdges: ClassEdge[] = [
  { from: "linea", to: "pedido", kind: "composition", label: "contiene" },
  { from: "pedido", to: "pagos", kind: "dependency", label: "usa" },
];

const cuentasNodes: ClassNode[] = [
  { id: "usuario", name: "Usuario" },
  { id: "perfil", name: "Perfil" },
];

const cuentasEdges: ClassEdge[] = [
  { from: "usuario", to: "perfil", kind: "association", label: "tiene" },
];

const estresNodes: ClassNode[] = [
  {
    id: "c-cuenta",
    name: "Cuenta",
    attributes: [
      "id: string",
      "titular: string",
      "curp: string",
      "saldo: number",
      "moneda: string",
      "creada: Date",
      "estado: string",
      "sucursal: string",
      "nivel: number",
    ],
    methods: [
      "abrir()",
      "cerrar()",
      "abonar(monto: number)",
      "cargar(monto: number)",
    ],
  },
  {
    id: "c-movimiento",
    name: "Movimiento",
    attributes: [
      "folio: string",
      "fecha: Date",
      "monto: number",
      "tipo: string",
    ],
    methods: ["aplicar()", "revertir()"],
  },
  {
    id: "c-tarjeta",
    name: "Tarjeta",
    attributes: ["pan: string", "vence: Date", "nip: string"],
    methods: ["bloquear()", "reponer()"],
  },
  {
    id: "c-cliente",
    name: "Cliente",
    attributes: ["id: string", "nombre: string", "régimen: string"],
    methods: ["validar()"],
  },
];

const estresEdges: ClassEdge[] = [
  {
    from: "c-movimiento",
    to: "c-cuenta",
    kind: "composition",
    label: "registra",
  },
  { from: "c-tarjeta", to: "c-cuenta", kind: "association", label: "dispone" },
  {
    from: "c-cuenta",
    to: "c-cliente",
    kind: "association",
    label: "pertenece",
  },
  { from: "c-movimiento", to: "c-tarjeta", kind: "dependency", label: "usa" },
];

export default function ClassDiagramExamples() {
  return (
    <div className="flex flex-col gap-6">
      <DemoExample
        caption="herencia vertical entre vehículo, auto y moto"
        code={`import { ClassDiagram } from "@carlos-burelo/klin";

const nodes = [
  {
    id: "vehiculo",
    name: "Vehículo",
    attributes: ["placa: string", "modelo: string"],
    methods: ["arrancar()", "detener()"],
  },
  {
    id: "auto",
    name: "Auto",
    attributes: ["puertas: number"],
    methods: ["abrirCajuela()"],
  },
  {
    id: "moto",
    name: "Moto",
    attributes: ["cilindraje: number"],
    methods: ["hacerCaballito()"],
  },
];

const edges = [
  { from: "auto", to: "vehiculo", kind: "inheritance" },
  { from: "moto", to: "vehiculo", kind: "inheritance" },
];

<ClassDiagram
  ariaLabel="Diagrama de clases con herencia de vehículos"
  nodes={nodes}
  edges={edges}
  direction="TB"
/>`}
      >
        <ClassDiagram
          ariaLabel="Diagrama de clases con herencia de vehículos"
          nodes={herenciaNodes}
          edges={herenciaEdges}
          direction="TB"
        />
      </DemoExample>
      <DemoExample
        caption="composición y dependencia en módulo de pedidos"
        code={`import { ClassDiagram } from "@carlos-burelo/klin";

const nodes = [
  {
    id: "pedido",
    name: "Pedido",
    attributes: ["id: string", "total: number"],
    methods: ["confirmar()", "cancelar()"],
  },
  {
    id: "linea",
    name: "Línea",
    attributes: ["cantidad: number", "precio: number"],
    methods: ["subtotal()"],
  },
  {
    id: "pagos",
    name: "Pagos",
    attributes: ["proveedor: string"],
    methods: ["cobrar()"],
  },
];

const edges = [
  { from: "linea", to: "pedido", kind: "composition", label: "contiene" },
  { from: "pedido", to: "pagos", kind: "dependency", label: "usa" },
];

<ClassDiagram
  ariaLabel="Diagrama de clases de pedidos con composición y dependencia"
  nodes={nodes}
  edges={edges}
  direction="LR"
/>`}
      >
        <ClassDiagram
          ariaLabel="Diagrama de clases de pedidos con composición y dependencia"
          nodes={pedidoNodes}
          edges={pedidoEdges}
          direction="LR"
        />
      </DemoExample>
      <DemoExample
        caption="clases solo con nombre unidas por asociación simple"
        code={`import { ClassDiagram } from "@carlos-burelo/klin";

const nodes = [
  { id: "usuario", name: "Usuario" },
  { id: "perfil", name: "Perfil" },
];

const edges = [
  { from: "usuario", to: "perfil", kind: "association", label: "tiene" },
];

<ClassDiagram
  ariaLabel="Diagrama de clases de usuario y perfil con asociación simple"
  nodes={nodes}
  edges={edges}
/>`}
      >
        <ClassDiagram
          ariaLabel="Diagrama de clases de usuario y perfil con asociación simple"
          nodes={cuentasNodes}
          edges={cuentasEdges}
        />
      </DemoExample>
      <DemoExample
        caption="mismo módulo de pedidos con leyenda de relaciones"
        code={`import { ClassDiagram } from "@carlos-burelo/klin";

const nodes = [
  {
    id: "pedido",
    name: "Pedido",
    attributes: ["id: string", "total: number"],
    methods: ["confirmar()", "cancelar()"],
  },
  {
    id: "linea",
    name: "Línea",
    attributes: ["cantidad: number", "precio: number"],
    methods: ["subtotal()"],
  },
  {
    id: "pagos",
    name: "Pagos",
    attributes: ["proveedor: string"],
    methods: ["cobrar()"],
  },
];

const edges = [
  { from: "linea", to: "pedido", kind: "composition", label: "contiene" },
  { from: "pedido", to: "pagos", kind: "dependency", label: "usa" },
];

<ClassDiagram
  ariaLabel="Diagrama de clases de pedidos con leyenda de relaciones"
  nodes={nodes}
  edges={edges}
  direction="LR"
  showLegend
/>`}
      >
        <ClassDiagram
          ariaLabel="Diagrama de clases de pedidos con leyenda de relaciones"
          nodes={pedidoNodes}
          edges={pedidoEdges}
          direction="LR"
          showLegend
        />
      </DemoExample>
      <DemoExample
        caption="estrés con cuenta de 9 atributos colapsados a 4 visibles"
        code={`import { ClassDiagram } from "@carlos-burelo/klin";

const nodes = [
  {
    id: "c-cuenta",
    name: "Cuenta",
    attributes: [
      "id: string",
      "titular: string",
      "curp: string",
      "saldo: number",
      "moneda: string",
      "creada: Date",
      "estado: string",
      "sucursal: string",
      "nivel: number",
    ],
    methods: [
      "abrir()",
      "cerrar()",
      "abonar(monto: number)",
      "cargar(monto: number)",
    ],
  },
  {
    id: "c-movimiento",
    name: "Movimiento",
    attributes: [
      "folio: string",
      "fecha: Date",
      "monto: number",
      "tipo: string",
    ],
    methods: ["aplicar()", "revertir()"],
  },
  {
    id: "c-tarjeta",
    name: "Tarjeta",
    attributes: ["pan: string", "vence: Date", "nip: string"],
    methods: ["bloquear()", "reponer()"],
  },
  {
    id: "c-cliente",
    name: "Cliente",
    attributes: ["id: string", "nombre: string", "régimen: string"],
    methods: ["validar()"],
  },
];

const edges = [
  {
    from: "c-movimiento",
    to: "c-cuenta",
    kind: "composition",
    label: "registra",
  },
  { from: "c-tarjeta", to: "c-cuenta", kind: "association", label: "dispone" },
  {
    from: "c-cuenta",
    to: "c-cliente",
    kind: "association",
    label: "pertenece",
  },
  { from: "c-movimiento", to: "c-tarjeta", kind: "dependency", label: "usa" },
];

<ClassDiagram
  ariaLabel="Diagrama bancario denso con miembros colapsados a cuatro"
  nodes={nodes}
  edges={edges}
  direction="LR"
  memberLimit={4}
/>`}
      >
        <ClassDiagram
          ariaLabel="Diagrama bancario denso con miembros colapsados a cuatro"
          nodes={estresNodes}
          edges={estresEdges}
          direction="LR"
          memberLimit={4}
        />
      </DemoExample>
    </div>
  );
}
