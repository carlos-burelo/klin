import type { CirclePackNode } from "@carlos-burelo/klin";
import { CirclePackChart } from "@carlos-burelo/klin";
import { DemoExample } from "../../components/docs/demo-example";

const arbolado: CirclePackNode = {
  label: "Arbolado",
  children: [
    {
      label: "Chapultepec",
      children: [
        { label: "Ahuehuete", value: 1200 },
        { label: "Fresno", value: 3400 },
        { label: "Jacaranda", value: 2100 },
      ],
    },
    {
      label: "Viveros",
      children: [
        { label: "Fresno", value: 1800 },
        { label: "Trueno", value: 1500 },
      ],
    },
  ],
};

const ventas: CirclePackNode = {
  label: "Ventas",
  children: [
    {
      label: "Occidente",
      children: [
        { label: "Guadalajara", value: 860000 },
        { label: "Zapopan", value: 540000 },
      ],
    },
    {
      label: "Centro",
      children: [
        { label: "CDMX", value: 1200000 },
        { label: "Puebla", value: 480000 },
      ],
    },
    {
      label: "Norte",
      children: [{ label: "Monterrey", value: 950000 }],
    },
  ],
};

const biblioteca: CirclePackNode = {
  label: "Biblioteca",
  children: [
    {
      label: "Novela",
      children: [
        {
          label: "Rulfo",
          children: [
            { label: "Pedro Páramo", value: 320 },
            { label: "El Llano en llamas", value: 280 },
          ],
        },
        { label: "Esquivel", value: 410 },
      ],
    },
    {
      label: "Poesía",
      children: [
        { label: "Paz", value: 350 },
        { label: "Sabines", value: 260 },
      ],
    },
  ],
};

function moneda(value: number): string {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 0,
  }).format(value);
}

const zonasPack = [
  "Norte",
  "Sur",
  "Este",
  "Oeste",
  "Centro",
  "Noreste",
  "Suroeste",
];

const estresPack: CirclePackNode = {
  label: "Arbolado",
  children: zonasPack.map((zona, zi) => ({
    label: zona,
    children: Array.from({ length: 7 }, (_, i) => ({
      label: `${zona} ${i + 1}`,
      value: 120 + ((zi * 41 + i * 67) % 480),
    })),
  })),
};

