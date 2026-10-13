import { ChartTooltipPortal, ScatterPlot } from "@carlos-burelo/klin";

/** Tráfico contra ticket por sucursal: tres nubes por zona más dos atípicas. */
export default function ScatterPlotDemo() {
  return (
    <ChartTooltipPortal>
      <ScatterPlot
        ariaLabel="Tráfico contra ticket por sucursal: norte barato con ticket bajo, sur caro con ticket alto"
        xLabel="Tráfico (miles)"
        yLabel="Ticket promedio"
        points={[
          { label: "Norte A", x: 42, y: 61 },
          { label: "Norte B", x: 48, y: 66 },
          { label: "Norte C", x: 45, y: 58 },
          { label: "Norte D", x: 51, y: 63 },
          { label: "Centro A", x: 72, y: 41 },
          { label: "Centro B", x: 68, y: 48 },
          { label: "Centro C", x: 75, y: 44 },
          { label: "Centro D", x: 70, y: 38 },
          { label: "Sur A", x: 30, y: 25 },
          { label: "Sur B", x: 34, y: 31 },
          { label: "Sur C", x: 28, y: 22 },
          { label: "Sur D", x: 36, y: 28 },
          { label: "Insurgentes", x: 60, y: 72 },
          { label: "Doctores", x: 20, y: 55 },
        ]}
        itemColor={(p) =>
          (p.label ?? "").startsWith("Norte")
            ? "var(--chart-1)"
            : (p.label ?? "").startsWith("Centro")
              ? "var(--chart-2)"
              : "var(--chart-4)"
        }
      />
    </ChartTooltipPortal>
  );
}
