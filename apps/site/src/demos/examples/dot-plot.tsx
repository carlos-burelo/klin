import { DotPlot } from "@carlos-burelo/klin";
import { DemoExample } from "../../components/docs/demo-example";

export default function DotPlotExamples() {
  return (
    <div className="flex flex-col gap-6">
      <DemoExample
        caption="Traslados al trabajo en minutos con puntos grandes"
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
  pointRadius={7}
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
          pointRadius={7}
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
      <DemoExample
        caption="Estrés: 24 municipios con nombres largos recortados a 12 con maxItems"
        code={`import { DotPlot } from "@carlos-burelo/klin";

const data = [
  { municipio: "San Pedro Tlaquepaque", poblacion: 689 },
  { municipio: "Santa Cruz Xoxocotlán", poblacion: 100 },
  { municipio: "San Andrés Cholula", poblacion: 170 },
  { municipio: "Villa de Álvarez", poblacion: 149 },
  { municipio: "Heroica Ciudad de Juchitán de Zaragoza", poblacion: 113 },
  { municipio: "San Juan Bautista Tuxtepec", poblacion: 159 },
  { municipio: "Santiago de Querétaro", poblacion: 1049 },
  { municipio: "San Luis Río Colorado", poblacion: 199 },
  { municipio: "Heroica Puebla de Zaragoza", poblacion: 1692 },
  { municipio: "Ciudad General Escobedo", poblacion: 481 },
  { municipio: "San Nicolás de los Garza", poblacion: 412 },
  { municipio: "Santa Catarina", poblacion: 306 },
  { municipio: "Guadalupe", poblacion: 643 },
  { municipio: "Benito Juárez", poblacion: 911 },
  { municipio: "Venustiano Carranza", poblacion: 443 },
  { municipio: "Iztapalapa", poblacion: 1835 },
  { municipio: "Gustavo A. Madero", poblacion: 1173 },
  { municipio: "Álvaro Obregón", poblacion: 750 },
  { municipio: "Coyoacán", poblacion: 614 },
  { municipio: "Tlalpan", poblacion: 699 },
  { municipio: "Azcapotzalco", poblacion: 414 },
  { municipio: "Miguel Hidalgo", poblacion: 372 },
  { municipio: "Xochimilco", poblacion: 442 },
  { municipio: "Tláhuac", poblacion: 361 },
];

<DotPlot
  ariaLabel="Población por municipio con 24 nombres largos recortados a los 12 primeros"
  data={data}
  categoryKey="municipio"
  valueKey="poblacion"
  format={(v: number) => \`\${v} mil\`}
  maxItems={12}
/>`}
      >
        <DotPlot
          ariaLabel="Población por municipio con 24 nombres largos recortados a los 12 primeros"
          data={[
            { municipio: "San Pedro Tlaquepaque", poblacion: 689 },
            { municipio: "Santa Cruz Xoxocotlán", poblacion: 100 },
            { municipio: "San Andrés Cholula", poblacion: 170 },
            { municipio: "Villa de Álvarez", poblacion: 149 },
            {
              municipio: "Heroica Ciudad de Juchitán de Zaragoza",
              poblacion: 113,
            },
            { municipio: "San Juan Bautista Tuxtepec", poblacion: 159 },
            { municipio: "Santiago de Querétaro", poblacion: 1049 },
            { municipio: "San Luis Río Colorado", poblacion: 199 },
            { municipio: "Heroica Puebla de Zaragoza", poblacion: 1692 },
            { municipio: "Ciudad General Escobedo", poblacion: 481 },
            { municipio: "San Nicolás de los Garza", poblacion: 412 },
            { municipio: "Santa Catarina", poblacion: 306 },
            { municipio: "Guadalupe", poblacion: 643 },
            { municipio: "Benito Juárez", poblacion: 911 },
            { municipio: "Venustiano Carranza", poblacion: 443 },
            { municipio: "Iztapalapa", poblacion: 1835 },
            { municipio: "Gustavo A. Madero", poblacion: 1173 },
            { municipio: "Álvaro Obregón", poblacion: 750 },
            { municipio: "Coyoacán", poblacion: 614 },
            { municipio: "Tlalpan", poblacion: 699 },
            { municipio: "Azcapotzalco", poblacion: 414 },
            { municipio: "Miguel Hidalgo", poblacion: 372 },
            { municipio: "Xochimilco", poblacion: 442 },
            { municipio: "Tláhuac", poblacion: 361 },
          ]}
          categoryKey="municipio"
          valueKey="poblacion"
          format={(v: number) => `${v} mil`}
          maxItems={12}
        />
      </DemoExample>
    </div>
  );
}
