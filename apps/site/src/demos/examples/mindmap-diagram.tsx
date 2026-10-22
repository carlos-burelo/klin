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

const estresM: MindNode = {
  label: "Feria anual",
  children: [
    {
      label: "Sede",
      children: [
        {
          label: "Foro",
          children: [
            { label: "Sonido" },
            { label: "Luces" },
            { label: "Sillas" },
          ],
        },
        {
          label: "Puestos",
          children: [{ label: "Cocina" }, { label: "Artesanía" }],
        },
      ],
    },
    {
      label: "Programa",
      children: [
        {
          label: "Talleres",
          children: [
            { label: "Cartón" },
            { label: "Barro" },
            { label: "Danza" },
          ],
        },
        {
          label: "Conciertos",
          children: [{ label: "Jarocho" }, { label: "Banda" }],
        },
      ],
    },
    {
      label: "Logística",
      children: [
        {
          label: "Seguridad",
          children: [{ label: "Accesos" }, { label: "Rondines" }],
        },
        {
          label: "Limpieza",
          children: [{ label: "Turnos" }, { label: "Acopio" }],
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
      <DemoExample
        caption="misma tesis colapsada al primer nivel de ramas"
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
  ariaLabel="Mapa mental de tesis colapsado al primer nivel"
  root={root}
  collapseDepth={1}
/>`}
      >
        <MindmapDiagram
          ariaLabel="Mapa mental de tesis colapsado al primer nivel"
          root={tesis}
          collapseDepth={1}
        />
      </DemoExample>
      <DemoExample
        caption="estrés de feria con 3 ramas profundas de 4 niveles"
        code={`import { MindmapDiagram } from "@carlos-burelo/klin";

const root = {
  label: "Feria anual",
  children: [
    {
      label: "Sede",
      children: [
        {
          label: "Foro",
          children: [
            { label: "Sonido" },
            { label: "Luces" },
            { label: "Sillas" },
          ],
        },
        {
          label: "Puestos",
          children: [{ label: "Cocina" }, { label: "Artesanía" }],
        },
      ],
    },
    {
      label: "Programa",
      children: [
        {
          label: "Talleres",
          children: [
            { label: "Cartón" },
            { label: "Barro" },
            { label: "Danza" },
          ],
        },
        {
          label: "Conciertos",
          children: [{ label: "Jarocho" }, { label: "Banda" }],
        },
      ],
    },
    {
      label: "Logística",
      children: [
        {
          label: "Seguridad",
          children: [{ label: "Accesos" }, { label: "Rondines" }],
        },
        {
          label: "Limpieza",
          children: [{ label: "Turnos" }, { label: "Acopio" }],
        },
      ],
    },
  ],
};

<MindmapDiagram
  ariaLabel="Mapa mental denso de la feria anual con tres ramas profundas"
  root={root}
/>`}
      >
        <MindmapDiagram
          ariaLabel="Mapa mental denso de la feria anual con tres ramas profundas"
          root={estresM}
        />
      </DemoExample>
    </div>
  );
}
