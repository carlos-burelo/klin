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
    </div>
  );
}