export default function CirclePackChartExamples() {
  return (
    <div className="flex flex-col gap-6">
      <DemoExample
        caption="Dos niveles con formato por defecto"
        code={`import type { CirclePackNode } from "@carlos-burelo/klin";
import { CirclePackChart } from "@carlos-burelo/klin";

const arbolado: CirclePackNode = {
  label: "Arbolado",
  children: [
    {
      label: "Chapultepec",
      children: [
        { label: "Ahuehuete", value: 1200 },
        { label: "Fresno", value: 3400 },
        { label: "Jacaranda", value: 2100 },
      ],
    },
    {
      label: "Viveros",
      children: [
        { label: "Fresno", value: 1800 },
        { label: "Trueno", value: 1500 },
      ],
    },
  ],
};

<CirclePackChart
  root={arbolado}
  ariaLabel="Arbolado por parque y especie: Chapultepec concentra la mayoría y el fresno es la especie dominante"
/>`}
      >
        <CirclePackChart
          root={arbolado}
          ariaLabel="Arbolado por parque y especie: Chapultepec concentra la mayoría y el fresno es la especie dominante"
        />
      </DemoExample>
      <DemoExample
        caption="Tres regiones con formato moneda"
        code={`import type { CirclePackNode } from "@carlos-burelo/klin";
import { CirclePackChart } from "@carlos-burelo/klin";

const ventas: CirclePackNode = {
  label: "Ventas",
  children: [
    {
      label: "Occidente",
      children: [
        { label: "Guadalajara", value: 860000 },
        { label: "Zapopan", value: 540000 },
      ],
    },
    {
      label: "Centro",
      children: [
        { label: "CDMX", value: 1200000 },
        { label: "Puebla", value: 480000 },
      ],
    },
    {
      label: "Norte",
      children: [{ label: "Monterrey", value: 950000 }],
    },
  ],
};

function moneda(value: number): string {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 0,
  }).format(value);
}

<CirclePackChart
  root={ventas}
  format={moneda}
  ariaLabel="Ventas por región y sucursal en pesos: la región Centro lidera gracias a CDMX y Puebla es la sucursal más pequeña"
/>`}
      >
        <CirclePackChart
          root={ventas}
          format={moneda}
          ariaLabel="Ventas por región y sucursal en pesos: la región Centro lidera gracias a CDMX y Puebla es la sucursal más pequeña"
        />
      </DemoExample>
      <DemoExample
        caption="Tres niveles de género a título"
        code={`import type { CirclePackNode } from "@carlos-burelo/klin";
import { CirclePackChart } from "@carlos-burelo/klin";

const biblioteca: CirclePackNode = {
  label: "Biblioteca",
  children: [
    {
      label: "Novela",
      children: [
        {
          label: "Rulfo",
          children: [
            { label: "Pedro Páramo", value: 320 },
            { label: "El Llano en llamas", value: 280 },
          ],
        },
        { label: "Esquivel", value: 410 },
      ],
    },
    {
      label: "Poesía",
      children: [
        { label: "Paz", value: 350 },
        { label: "Sabines", value: 260 },
      ],
    },
  ],
};

<CirclePackChart
  root={biblioteca}
  format={(v) => \`\${v} préstamos\`}
  ariaLabel="Préstamos por género, autor y título: la novela supera a la poesía y Rulfo es el autor más prestado"
/>`}
      >
        <CirclePackChart
          root={biblioteca}
          format={(v) => `${v} préstamos`}
          ariaLabel="Préstamos por género, autor y título: la novela supera a la poesía y Rulfo es el autor más prestado"
        />
      </DemoExample>
      <DemoExample
        caption="Relleno amplio entre burbujas"
        code={`import type { CirclePackNode } from "@carlos-burelo/klin";
import { CirclePackChart } from "@carlos-burelo/klin";

const arbolado: CirclePackNode = {
  label: "Arbolado",
  children: [
    {
      label: "Chapultepec",
      children: [
        { label: "Ahuehuete", value: 1200 },
        { label: "Fresno", value: 3400 },
        { label: "Jacaranda", value: 2100 },
      ],
    },
    {
      label: "Viveros",
      children: [
        { label: "Fresno", value: 1800 },
        { label: "Trueno", value: 1500 },
      ],
    },
  ],
};

<CirclePackChart
  root={arbolado}
  padding={12}
  ariaLabel="Arbolado con relleno amplio entre burbujas"
/>`}
      >
        <CirclePackChart
          root={arbolado}
          padding={12}
          ariaLabel="Arbolado con relleno amplio entre burbujas"
        />
      </DemoExample>
      <DemoExample
        caption="Estrés: 49 burbujas en 7 zonas con valores deterministas"
        code={`import type { CirclePackNode } from "@carlos-burelo/klin";
import { CirclePackChart } from "@carlos-burelo/klin";

const zonasPack = [
  "Norte",
  "Sur",
  "Este",
  "Oeste",
  "Centro",
  "Noreste",
  "Suroeste",
];

const estresPack: CirclePackNode = {
  label: "Arbolado",
  children: zonasPack.map((zona, zi) => ({
    label: zona,
    children: Array.from({ length: 7 }, (_, i) => ({
      label: \`\${zona} \${i + 1}\`,
      value: 120 + ((zi * 41 + i * 67) % 480),
    })),
  })),
};

<CirclePackChart
  root={estresPack}
  format={(v) => \`\${v} árboles\`}
  ariaLabel="Arbolado por zona y sector con 49 burbujas: los valores siguen una serie aritmética determinista"
/>`}
      >
        <CirclePackChart
          root={estresPack}
          format={(v) => `${v} árboles`}
          ariaLabel="Arbolado por zona y sector con 49 burbujas: los valores siguen una serie aritmética determinista"
        />
      </DemoExample>
    </div>
  );
}
