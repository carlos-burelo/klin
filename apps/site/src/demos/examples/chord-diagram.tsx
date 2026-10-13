import { ChordDiagram } from "@carlos-burelo/klin";
import { DemoExample } from "../../components/docs/demo-example";

const gruposMigracion = ["CDMX", "Guadalajara", "Monterrey", "Puebla"];

const matrizMigracion = [
  [0, 320, 410, 150],
  [280, 0, 150, 120],
  [390, 140, 0, 180],
  [130, 110, 170, 0],
];

const gruposComercio = ["México", "Colombia", "Chile"];

const matrizComercio = [
  [0, 1250, 980],
  [1100, 0, 640],
  [870, 590, 0],
];

const gruposRemesas = ["CDMX", "Bogotá", "Lima", "Quito"];

const matrizRemesas = [
  [0, 42, 35, 28],
  [38, 0, 22, 18],
  [31, 20, 0, 25],
  [26, 16, 23, 0],
];

export default function ChordDiagramExamples() {
  return (
    <div className="flex flex-col gap-6">
      <DemoExample
        caption="flujos migratorios con leyenda"
        code={`import { ChordDiagram } from "@carlos-burelo/klin";

const gruposMigracion = ["CDMX", "Guadalajara", "Monterrey", "Puebla"];

const matrizMigracion = [
  [0, 320, 410, 150],
  [280, 0, 150, 120],
  [390, 140, 0, 180],
  [130, 110, 170, 0],
];

<ChordDiagram
  labels={gruposMigracion}
  matrix={matrizMigracion}
  ariaLabel="Migración entre CDMX, Guadalajara, Monterrey y Puebla"
/>`}
      >
        <ChordDiagram
          labels={gruposMigracion}
          matrix={matrizMigracion}
          ariaLabel="Migración entre CDMX, Guadalajara, Monterrey y Puebla"
        />
      </DemoExample>
      <DemoExample
        caption="comercio con formato de miles y sin leyenda"
        code={`import { ChordDiagram } from "@carlos-burelo/klin";

const gruposComercio = ["México", "Colombia", "Chile"];

const matrizComercio = [
  [0, 1250, 980],
  [1100, 0, 640],
  [870, 590, 0],
];

<ChordDiagram
  labels={gruposComercio}
  matrix={matrizComercio}
  format={(v) => new Intl.NumberFormat("es-MX").format(v)}
  showLegend={false}
  ariaLabel="Comercio entre México, Colombia y Chile en millones de dólares"
/>`}
      >
        <ChordDiagram
          labels={gruposComercio}
          matrix={matrizComercio}
          format={(v) => new Intl.NumberFormat("es-MX").format(v)}
          showLegend={false}
          ariaLabel="Comercio entre México, Colombia y Chile en millones de dólares"
        />
      </DemoExample>
      <DemoExample
        caption="remesas con formato de miles de dólares"
        code={`import { ChordDiagram } from "@carlos-burelo/klin";

const gruposRemesas = ["CDMX", "Bogotá", "Lima", "Quito"];

const matrizRemesas = [
  [0, 42, 35, 28],
  [38, 0, 22, 18],
  [31, 20, 0, 25],
  [26, 16, 23, 0],
];

<ChordDiagram
  labels={gruposRemesas}
  matrix={matrizRemesas}
  format={(v: number) => \`\${v} mil USD\`}
  ariaLabel="Remesas entre CDMX, Bogotá, Lima y Quito en miles de dólares"
/>`}
      >
        <ChordDiagram
          labels={gruposRemesas}
          matrix={matrizRemesas}
          format={(v: number) => `${v} mil USD`}
          ariaLabel="Remesas entre CDMX, Bogotá, Lima y Quito en miles de dólares"
        />
      </DemoExample>
    </div>
  );
}
