import { DumbbellChart } from "@carlos-burelo/klin";
import { DemoExample } from "../../components/docs/demo-example";

export default function DumbbellChartExamples() {
  return (
    <div className="flex flex-col gap-6">
      <DemoExample
        caption="Dos precios por ciudad con leyenda"
        code={`import { DumbbellChart } from "@carlos-burelo/klin";

const data = [
  { ciudad: "Tijuana", magna: 23.6, premium: 25.9 },
  { ciudad: "Cancún", magna: 23.9, premium: 26.1 },
  { ciudad: "Oaxaca", magna: 23.2, premium: 25.2 },
  { ciudad: "León", magna: 22.85, premium: 24.7 },
];

<DumbbellChart
  ariaLabel="Precio por litro de Magna y Premium por ciudad, con la brecha más amplia en Cancún"
  data={data}
  categoryKey="ciudad"
  aKey="magna"
  bKey="premium"
  aLabel="Magna"
  bLabel="Premium"
  formatX={(v: number) => \`$\${v.toFixed(2)}\`}
/>`}
      >
        <DumbbellChart
          ariaLabel="Precio por litro de Magna y Premium por ciudad, con la brecha más amplia en Cancún"
          data={[
            { ciudad: "Tijuana", magna: 23.6, premium: 25.9 },
            { ciudad: "Cancún", magna: 23.9, premium: 26.1 },
            { ciudad: "Oaxaca", magna: 23.2, premium: 25.2 },
            { ciudad: "León", magna: 22.85, premium: 24.7 },
          ]}
          categoryKey="ciudad"
          aKey="magna"
          bKey="premium"
          aLabel="Magna"
          bLabel="Premium"
          formatX={(v: number) => `$${v.toFixed(2)}`}
        />
      </DemoExample>
      <DemoExample
        caption="Matrícula antes y después con meta anotada"
        code={`import { DumbbellChart } from "@carlos-burelo/klin";

const data = [
  { facultad: "Ingeniería", antes: 420, despues: 510 },
  { facultad: "Medicina", antes: 380, despues: 460 },
  { facultad: "Derecho", antes: 540, despues: 530 },
  { facultad: "Arquitectura", antes: 290, despues: 350 },
];

<DumbbellChart
  ariaLabel="Matrícula 2023 frente a 2024 por facultad de la UNAM con meta de 500 y mayor avance en Ingeniería"
  data={data}
  categoryKey="facultad"
  aKey="antes"
  bKey="despues"
  aLabel="2023"
  bLabel="2024"
  formatX={(v: number) => \`\${v} alumnos\`}
  annotations={[{ value: 500, label: "Meta" }]}
/>`}
      >
        <DumbbellChart
          ariaLabel="Matrícula 2023 frente a 2024 por facultad de la UNAM con meta de 500 y mayor avance en Ingeniería"
          data={[
            { facultad: "Ingeniería", antes: 420, despues: 510 },
            { facultad: "Medicina", antes: 380, despues: 460 },
            { facultad: "Derecho", antes: 540, despues: 530 },
            { facultad: "Arquitectura", antes: 290, despues: 350 },
          ]}
          categoryKey="facultad"
          aKey="antes"
          bKey="despues"
          aLabel="2023"
          bLabel="2024"
          formatX={(v: number) => `${v} alumnos`}
          annotations={[{ value: 500, label: "Meta" }]}
        />
      </DemoExample>
      <DemoExample
        caption="Tiempos de traslado antes y después de obra, sin leyenda"
        code={`import { DumbbellChart } from "@carlos-burelo/klin";

const data = [
  { ruta: "Indios Verdes", antes: 68, despues: 45 },
  { ruta: "Pantitlán", antes: 55, despues: 40 },
  { ruta: "Tacubaya", antes: 48, despues: 42 },
];

<DumbbellChart
  ariaLabel="Minutos de traslado antes y después de la obra por ruta del Metrobús, con el mayor ahorro en Indios Verdes"
  data={data}
  categoryKey="ruta"
  aKey="antes"
  bKey="despues"
  aLabel="Antes"
  bLabel="Después"
  formatX={(v: number) => \`\${v} min\`}
  showLegend={false}
/>`}
      >
        <DumbbellChart
          ariaLabel="Minutos de traslado antes y después de la obra por ruta del Metrobús, con el mayor ahorro en Indios Verdes"
          data={[
            { ruta: "Indios Verdes", antes: 68, despues: 45 },
            { ruta: "Pantitlán", antes: 55, despues: 40 },
            { ruta: "Tacubaya", antes: 48, despues: 42 },
          ]}
          categoryKey="ruta"
          aKey="antes"
          bKey="despues"
          aLabel="Antes"
          bLabel="Después"
          formatX={(v: number) => `${v} min`}
          showLegend={false}
        />
      </DemoExample>
    </div>
  );
}
