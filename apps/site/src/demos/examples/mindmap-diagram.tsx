import type { MindNode } from "@carlos-burelo/klin";
import { MindmapDiagram } from "@carlos-burelo/klin";
import { DemoExample } from "../../components/docs/demo-example";

const huerto: MindNode = {
  label: "Huerto urbano",
  children: [
    {
      label: "Hortalizas",
      children: [{ label: "Jitomate" }, { label: "Lechuga" }],
    },
    {
      label: "Riego",
      children: [{ label: "Goteo" }, { label: "Horario" }],
    },
    {
      label: "Composta",
      children: [{ label: "Restos" }, { label: "Hojas secas" }],
    },
  ],
};

const tesis: MindNode = {
  label: "Tesis",
  children: [
    {
      label: "Marco teórico",
      children: [
        {
          label: "Antecedentes",
          children: [{ label: "Locales" }, { label: "Nacionales" }],
        },
      ],
    },
    {
      label: "Metodología",
      children: [
        {
          label: "Campo",
          children: [{ label: "Entrevistas" }, { label: "Encuestas" }],
        },
      ],
    },
  ],
};

export default function MindmapDiagramExamples() {
  return (
    <div className="flex flex-col gap-6">
      <DemoExample
        caption="plan de huerto con tres ramas de dos niveles"
        code={`import { MindmapDiagram } from "@carlos-burelo/klin";

const root = {
  label: "Huerto urbano",
  children: [
    {
      label: "Hortalizas",
      children: [{ label: "Jitomate" }, { label: "Lechuga" }],
    },
    {
      label: "Riego",
      children: [{ label: "Goteo" }, { label: "Horario" }],
    },
    {
      label: "Composta",
      children: [{ label: "Restos" }, { label: "Hojas secas" }],
    },
  ],
};

<MindmapDiagram
  ariaLabel="Mapa mental del plan de huerto urbano"
  root={root}
/>`}
      >
        <MindmapDiagram
          ariaLabel="Mapa mental del plan de huerto urbano"
          root={huerto}
        />
      </DemoExample>
      <DemoExample
        caption="tesis con dos ramas profundas de tres niveles"
        code={`import { MindmapDiagram } from "@carlos-burelo/klin";

const root = {
  label: "Tesis",
  children: [
    {
      label: "Marco teórico",
      children: [
        {
          label: "Antecedentes",
          children: [{ label: "Locales" }, { label: "Nacionales" }],
        },
      ],
    },
    {
      label: "Metodología",
      children: [
        {
          label: "Campo",
          children: [{ label: "Entrevistas" }, { label: "Encuestas" }],
        },
      ],
    },
  ],
};

<MindmapDiagram
  ariaLabel="Mapa mental de la estructura de tesis"
  root={root}
/>`}
      >
        <MindmapDiagram
          ariaLabel="Mapa mental de la estructura de tesis"
          root={tesis}
        />
      </DemoExample>
    </div>
  );
}
