import { ParetoChart } from "@carlos-burelo/klin";
import { DemoExample } from "../../components/docs/demo-example";

const causasEstres = [
  { causa: "Empaque dañado", devoluciones: 96 },
  { causa: "Talla equivocada", devoluciones: 82 },
  { causa: "Entrega tardía", devoluciones: 74 },
  { causa: "Color distinto", devoluciones: 61 },
  { causa: "Falla eléctrica", devoluciones: 55 },
  { causa: "Etiqueta rota", devoluciones: 47 },
  { causa: "Precio distinto", devoluciones: 39 },
  { causa: "Sin stock", devoluciones: 33 },
  { causa: "Garantía", devoluciones: 27 },
  { causa: "Pago duplicado", devoluciones: 22 },
  { causa: "Falla de app", devoluciones: 18 },
  { causa: "Costo de envío", devoluciones: 14 },
  { causa: "Devolución parcial", devoluciones: 11 },
  { causa: "Sin factura", devoluciones: 8 },
  { causa: "Otra causa", devoluciones: 5 },
];

export default function ParetoChartExamples() {
  return (
    <div className="flex flex-col gap-6">
      <DemoExample
        caption="Causas de devolución ordenadas con acumulado y leyenda"
        code={`import { ParetoChart } from "@carlos-burelo/klin";

const data = [
  { causa: "Empaque dañado", devoluciones: 42 },
  { causa: "Talla equivocada", devoluciones: 35 },
  { causa: "Entrega tardía", devoluciones: 21 },
  { causa: "Color distinto", devoluciones: 12 },
  { causa: "Falla eléctrica", devoluciones: 8 },
  { causa: "Otra causa", devoluciones: 5 },
];

<ParetoChart
  ariaLabel="Pareto de causas de devolución con porcentaje acumulado"
  data={data}
  xKey="causa"
  yKey="devoluciones"
/>`}
      >
        <ParetoChart
          ariaLabel="Pareto de causas de devolución con porcentaje acumulado"
          data={[
            { causa: "Empaque dañado", devoluciones: 42 },
            { causa: "Talla equivocada", devoluciones: 35 },
            { causa: "Entrega tardía", devoluciones: 21 },
            { causa: "Color distinto", devoluciones: 12 },
            { causa: "Falla eléctrica", devoluciones: 8 },
            { causa: "Otra causa", devoluciones: 5 },
          ]}
          xKey="causa"
          yKey="devoluciones"
        />
      </DemoExample>
      <DemoExample
        caption="Defectos en línea sin leyenda y con umbral anotado"
        code={`import { ParetoChart } from "@carlos-burelo/klin";

const data = [
  { defecto: "Soldadura", piezas: 38 },
  { defecto: "Pintura", piezas: 24 },
  { defecto: "Ensamble", piezas: 16 },
  { defecto: "Etiqueta", piezas: 9 },
];

<ParetoChart
  ariaLabel="Pareto de defectos en línea de ensamble con umbral de 15 piezas"
  data={data}
  xKey="defecto"
  yKey="piezas"
  formatY={(v: number) => \`\${v} pzas\`}
  annotations={[{ value: 15, label: "Umbral" }]}
  showLegend={false}
/>`}
      >
        <ParetoChart
          ariaLabel="Pareto de defectos en línea de ensamble con umbral de 15 piezas"
          data={[
            { defecto: "Soldadura", piezas: 38 },
            { defecto: "Pintura", piezas: 24 },
            { defecto: "Ensamble", piezas: 16 },
            { defecto: "Etiqueta", piezas: 9 },
          ]}
          xKey="defecto"
          yKey="piezas"
          formatY={(v: number) => `${v} pzas`}
          annotations={[{ value: 15, label: "Umbral" }]}
          showLegend={false}
        />
      </DemoExample>
      <DemoExample
        caption="Tres motivos de ausencia con color propio"
        code={`import { ParetoChart } from "@carlos-burelo/klin";

const data = [
  { motivo: "Enfermedad", faltas: 54 },
  { motivo: "Trámite", faltas: 22 },
  { motivo: "Transporte", faltas: 11 },
];

<ParetoChart
  ariaLabel="Pareto de tres motivos de ausencia escolar con acumulado"
  data={data}
  xKey="motivo"
  yKey="faltas"
  color="#dc2626"
  showLegend={false}
/>`}
      >
        <ParetoChart
          ariaLabel="Pareto de tres motivos de ausencia escolar con acumulado"
          data={[
            { motivo: "Enfermedad", faltas: 54 },
            { motivo: "Trámite", faltas: 22 },
            { motivo: "Transporte", faltas: 11 },
          ]}
          xKey="motivo"
          yKey="faltas"
          color="#dc2626"
          showLegend={false}
        />
      </DemoExample>
      <DemoExample
        caption="estrés: 15 causas con topN 10 y resto en Otros"
        code={`import { ParetoChart } from "@carlos-burelo/klin";

const data = [
  { causa: "Empaque dañado", devoluciones: 96 },
  { causa: "Talla equivocada", devoluciones: 82 },
  { causa: "Entrega tardía", devoluciones: 74 },
  { causa: "Color distinto", devoluciones: 61 },
  { causa: "Falla eléctrica", devoluciones: 55 },
  { causa: "Etiqueta rota", devoluciones: 47 },
  { causa: "Precio distinto", devoluciones: 39 },
  { causa: "Sin stock", devoluciones: 33 },
  { causa: "Garantía", devoluciones: 27 },
  { causa: "Pago duplicado", devoluciones: 22 },
  { causa: "Falla de app", devoluciones: 18 },
  { causa: "Costo de envío", devoluciones: 14 },
  { causa: "Devolución parcial", devoluciones: 11 },
  { causa: "Sin factura", devoluciones: 8 },
  { causa: "Otra causa", devoluciones: 5 },
];

<ParetoChart
  ariaLabel="Pareto de 15 causas de devolución con las 10 primeras y resto en Otros"
  data={data}
  xKey="causa"
  yKey="devoluciones"
  topN={10}
/>`}
      >
        <ParetoChart
          ariaLabel="Pareto de 15 causas de devolución con las 10 primeras y resto en Otros"
          data={causasEstres}
          xKey="causa"
          yKey="devoluciones"
          topN={10}
        />
      </DemoExample>
    </div>
  );
}
