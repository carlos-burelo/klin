import type { IcicleNode } from "@carlos-burelo/klin";
import { IcicleChart } from "@carlos-burelo/klin";
import { DemoExample } from "../../components/docs/demo-example";

const matricula: IcicleNode = {
  label: "Matrícula",
  children: [
    {
      label: "Plantel Centro",
      children: [
        { label: "Matutino", value: 820 },
        { label: "Vespertino", value: 540 },
      ],
    },
    {
      label: "Plantel Norte",
      children: [
        { label: "Matutino", value: 610 },
        { label: "Vespertino", value: 430 },
      ],
    },
    {
      label: "Plantel Sur",
      children: [
        { label: "Matutino", value: 470 },
        { label: "Vespertino", value: 380 },
      ],
    },
  ],
};

const gasto: IcicleNode = {
  label: "Gasto familiar",
  children: [
    {
      label: "Alimentos",
      children: [
        { label: "Mercado", value: 4200 },
        { label: "Fonditas", value: 1800 },
      ],
    },
    {
      label: "Vivienda",
      children: [
        {
          label: "Renta",
          value: 5000,
          children: [
            { label: "Mensualidad", value: 4500 },
            { label: "Mantenimiento", value: 500 },
          ],
        },
        { label: "Servicios", value: 1200 },
      ],
    },
  ],
};

const cosecha: IcicleNode = {
  label: "Cosecha",
  children: [
    {
      label: "Maíz",
      children: [
        { label: "Temporal", value: 12400 },
        { label: "Riego", value: 8600 },
      ],
    },
    {
      label: "Frijol",
      children: [
        { label: "Temporal", value: 3200 },
        { label: "Riego", value: 1500 },
      ],
    },
    {
      label: "Agave",
      children: [{ label: "Riego", value: 9800 }],
    },
  ],
};

const estresRaiz: IcicleNode = {
  label: "Matrícula estatal",
  children: [
    {
      label: "Plantel Centro",
      children: [
        { label: "Matutino primero", value: 820 },
        { label: "Matutino segundo", value: 610 },
        { label: "Vespertino primero", value: 540 },
        { label: "Vespertino segundo", value: 430 },
        { label: "Nocturno", value: 180 },
        { label: "Sabatino", value: 60 },
      ],
    },
    {
      label: "Plantel Norte",
      children: [
        { label: "Matutino primero", value: 740 },
        { label: "Matutino segundo", value: 560 },
        { label: "Vespertino primero", value: 470 },
        { label: "Vespertino segundo", value: 380 },
        { label: "Nocturno", value: 150 },
        { label: "Sabatino", value: 45 },
      ],
    },
    {
      label: "Plantel Sur",
      children: [
        { label: "Matutino primero", value: 690 },
        { label: "Matutino segundo", value: 520 },
        { label: "Vespertino primero", value: 440 },
        { label: "Vespertino segundo", value: 350 },
        { label: "Nocturno", value: 130 },
        { label: "Sabatino", value: 38 },
      ],
    },
    {
      label: "Plantel Oriente conurbado",
      children: [
        { label: "Matutino primero", value: 650 },
        { label: "Matutino segundo", value: 480 },
        { label: "Vespertino primero", value: 410 },
        { label: "Vespertino segundo", value: 320 },
        { label: "Nocturno", value: 110 },
        { label: "Sabatino", value: 30 },
      ],
    },
    {
      label: "Plantel Poniente",
      children: [
        { label: "Matutino primero", value: 600 },
        { label: "Matutino segundo", value: 450 },
        { label: "Vespertino primero", value: 380 },
        { label: "Vespertino segundo", value: 290 },
        { label: "Nocturno", value: 95 },
        { label: "Sabatino", value: 22 },
      ],
    },
    {
      label: "Planteles rurales",
      children: [
        {
          label: "Sierra",
          children: [
            { label: "Matutino", value: 210 },
            { label: "Vespertino", value: 140 },
            { label: "Sabatino", value: 35 },
          ],
        },
        {
          label: "Costa",
          children: [
            { label: "Matutino", value: 190 },
            { label: "Vespertino", value: 120 },
            { label: "Sabatino", value: 28 },
          ],
        },
      ],
    },
  ],
};

