import { DotPlot } from "@carlos-burelo/klin";
import { DemoExample } from "../../components/docs/demo-example";

export default function DotPlotExamples() {
  return (
    <div className="flex flex-col gap-6">
      <DemoExample
        caption="Traslados al trabajo en minutos"
        code={`import { DotPlot } from "@carlos-burelo/klin";

const data = [
  { ciudad: "CDMX", minutos: 58 },
  { ciudad: "Monterrey", minutos: 45 },
  { ciudad: "Guadalajara", minutos: 42 },
  { ciudad: "Puebla", minutos: 38 },
  { ciudad: "Mérida", minutos: 30 },
];

<DotPlot
  ariaLabel="Traslados al trabajo por ciudad, la CDMX casi duplica a Mérida"
  data={data}
  categoryKey="ciudad"
  valueKey="minutos"
  format={(v: number) => \`\${v} min\`}
/>`}
      >
        <DotPlot
          ariaLabel="Traslados al trabajo por ciudad, la CDMX casi duplica a Mérida"
          data={[
            { ciudad: "CDMX", minutos: 58 },
            { ciudad: "Monterrey", minutos: 45 },
            { ciudad: "Guadalajara", minutos: 42 },
            { ciudad: "Puebla", minutos: 38 },
            { ciudad: "Mérida", minutos: 30 },
          ]}
          categoryKey="ciudad"
          valueKey="minutos"
          format={(v: number) => `${v} min`}
        />
      </DemoExample>
      <DemoExample
        caption="Utilidad con negativos y línea de meta anotada"
        code={`import { DotPlot } from "@carlos-burelo/klin";

const data = [
  { sucursal: "Centro", utilidad: 80 },
  { sucursal: "Norte", utilidad: 45 },
  { sucursal: "Sur", utilidad: -10 },
  { sucursal: "Oriente", utilidad: -25 },
  { sucursal: "Poniente", utilidad: 60 },
];

<DotPlot
  ariaLabel="Utilidad por sucursal con dos en pérdida y meta de 50 mil"
  data={data}
  categoryKey="sucursal"
  valueKey="utilidad"
  format={(v: number) => \`\${v} mil\`}
  annotations={[{ value: 50, label: "Meta" }]}
/>`}
      >
        <DotPlot
          ariaLabel="Utilidad por sucursal con dos en pérdida y meta de 50 mil"
          data={[
            { sucursal: "Centro", utilidad: 80 },
            { sucursal: "Norte", utilidad: 45 },
            { sucursal: "Sur", utilidad: -10 },
            { sucursal: "Oriente", utilidad: -25 },
            { sucursal: "Poniente", utilidad: 60 },
          ]}
          categoryKey="sucursal"
          valueKey="utilidad"
          format={(v: number) => `${v} mil`}
          annotations={[{ value: 50, label: "Meta" }]}
        />
      </DemoExample>
      <DemoExample
        caption="Promedio por plantel con color por umbral"
        code={`import { DotPlot } from "@carlos-burelo/klin";

const data = [
  { plantel: "Coyoacán", promedio: 8.6 },
  { plantel: "Azcapotzalco", promedio: 7.9 },
  { plantel: "Iztapalapa", promedio: 7.2 },
  { plantel: "Xochimilco", promedio: 6.4 },
  { plantel: "Tláhuac", promedio: 5.8 },
];

<DotPlot
  ariaLabel="Promedio por plantel, dos planteles quedan bajo el 6 de aprobación"
  data={data}
  categoryKey="plantel"
  valueKey="promedio"
  itemColor={(d) =>
    Number(d["promedio"]) >= 6 ? "var(--chart-2)" : "var(--chart-5)"
  }
/>`}
      >
        <DotPlot
          ariaLabel="Promedio por plantel, dos planteles quedan bajo el 6 de aprobación"
          data={[
            { plantel: "Coyoacán", promedio: 8.6 },
            { plantel: "Azcapotzalco", promedio: 7.9 },
            { plantel: "Iztapalapa", promedio: 7.2 },
            { plantel: "Xochimilco", promedio: 6.4 },
            { plantel: "Tláhuac", promedio: 5.8 },
          ]}
          categoryKey="plantel"
          valueKey="promedio"
          itemColor={(d) =>
            Number(d.promedio) >= 6 ? "var(--chart-2)" : "var(--chart-5)"
          }
        />
      </DemoExample>
    </div>
  );
}
