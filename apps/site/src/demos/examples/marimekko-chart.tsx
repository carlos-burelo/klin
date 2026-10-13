import { MarimekkoChart } from "@carlos-burelo/klin";
import { DemoExample } from "../../components/docs/demo-example";

export default function MarimekkoChartExamples() {
  return (
    <div className="flex flex-col gap-6">
      <DemoExample
        caption="Remesas por entidad y destino del gasto"
        code={`import { MarimekkoChart } from "@carlos-burelo/klin";

<MarimekkoChart
  ariaLabel="Remesas por entidad y destino: Michoacán capta el mayor monto y el consumo domina en todas las entidades"
  data={[
    { entidad: "Michoacán", remesas: 5200, consumo: 3800, inversion: 1400 },
    { entidad: "Guanajuato", remesas: 4800, consumo: 3400, inversion: 1400 },
    { entidad: "Jalisco", remesas: 4300, consumo: 3100, inversion: 1200 },
    { entidad: "Edomex", remesas: 2900, consumo: 2300, inversion: 600 },
  ]}
  xKey="entidad"
  widthKey="remesas"
  series={[
    { key: "consumo", label: "Consumo" },
    { key: "inversion", label: "Inversión" },
  ]}
/>`}
      >
        <MarimekkoChart
          ariaLabel="Remesas por entidad y destino: Michoacán capta el mayor monto y el consumo domina en todas las entidades"
          data={[
            {
              entidad: "Michoacán",
              remesas: 5200,
              consumo: 3800,
              inversion: 1400,
            },
            {
              entidad: "Guanajuato",
              remesas: 4800,
              consumo: 3400,
              inversion: 1400,
            },
            {
              entidad: "Jalisco",
              remesas: 4300,
              consumo: 3100,
              inversion: 1200,
            },
            { entidad: "Edomex", remesas: 2900, consumo: 2300, inversion: 600 },
          ]}
          xKey="entidad"
          widthKey="remesas"
          series={[
            { key: "consumo", label: "Consumo" },
            { key: "inversion", label: "Inversión" },
          ]}
        />
      </DemoExample>
      <DemoExample
        caption="Tres categorías por sucursal de antojitos"
        code={`import { MarimekkoChart } from "@carlos-burelo/klin";

<MarimekkoChart
  ariaLabel="Ventas por sucursal y categoría: Centro vende más del doble que Coyoacán y los tacos lideran en las tres"
  data={[
    { sucursal: "Centro", ventas: 860, tacos: 480, tortas: 240, jugos: 140 },
    { sucursal: "Roma", ventas: 620, tacos: 330, tortas: 180, jugos: 110 },
    { sucursal: "Coyoacán", ventas: 410, tacos: 220, tortas: 110, jugos: 80 },
  ]}
  xKey="sucursal"
  widthKey="ventas"
  series={[
    { key: "tacos", label: "Tacos" },
    { key: "tortas", label: "Tortas" },
    { key: "jugos", label: "Jugos" },
  ]}
/>`}
      >
        <MarimekkoChart
          ariaLabel="Ventas por sucursal y categoría: Centro vende más del doble que Coyoacán y los tacos lideran en las tres"
          data={[
            {
              sucursal: "Centro",
              ventas: 860,
              tacos: 480,
              tortas: 240,
              jugos: 140,
            },
            {
              sucursal: "Roma",
              ventas: 620,
              tacos: 330,
              tortas: 180,
              jugos: 110,
            },
            {
              sucursal: "Coyoacán",
              ventas: 410,
              tacos: 220,
              tortas: 110,
              jugos: 80,
            },
          ]}
          xKey="sucursal"
          widthKey="ventas"
          series={[
            { key: "tacos", label: "Tacos" },
            { key: "tortas", label: "Tortas" },
            { key: "jugos", label: "Jugos" },
          ]}
        />
      </DemoExample>
      <DemoExample
        caption="Presupuesto en moneda sin leyenda"
        code={`import { MarimekkoChart } from "@carlos-burelo/klin";

<MarimekkoChart
  ariaLabel="Presupuesto por dependencia y tipo de gasto en pesos: seguridad tiene la bolsa más grande y la nómina absorbe la mayor parte"
  data={[
    { dependencia: "Seguridad", bolsa: 920, nomina: 640, operacion: 280 },
    { dependencia: "Obras", bolsa: 780, nomina: 210, operacion: 570 },
    { dependencia: "Salud", bolsa: 610, nomina: 430, operacion: 180 },
  ]}
  xKey="dependencia"
  widthKey="bolsa"
  formatX={(v: number) =>
    new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
      maximumFractionDigits: 0,
    }).format(v)
  }
  showLegend={false}
  series={[
    { key: "nomina", label: "Nómina" },
    { key: "operacion", label: "Operación" },
  ]}
/>`}
      >
        <MarimekkoChart
          ariaLabel="Presupuesto por dependencia y tipo de gasto en pesos: seguridad tiene la bolsa más grande y la nómina absorbe la mayor parte"
          data={[
            {
              dependencia: "Seguridad",
              bolsa: 920,
              nomina: 640,
              operacion: 280,
            },
            { dependencia: "Obras", bolsa: 780, nomina: 210, operacion: 570 },
            { dependencia: "Salud", bolsa: 610, nomina: 430, operacion: 180 },
          ]}
          xKey="dependencia"
          widthKey="bolsa"
          formatX={(v: number) =>
            new Intl.NumberFormat("es-MX", {
              style: "currency",
              currency: "MXN",
              maximumFractionDigits: 0,
            }).format(v)
          }
          showLegend={false}
          series={[
            { key: "nomina", label: "Nómina" },
            { key: "operacion", label: "Operación" },
          ]}
        />
      </DemoExample>
    </div>
  );
}
