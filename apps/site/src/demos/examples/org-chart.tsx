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
    </div>
  );
}
