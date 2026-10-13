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
    </div>
  );
}
