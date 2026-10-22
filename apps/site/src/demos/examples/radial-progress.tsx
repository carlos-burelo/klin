import { RadialProgress } from "@carlos-burelo/klin";
import { DemoExample } from "../../components/docs/demo-example";

const anillosEstres = [
  { label: "Agua", value: 2 },
  { label: "Luz", value: 17 },
  { label: "Drenaje", value: 34 },
  { label: "Internet", value: 48 },
  { label: "Parques", value: 63 },
  { label: "Bacheo", value: 77 },
  { label: "Alumbrado", value: 89 },
  { label: "Programa de reforestación municipal 2026", value: 100 },
];

export default function RadialProgressExamples() {
  return (
    <div className="flex flex-col gap-6">
      <DemoExample
        caption="avance típico con etiqueta"
        code={`import { RadialProgress } from "@carlos-burelo/klin";

<RadialProgress
  value={68}
  label="Inscripciones"
  ariaLabel="Avance de inscripciones al 68 por ciento"
/>`}
      >
        <div className="flex justify-center">
          <RadialProgress
            value={68}
            label="Inscripciones"
            ariaLabel="Avance de inscripciones al 68 por ciento"
          />
        </div>
      </DemoExample>
      <DemoExample
        caption="anillo grueso con color, inicio a la derecha y formato personalizado"
        code={`import { RadialProgress } from "@carlos-burelo/klin";

<RadialProgress
  value={82}
  label="Meta anual"
  thickness={26}
  color="var(--chart-2)"
  startAngle={Math.PI / 2}
  format={(v) => \`\${v} / 100\`}
  ariaLabel="Meta anual con 82 de 100 puntos"
/>`}
      >
        <div className="flex justify-center">
          <RadialProgress
            value={82}
            label="Meta anual"
            thickness={26}
            color="var(--chart-2)"
            startAngle={Math.PI / 2}
            format={(v) => `${v} / 100`}
            ariaLabel="Meta anual con 82 de 100 puntos"
          />
        </div>
      </DemoExample>
      <DemoExample
        caption="valor bajo sin etiqueta y pista personalizada"
        code={`import { RadialProgress } from "@carlos-burelo/klin";

<RadialProgress
  value={7}
  thickness={10}
  trackColor="var(--muted)"
  format={(v) => \`\${v}% crítico\`}
  ariaLabel="Nivel de batería crítico al 7 por ciento"
/>`}
      >
        <div className="flex justify-center">
          <RadialProgress
            value={7}
            thickness={10}
            trackColor="var(--muted)"
            format={(v) => `${v}% crítico`}
            ariaLabel="Nivel de batería crítico al 7 por ciento"
          />
        </div>
      </DemoExample>
      <DemoExample
        caption="Estrés: 8 anillos con extremos en 2 y 100 y un nombre largo"
        code={`import { RadialProgress } from "@carlos-burelo/klin";

const anillosEstres = [
  { label: "Agua", value: 2 },
  { label: "Luz", value: 17 },
  { label: "Drenaje", value: 34 },
  { label: "Internet", value: 48 },
  { label: "Parques", value: 63 },
  { label: "Bacheo", value: 77 },
  { label: "Alumbrado", value: 89 },
  { label: "Programa de reforestación municipal 2026", value: 100 },
];

<div className="flex flex-wrap justify-center gap-4">
  {anillosEstres.map((anillo) => (
    <RadialProgress
      key={anillo.label}
      value={anillo.value}
      label={anillo.label}
      ariaLabel={\`Avance de \${anillo.label}\`}
    />
  ))}
</div>`}
      >
        <div className="flex flex-wrap justify-center gap-4">
          {anillosEstres.map((anillo) => (
            <RadialProgress
              key={anillo.label}
              value={anillo.value}
              label={anillo.label}
              ariaLabel={`Avance de ${anillo.label}`}
            />
          ))}
        </div>
      </DemoExample>
    </div>
  );
}
