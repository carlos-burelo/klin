import type { OrgNode } from "@carlos-burelo/klin";
import { OrgChart } from "@carlos-burelo/klin";
import { DemoExample } from "../../components/docs/demo-example";

const cooperativa: OrgNode = {
  name: "Marta Reyes",
  role: "Presidencia",
  children: [
    {
      name: "Luis Pardo",
      role: "Producción",
      children: [
        { name: "Nadia Soto", role: "Taller" },
        { name: "Iván Mora", role: "Reparto" },
      ],
    },
    {
      name: "Carmen Vega",
      role: "Administración",
      children: [{ name: "Diego Luna", role: "Caja" }],
    },
  ],
};

const escuela: OrgNode = {
  name: "Dirección escolar",
  children: [
    {
      name: "Subdirección",
      color: "var(--chart-2)",
      children: [{ name: "Primero A" }, { name: "Segundo B" }],
    },
    {
      name: "Prefectura",
      color: "var(--chart-4)",
      children: [{ name: "Patio" }],
    },
  ],
};

const desorden: OrgNode = {
  name: "Coordinación",
  children: [
    { name: "Zulema Ruiz", role: "Vinculación" },
    { name: "Ana Paz", role: "Registro" },
    { name: "Mario Sol", role: "Logística" },
  ],
};

const estres: OrgNode = {
  name: "Rectoría",
  role: "Dirección general",
  children: [
    {
      name: "Academia",
      role: "Vicerrectoría",
      children: [
        { name: "Ciencias", role: "Jefatura" },
        { name: "Humanidades", role: "Jefatura" },
        { name: "Talleres", role: "Jefatura" },
      ],
    },
    {
      name: "Operación",
      role: "Vicerrectoría",
      children: [
        { name: "Mantenimiento", role: "Jefatura" },
        { name: "Transporte", role: "Jefatura" },
        { name: "Seguridad", role: "Jefatura" },
      ],
    },
    {
      name: "Finanzas",
      role: "Vicerrectoría",
      children: [
        { name: "Contabilidad", role: "Jefatura" },
        { name: "Cobranza", role: "Jefatura" },
        { name: "Compras", role: "Jefatura" },
      ],
    },
    {
      name: "Vinculación",
      role: "Vicerrectoría",
      children: [
        { name: "Convenios", role: "Jefatura" },
        { name: "Egresados", role: "Jefatura" },
        { name: "Difusión", role: "Jefatura" },
      ],
    },
  ],
};

export default function OrgChartExamples() {
  return (
    <div className="flex flex-col gap-6">
      <DemoExample
        caption="cooperativa con cargo en cada nivel"
        code={`import { OrgChart } from "@carlos-burelo/klin";

const root = {
  name: "Marta Reyes",
  role: "Presidencia",
  children: [
    {
      name: "Luis Pardo",
      role: "Producción",
      children: [
        { name: "Nadia Soto", role: "Taller" },
        { name: "Iván Mora", role: "Reparto" },
      ],
    },
    {
      name: "Carmen Vega",
      role: "Administración",
      children: [{ name: "Diego Luna", role: "Caja" }],
    },
  ],
};

<OrgChart
  ariaLabel="Organigrama de cooperativa con presidencia y dos áreas"
  root={root}
/>`}
      >
        <OrgChart
          ariaLabel="Organigrama de cooperativa con presidencia y dos áreas"
          root={cooperativa}
        />
      </DemoExample>
      <DemoExample
        caption="escuela con nodos sin cargo y colores por área"
        code={`import { OrgChart } from "@carlos-burelo/klin";

const root = {
  name: "Dirección escolar",
  children: [
    {
      name: "Subdirección",
      color: "var(--chart-2)",
      children: [{ name: "Primero A" }, { name: "Segundo B" }],
    },
    {
      name: "Prefectura",
      color: "var(--chart-4)",
      children: [{ name: "Patio" }],
    },
  ],
};

<OrgChart
  ariaLabel="Organigrama escolar con áreas de color y grupos sin cargo"
  root={root}
/>`}
      >
        <OrgChart
          ariaLabel="Organigrama escolar con áreas de color y grupos sin cargo"
          root={escuela}
        />
      </DemoExample>
      <DemoExample
        caption="coordinación desordenada que se ordena por nombre"
        code={`import { OrgChart } from "@carlos-burelo/klin";

const root = {
  name: "Coordinación",
  children: [
    { name: "Zulema Ruiz", role: "Vinculación" },
    { name: "Ana Paz", role: "Registro" },
    { name: "Mario Sol", role: "Logística" },
  ],
};

<OrgChart
  ariaLabel="Organigrama de coordinación ordenado por nombre"
  root={root}
  sortBy="label"
/>`}
      >
        <OrgChart
          ariaLabel="Organigrama de coordinación ordenado por nombre"
          root={desorden}
          sortBy="label"
        />
      </DemoExample>
      <DemoExample
        caption="estrés universitario de 3 niveles con 4 áreas y 12 jefaturas"
        code={`import { OrgChart } from "@carlos-burelo/klin";

const root = {
  name: "Rectoría",
  role: "Dirección general",
  children: [
    {
      name: "Academia",
      role: "Vicerrectoría",
      children: [
        { name: "Ciencias", role: "Jefatura" },
        { name: "Humanidades", role: "Jefatura" },
        { name: "Talleres", role: "Jefatura" },
      ],
    },
    {
      name: "Operación",
      role: "Vicerrectoría",
      children: [
        { name: "Mantenimiento", role: "Jefatura" },
        { name: "Transporte", role: "Jefatura" },
        { name: "Seguridad", role: "Jefatura" },
      ],
    },
    {
      name: "Finanzas",
      role: "Vicerrectoría",
      children: [
        { name: "Contabilidad", role: "Jefatura" },
        { name: "Cobranza", role: "Jefatura" },
        { name: "Compras", role: "Jefatura" },
      ],
    },
    {
      name: "Vinculación",
      role: "Vicerrectoría",
      children: [
        { name: "Convenios", role: "Jefatura" },
        { name: "Egresados", role: "Jefatura" },
        { name: "Difusión", role: "Jefatura" },
      ],
    },
  ],
};

<OrgChart
  ariaLabel="Organigrama denso de rectoría con cuatro áreas y doce jefaturas"
  root={root}
/>`}
      >
        <OrgChart
          ariaLabel="Organigrama denso de rectoría con cuatro áreas y doce jefaturas"
          root={estres}
        />
      </DemoExample>
    </div>
  );
}
