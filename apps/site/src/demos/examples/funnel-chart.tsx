import { FunnelChart } from "@carlos-burelo/klin";
import { DemoExample } from "../../components/docs/demo-example";

export default function FunnelChartExamples() {
  return (
    <div className="flex flex-col gap-6">
      <DemoExample
        caption="Embudo largo de visitas a compras"
        code={`import { FunnelChart } from "@carlos-burelo/klin";

const stages = [
  { label: "Visitas", value: 1200 },
  { label: "Registro", value: 640 },
  { label: "Carrito", value: 320 },
  { label: "Pago", value: 180 },
  { label: "Compra", value: 96 },
];

<FunnelChart
  ariaLabel="Embudo de conversión de visitas a compras en tienda"
  stages={stages}
/>`}
      >
        <FunnelChart
          ariaLabel="Embudo de conversión de visitas a compras en tienda"
          stages={[
            { label: "Visitas", value: 1200 },
            { label: "Registro", value: 640 },
            { label: "Carrito", value: 320 },
            { label: "Pago", value: 180 },
            { label: "Compra", value: 96 },
          ]}
        />
      </DemoExample>
      <DemoExample
        caption="Proceso corto de contratación con formato de miles"
        code={`import { FunnelChart } from "@carlos-burelo/klin";

const stages = [
  { label: "Postulaciones", value: 240 },
  { label: "Entrevistas", value: 96 },
  { label: "Contrataciones", value: 24 },
];

<FunnelChart
  ariaLabel="Embudo corto de postulaciones a contrataciones"
  height={220}
  format={(v: number) =>
    \`\${new Intl.NumberFormat("es-MX").format(v)} personas\`
  }
  stages={stages}
/>`}
      >
        <FunnelChart
          ariaLabel="Embudo corto de postulaciones a contrataciones"
          height={220}
          format={(v: number) =>
            `${new Intl.NumberFormat("es-MX").format(v)} personas`
          }
          stages={[
            { label: "Postulaciones", value: 240 },
            { label: "Entrevistas", value: 96 },
            { label: "Contrataciones", value: 24 },
          ]}
        />
      </DemoExample>
      <DemoExample
        caption="Curso con poca caída entre niveles"
        code={`import { FunnelChart } from "@carlos-burelo/klin";

const stages = [
  { label: "Inscritos", value: 120 },
  { label: "Activos", value: 112 },
  { label: "Evaluados", value: 104 },
  { label: "Acreditados", value: 98 },
];

<FunnelChart
  ariaLabel="Embudo de curso con poca pérdida entre inscritos y acreditados"
  format={(v: number) => \`\${v} alumnos\`}
  stages={stages}
/>`}
      >
        <FunnelChart
          ariaLabel="Embudo de curso con poca pérdida entre inscritos y acreditados"
          format={(v: number) => `${v} alumnos`}
          stages={[
            { label: "Inscritos", value: 120 },
            { label: "Activos", value: 112 },
            { label: "Evaluados", value: 104 },
            { label: "Acreditados", value: 98 },
          ]}
        />
      </DemoExample>
      <DemoExample
        caption="Embudo con leyenda de etapas"
        code={`import { FunnelChart } from "@carlos-burelo/klin";

const stages = [
  { label: "Visitas", value: 1200 },
  { label: "Registro", value: 640 },
  { label: "Carrito", value: 320 },
  { label: "Pago", value: 180 },
  { label: "Compra", value: 96 },
];

<FunnelChart
  ariaLabel="Embudo de conversión de visitas a compras con leyenda de etapas"
  showLegend
  stages={stages}
/>`}
      >
        <FunnelChart
          ariaLabel="Embudo de conversión de visitas a compras con leyenda de etapas"
          showLegend
          stages={[
            { label: "Visitas", value: 1200 },
            { label: "Registro", value: 640 },
            { label: "Carrito", value: 320 },
            { label: "Pago", value: 180 },
            { label: "Compra", value: 96 },
          ]}
        />
      </DemoExample>
      <DemoExample
        caption="Estrés: 8 etapas con cola fina, un nombre largo y pérdida entre etapas"
        code={`import { FunnelChart } from "@carlos-burelo/klin";

const stages = [
  { label: "Visitas", value: 2400 },
  { label: "Registro", value: 1250 },
  { label: "Interés en catálogo", value: 820 },
  { label: "Carrito", value: 460 },
  { label: "Cupón aplicado", value: 310 },
  { label: "Pago iniciado", value: 190 },
  { label: "Pago confirmado", value: 120 },
  { label: "Compra con factura y garantía extendida", value: 64 },
];

<FunnelChart
  ariaLabel="Embudo de ocho etapas de visitas a compras con cola fina"
  showDropOff
  baseline="previous"
  format={(v: number) => \`\${v} personas\`}
  stages={stages}
/>`}
      >
        <FunnelChart
          ariaLabel="Embudo de ocho etapas de visitas a compras con cola fina"
          showDropOff
          baseline="previous"
          format={(v: number) => `${v} personas`}
          stages={[
            { label: "Visitas", value: 2400 },
            { label: "Registro", value: 1250 },
            { label: "Interés en catálogo", value: 820 },
            { label: "Carrito", value: 460 },
            { label: "Cupón aplicado", value: 310 },
            { label: "Pago iniciado", value: 190 },
            { label: "Pago confirmado", value: 120 },
            { label: "Compra con factura y garantía extendida", value: 64 },
          ]}
        />
      </DemoExample>
    </div>
  );
}
