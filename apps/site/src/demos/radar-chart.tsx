import { ChartTooltipPortal, RadarChart } from "@carlos-burelo/klin";

/** Comparativa de dos proveedores en cinco criterios (0-10). */
export default function RadarChartDemo() {
  return (
    <ChartTooltipPortal>
      <RadarChart
        ariaLabel="Radar comparativo de proveedores por criterio"
        axes={["Calidad", "Precio", "Plazo", "Soporte", "Experiencia"]}
        series={[
          { label: "Proveedor A", values: [8, 6, 9, 7, 8] },
          { label: "Proveedor B", values: [7, 9, 6, 8, 6] },
        ]}
      />
    </ChartTooltipPortal>
  );
}
