import { ChartTooltipPortal, TableChart } from "@carlos-burelo/klin";

export default function TableChartDemo() {
  return (
    <ChartTooltipPortal>
      <TableChart
        ariaLabel="Producción de maíz por estado en superficie y cosecha, Sinaloa lidera la cosecha con 5,800 miles de toneladas"
        columns={[
          { key: "superficie", label: "Superficie (miles ha)" },
          { key: "cosecha", label: "Cosecha (miles t)" },
        ]}
        rows={[
          { label: "Sinaloa", values: { superficie: 520, cosecha: 5800 } },
          { label: "Jalisco", values: { superficie: 610, cosecha: 3900 } },
          { label: "Michoacán", values: { superficie: 480, cosecha: 2600 } },
          { label: "Guanajuato", values: { superficie: 420, cosecha: 2100 } },
          { label: "Chiapas", values: { superficie: 690, cosecha: 1800 } },
        ]}
        bars={[{ key: "cosecha", label: "Cosecha" }]}
        format={(v: number) => new Intl.NumberFormat("es-MX").format(v)}
      />
    </ChartTooltipPortal>
  );
}
