import { LollipopChart } from "@carlos-burelo/klin";
import { DemoExample } from "../../components/docs/demo-example";

export default function LollipopExamples() {
  return (
    <div className="flex flex-col gap-6">
      <DemoExample
        caption="Ventas por región con dominio fijo de 0 a 250 mil"
        code={`import { LollipopChart } from "@carlos-burelo/klin";

const data = [
  { region: "Norte", ventas: 128 },
  { region: "Centro", ventas: 214 },
  { region: "Sur", ventas: 96 },
  { region: "Oriente", ventas: 167 },
  { region: "Poniente", ventas: 142 },
];

<LollipopChart
  ariaLabel="Paletas de ventas trimestrales por región en miles de piezas"
  data={data}
  xKey="region"
  yKey="ventas"
  yMin={0}
  yMax={250}
/>`}
      >
        <LollipopChart
          ariaLabel="Paletas de ventas trimestrales por región en miles de piezas"
          data={[
            { region: "Norte", ventas: 128 },
            { region: "Centro", ventas: 214 },
            { region: "Sur", ventas: 96 },
            { region: "Oriente", ventas: 167 },
            { region: "Poniente", ventas: 142 },
          ]}
          xKey="region"
          yKey="ventas"
          yMin={0}
          yMax={250}
        />
      </DemoExample>
      <DemoExample
        caption="Flujo con meses en negativo y meta anotada"
        code={`import { LollipopChart } from "@carlos-burelo/klin";

const data = [
  { mes: "Ene", flujo: 45 },
  { mes: "Feb", flujo: -18 },
  { mes: "Mar", flujo: 30 },
  { mes: "Abr", flujo: -8 },
  { mes: "May", flujo: 52 },
];

<LollipopChart
  ariaLabel="Paletas de flujo neto con meses en negativo y meta de 20 mil"
  data={data}
  xKey="mes"
  yKey="flujo"
  formatY={(v: number) => \`\${v} mil\`}
  annotations={[{ value: 20, label: "Meta" }]}
/>`}
      >
        <LollipopChart
          ariaLabel="Paletas de flujo neto con meses en negativo y meta de 20 mil"
          data={[
            { mes: "Ene", flujo: 45 },
            { mes: "Feb", flujo: -18 },
            { mes: "Mar", flujo: 30 },
            { mes: "Abr", flujo: -8 },
            { mes: "May", flujo: 52 },
          ]}
          xKey="mes"
          yKey="flujo"
          formatY={(v: number) => `${v} mil`}
          annotations={[{ value: 20, label: "Meta" }]}
        />
      </DemoExample>
      <DemoExample
        caption="Donativos con sede en cero, color propio y formato de moneda"
        code={`import { LollipopChart } from "@carlos-burelo/klin";

const data = [
  { sede: "Centro", donativos: 8400 },
  { sede: "Norte", donativos: 5200 },
  { sede: "Sur", donativos: 0 },
  { sede: "Este", donativos: 3100 },
];

<LollipopChart
  ariaLabel="Paletas de donativos por sede con una sede en cero"
  data={data}
  xKey="sede"
  yKey="donativos"
  color="#0d9488"
  formatY={(v: number) =>
    \`$\${new Intl.NumberFormat("es-MX").format(v)}\`
  }
/>`}
      >
        <LollipopChart
          ariaLabel="Paletas de donativos por sede con una sede en cero"
          data={[
            { sede: "Centro", donativos: 8400 },
            { sede: "Norte", donativos: 5200 },
            { sede: "Sur", donativos: 0 },
            { sede: "Este", donativos: 3100 },
          ]}
          xKey="sede"
          yKey="donativos"
          color="#0d9488"
          formatY={(v: number) =>
            `$${new Intl.NumberFormat("es-MX").format(v)}`
          }
        />
      </DemoExample>
      <DemoExample
        caption="Estrés: 24 centros con nombres largos y saldos negativos mezclados"
        code={`import { LollipopChart } from "@carlos-burelo/klin";

const data = [
  { centro: "Centro de Distribución Toluca Lerma", saldo: 128 },
  { centro: "Centro de Distribución Puebla Amozoc", saldo: -34 },
  { centro: "Centro de Distribución Monterrey Apodaca", saldo: 214 },
  { centro: "Centro de Distribución Guadalajara Tlajomulco", saldo: 96 },
  { centro: "Centro de Distribución León Silao", saldo: -18 },
  { centro: "Centro de Distribución Querétaro El Marqués", saldo: 167 },
  { centro: "Centro de Distribución Tijuana Otay", saldo: 142 },
  { centro: "Centro de Distribución Mérida Umán", saldo: -52 },
  { centro: "Centro de Distribución Veracruz Puerto Seco", saldo: 188 },
  { centro: "Centro de Distribución Oaxaca Etla", saldo: 74 },
  { centro: "Centro de Distribución Chihuahua Sur", saldo: -27 },
  { centro: "Centro de Distribución Culiacán Norte", saldo: 155 },
  { centro: "Centro de Distribución Hermosillo Poniente", saldo: 203 },
  { centro: "Centro de Distribución Saltillo Ramos", saldo: -41 },
  { centro: "Centro de Distribución Morelia Tarímbaro", saldo: 119 },
  { centro: "Centro de Distribución Tuxtla Berriozábal", saldo: 88 },
  { centro: "Centro de Distribución Campeche Castamay", saldo: -12 },
  { centro: "Centro de Distribución Villahermosa Parrilla", saldo: 176 },
  { centro: "Centro de Distribución Irapuato Castro", saldo: 134 },
  { centro: "Centro de Distribución Celaya Cortazar", saldo: -63 },
  { centro: "Centro de Distribución Aguascalientes Sur", saldo: 149 },
  { centro: "Centro de Distribución San Luis Pozos", saldo: 161 },
  { centro: "Centro de Distribución Cuautitlán Izcalli", saldo: -22 },
  { centro: "Centro de Distribución Ecatepec Tulpetlac", saldo: 197 },
];

<LollipopChart
  ariaLabel="Paletas de saldo por centro de distribución con nombres largos y saldos en rojo"
  data={data}
  xKey="centro"
  yKey="saldo"
  formatY={(v: number) => \`\${v} mdp\`}
  stemStyle="dashed"
/>`}
      >
        <LollipopChart
          ariaLabel="Paletas de saldo por centro de distribución con nombres largos y saldos en rojo"
          data={[
            { centro: "Centro de Distribución Toluca Lerma", saldo: 128 },
            { centro: "Centro de Distribución Puebla Amozoc", saldo: -34 },
            { centro: "Centro de Distribución Monterrey Apodaca", saldo: 214 },
            {
              centro: "Centro de Distribución Guadalajara Tlajomulco",
              saldo: 96,
            },
            { centro: "Centro de Distribución León Silao", saldo: -18 },
            {
              centro: "Centro de Distribución Querétaro El Marqués",
              saldo: 167,
            },
            { centro: "Centro de Distribución Tijuana Otay", saldo: 142 },
            { centro: "Centro de Distribución Mérida Umán", saldo: -52 },
            {
              centro: "Centro de Distribución Veracruz Puerto Seco",
              saldo: 188,
            },
            { centro: "Centro de Distribución Oaxaca Etla", saldo: 74 },
            { centro: "Centro de Distribución Chihuahua Sur", saldo: -27 },
            { centro: "Centro de Distribución Culiacán Norte", saldo: 155 },
            {
              centro: "Centro de Distribución Hermosillo Poniente",
              saldo: 203,
            },
            { centro: "Centro de Distribución Saltillo Ramos", saldo: -41 },
            { centro: "Centro de Distribución Morelia Tarímbaro", saldo: 119 },
            { centro: "Centro de Distribución Tuxtla Berriozábal", saldo: 88 },
            { centro: "Centro de Distribución Campeche Castamay", saldo: -12 },
            {
              centro: "Centro de Distribución Villahermosa Parrilla",
              saldo: 176,
            },
            { centro: "Centro de Distribución Irapuato Castro", saldo: 134 },
            { centro: "Centro de Distribución Celaya Cortazar", saldo: -63 },
            { centro: "Centro de Distribución Aguascalientes Sur", saldo: 149 },
            { centro: "Centro de Distribución San Luis Pozos", saldo: 161 },
            { centro: "Centro de Distribución Cuautitlán Izcalli", saldo: -22 },
            { centro: "Centro de Distribución Ecatepec Tulpetlac", saldo: 197 },
          ]}
          xKey="centro"
          yKey="saldo"
          formatY={(v: number) => `${v} mdp`}
          stemStyle="dashed"
        />
      </DemoExample>
    </div>
  );
}