export default function IcicleChartExamples() {
  return (
    <div className="flex flex-col gap-6">
      <DemoExample
        caption="Dos niveles con separación amplia entre bandas"
        code={`import type { IcicleNode } from "@carlos-burelo/klin";
import { IcicleChart } from "@carlos-burelo/klin";

const matricula: IcicleNode = {
  label: "Matrícula",
  children: [
    {
      label: "Plantel Centro",
      children: [
        { label: "Matutino", value: 820 },
        { label: "Vespertino", value: 540 },
      ],
    },
    {
      label: "Plantel Norte",
      children: [
        { label: "Matutino", value: 610 },
        { label: "Vespertino", value: 430 },
      ],
    },
    {
      label: "Plantel Sur",
      children: [
        { label: "Matutino", value: 470 },
        { label: "Vespertino", value: 380 },
      ],
    },
  ],
};

<IcicleChart
  root={matricula}
  ariaLabel="Matrícula por plantel y turno: el plantel Centro concentra más estudiantes y el matutino domina en los tres"
  gap={6}
/>`}
      >
        <IcicleChart
          root={matricula}
          gap={6}
          ariaLabel="Matrícula por plantel y turno: el plantel Centro concentra más estudiantes y el matutino domina en los tres"
        />
      </DemoExample>
      <DemoExample
        caption="Tres niveles con formato moneda"
        code={`import type { IcicleNode } from "@carlos-burelo/klin";
import { IcicleChart } from "@carlos-burelo/klin";

const gasto: IcicleNode = {
  label: "Gasto familiar",
  children: [
    {
      label: "Alimentos",
      children: [
        { label: "Mercado", value: 4200 },
        { label: "Fonditas", value: 1800 },
      ],
    },
    {
      label: "Vivienda",
      children: [
        {
          label: "Renta",
          value: 5000,
          children: [
            { label: "Mensualidad", value: 4500 },
            { label: "Mantenimiento", value: 500 },
          ],
        },
        { label: "Servicios", value: 1200 },
      ],
    },
  ],
};

<IcicleChart
  root={gasto}
  format={(v) =>
    new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
      maximumFractionDigits: 0,
    }).format(v)
  }
  ariaLabel="Gasto familiar mensual por rubro en pesos: la vivienda supera a los alimentos y la renta es el gasto más grande"
/>`}
      >
        <IcicleChart
          root={gasto}
          format={(v) =>
            new Intl.NumberFormat("es-MX", {
              style: "currency",
              currency: "MXN",
              maximumFractionDigits: 0,
            }).format(v)
          }
          ariaLabel="Gasto familiar mensual por rubro en pesos: la vivienda supera a los alimentos y la renta es el gasto más grande"
        />
      </DemoExample>
      <DemoExample
        caption="Rama dominante en toneladas"
        code={`import type { IcicleNode } from "@carlos-burelo/klin";
import { IcicleChart } from "@carlos-burelo/klin";

const cosecha: IcicleNode = {
  label: "Cosecha",
  children: [
    {
      label: "Maíz",
      children: [
        { label: "Temporal", value: 12400 },
        { label: "Riego", value: 8600 },
      ],
    },
    {
      label: "Frijol",
      children: [
        { label: "Temporal", value: 3200 },
        { label: "Riego", value: 1500 },
      ],
    },
    {
      label: "Agave",
      children: [{ label: "Riego", value: 9800 }],
    },
  ],
};

<IcicleChart
  root={cosecha}
  format={(v) => \`\${v} t\`}
  ariaLabel="Cosecha por cultivo y ciclo en toneladas: el maíz de temporal es la banda más grande y el frijol de riego la más pequeña"
/>`}
      >
        <IcicleChart
          root={cosecha}
          format={(v) => `${v} t`}
          ariaLabel="Cosecha por cultivo y ciclo en toneladas: el maíz de temporal es la banda más grande y el frijol de riego la más pequeña"
        />
      </DemoExample>
      <DemoExample
        caption="Estrés: 3 niveles con 36 bandas, varias mínimas y un nombre largo"
        code={`import type { IcicleNode } from "@carlos-burelo/klin";
import { IcicleChart } from "@carlos-burelo/klin";

const estresRaiz: IcicleNode = {
  label: "Matrícula estatal",
  children: [
    {
      label: "Plantel Centro",
      children: [
        { label: "Matutino primero", value: 820 },
        { label: "Matutino segundo", value: 610 },
        { label: "Vespertino primero", value: 540 },
        { label: "Vespertino segundo", value: 430 },
        { label: "Nocturno", value: 180 },
        { label: "Sabatino", value: 60 },
      ],
    },
    {
      label: "Plantel Norte",
      children: [
        { label: "Matutino primero", value: 740 },
        { label: "Matutino segundo", value: 560 },
        { label: "Vespertino primero", value: 470 },
        { label: "Vespertino segundo", value: 380 },
        { label: "Nocturno", value: 150 },
        { label: "Sabatino", value: 45 },
      ],
    },
    {
      label: "Plantel Sur",
      children: [
        { label: "Matutino primero", value: 690 },
        { label: "Matutino segundo", value: 520 },
        { label: "Vespertino primero", value: 440 },
        { label: "Vespertino segundo", value: 350 },
        { label: "Nocturno", value: 130 },
        { label: "Sabatino", value: 38 },
      ],
    },
    {
      label: "Plantel Oriente conurbado",
      children: [
        { label: "Matutino primero", value: 650 },
        { label: "Matutino segundo", value: 480 },
        { label: "Vespertino primero", value: 410 },
        { label: "Vespertino segundo", value: 320 },
        { label: "Nocturno", value: 110 },
        { label: "Sabatino", value: 30 },
      ],
    },
    {
      label: "Plantel Poniente",
      children: [
        { label: "Matutino primero", value: 600 },
        { label: "Matutino segundo", value: 450 },
        { label: "Vespertino primero", value: 380 },
        { label: "Vespertino segundo", value: 290 },
        { label: "Nocturno", value: 95 },
        { label: "Sabatino", value: 22 },
      ],
    },
    {
      label: "Planteles rurales",
      children: [
        {
          label: "Sierra",
          children: [
            { label: "Matutino", value: 210 },
            { label: "Vespertino", value: 140 },
            { label: "Sabatino", value: 35 },
          ],
        },
        {
          label: "Costa",
          children: [
            { label: "Matutino", value: 190 },
            { label: "Vespertino", value: 120 },
            { label: "Sabatino", value: 28 },
          ],
        },
      ],
    },
  ],
};

<IcicleChart
  root={estresRaiz}
  format={(v) => \`\${v} alumnos\`}
  ariaLabel="Matrícula estatal por plantel y turno con 36 bandas: el Centro concentra más y el sabatino rural es la banda más pequeña"
/>`}
      >
        <IcicleChart
          root={estresRaiz}
          format={(v) => `${v} alumnos`}
          ariaLabel="Matrícula estatal por plantel y turno con 36 bandas: el Centro concentra más y el sabatino rural es la banda más pequeña"
        />
      </DemoExample>
    </div>
  );
}
