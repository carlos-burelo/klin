import { ChartEmpty } from "@carlos-burelo/klin";
import { DemoExample } from "../../components/docs/demo-example";

export default function ChartEmptyExamples() {
  return (
    <div className="flex flex-col gap-6">
      <DemoExample
        caption="estado por defecto sin props"
        code={`import { ChartEmpty } from "@carlos-burelo/klin";

<ChartEmpty />`}
      >
        <ChartEmpty />
      </DemoExample>
      <DemoExample
        caption="título propio con descripción de ayuda"
        code={`import { ChartEmpty } from "@carlos-burelo/klin";

<ChartEmpty
  title="Sin ventas todavía"
  description="Cuando registres tu primera venta, aquí verás el resumen."
/>`}
      >
        <ChartEmpty
          title="Sin ventas todavía"
          description="Cuando registres tu primera venta, aquí verás el resumen."
        />
      </DemoExample>
      <DemoExample
        caption="título propio sin descripción"
        code={`import { ChartEmpty } from "@carlos-burelo/klin";

<ChartEmpty title="Sin citas programadas" />`}
      >
        <ChartEmpty title="Sin citas programadas" />
      </DemoExample>
    </div>
  );
}
