import type { DendrogramNode } from "@carlos-burelo/klin";
import { DendrogramChart } from "@carlos-burelo/klin";
import { DemoExample } from "../../components/docs/demo-example";

const ayuntamiento: DendrogramNode = {
  label: "Presidencia",
  children: [
    {
      label: "Tesorería",
      children: [{ label: "Catastro" }, { label: "Ingresos" }],
    },
    {
      label: "Obras",
      children: [{ label: "Pavimentación" }, { label: "Alumbrado" }],
    },
    {
      label: "Seguridad",
      children: [{ label: "Patrullaje" }, { label: "Vialidad" }],
    },
  ],
};

const bibliotecas: DendrogramNode = {
  label: "Red de bibliotecas",
  children: [
    {
      label: "Centro",
      children: [{ label: "Infantil" }, { label: "Hemeroteca" }],
    },
    {
      label: "Norte",
      children: [{ label: "General" }, { label: "Digital" }],
    },
    {
      label: "Sur",
      children: [{ label: "General" }, { label: "Taller" }],
    },
  ],
};

const universidad: DendrogramNode = {
  label: "UdeG",
  children: [
    {
      label: "Ingenierías",
      children: [
        {
          label: "Sistemas",
          children: [{ label: "Software" }, { label: "Redes" }],
        },
        { label: "Civil" },
      ],
    },
    {
      label: "Salud",
      children: [{ label: "Medicina" }, { label: "Enfermería" }],
    },
  ],
};

export default function DendrogramChartExamples() {
  return (
    <div className="flex flex-col gap-6">
      <DemoExample
        caption="Organigrama municipal en vertical"
        code={`import type { DendrogramNode } from "@carlos-burelo/klin";
import { DendrogramChart } from "@carlos-burelo/klin";

const ayuntamiento: DendrogramNode = {
  label: "Presidencia",
  children: [
    {
      label: "Tesorería",
      children: [{ label: "Catastro" }, { label: "Ingresos" }],
    },
    {
      label: "Obras",
      children: [{ label: "Pavimentación" }, { label: "Alumbrado" }],
    },
    {
      label: "Seguridad",
      children: [{ label: "Patrullaje" }, { label: "Vialidad" }],
    },
  ],
};

<DendrogramChart
  root={ayuntamiento}
  ariaLabel="Organigrama del ayuntamiento por dirección y área: las tres direcciones tienen el mismo peso con dos áreas cada una"
/>`}
      >
        <DendrogramChart
          root={ayuntamiento}
          ariaLabel="Organigrama del ayuntamiento por dirección y área: las tres direcciones tienen el mismo peso con dos áreas cada una"
        />
      </DemoExample>
      <DemoExample
        caption="Red de bibliotecas en horizontal"
        code={`import type { DendrogramNode } from "@carlos-burelo/klin";
import { DendrogramChart } from "@carlos-burelo/klin";

const bibliotecas: DendrogramNode = {
  label: "Red de bibliotecas",
  children: [
    {
      label: "Centro",
      children: [{ label: "Infantil" }, { label: "Hemeroteca" }],
    },
    {
      label: "Norte",
      children: [{ label: "General" }, { label: "Digital" }],
    },
    {
      label: "Sur",
      children: [{ label: "General" }, { label: "Taller" }],
    },
  ],
};

<DendrogramChart
  root={bibliotecas}
  orientation="horizontal"
  ariaLabel="Red de bibliotecas por sede y sala en horizontal: la sede Centro es la única con hemeroteca"
/>`}
      >
        <DendrogramChart
          root={bibliotecas}
          orientation="horizontal"
          ariaLabel="Red de bibliotecas por sede y sala en horizontal: la sede Centro es la única con hemeroteca"
        />
      </DemoExample>
      <DemoExample
        caption="Tres niveles de división a carrera"
        code={`import type { DendrogramNode } from "@carlos-burelo/klin";
import { DendrogramChart } from "@carlos-burelo/klin";

const universidad: DendrogramNode = {
  label: "UdeG",
  children: [
    {
      label: "Ingenierías",
      children: [
        {
          label: "Sistemas",
          children: [{ label: "Software" }, { label: "Redes" }],
        },
        { label: "Civil" },
      ],
    },
    {
      label: "Salud",
      children: [{ label: "Medicina" }, { label: "Enfermería" }],
    },
  ],
};

<DendrogramChart
  root={universidad}
  ariaLabel="Estructura universitaria de división a carrera en tres niveles: ingenierías es la división más profunda con sistemas dividido en dos"
/>`}
      >
        <DendrogramChart
          root={universidad}
          ariaLabel="Estructura universitaria de división a carrera en tres niveles: ingenierías es la división más profunda con sistemas dividido en dos"
        />
      </DemoExample>
    </div>
  );
}
