import { ChartTooltipPortal, ParetoChart } from "@carlos-burelo/klin";

const data: Array<Record<string, string | number>> = [
  { causa: "Empaque dañado", devoluciones: 42 },
  { causa: "Talla equivocada", devoluciones: 35 },
  { causa: "Entrega tardía", devoluciones: 21 },
  { causa: "Color distinto", devoluciones: 12 },
  { causa: "Falla eléctrica", devoluciones: 8 },
  { causa: "Otra causa", devoluciones: 5 },
];

export default function ParetoChartDemo() {
  return (
    <ChartTooltipPortal>
      <ParetoChart
        data={data}
        xKey="causa"
        yKey="devoluciones"
        ariaLabel="Causas de devolución ordenadas con porcentaje acumulado"
      />
    </ChartTooltipPortal>
  );
}
