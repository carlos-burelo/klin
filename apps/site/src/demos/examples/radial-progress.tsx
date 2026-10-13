import { RadialProgress } from "@carlos-burelo/klin";
import { DemoExample } from "../../components/docs/demo-example";

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
        caption="anillo grueso con color y formato personalizados"
        code={`import { RadialProgress } from "@carlos-burelo/klin";

<RadialProgress
  value={82}
  label="Meta anual"
  thickness={26}
  color="var(--chart-2)"
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
    </div>
  );
}
