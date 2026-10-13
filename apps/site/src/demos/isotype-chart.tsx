import { ChartTooltipPortal, IsotypeChart } from "@carlos-burelo/klin";

export default function IsotypeChartDemo() {
  return (
    <ChartTooltipPortal>
      <IsotypeChart
        ariaLabel="Producción de café por estado en miles de toneladas, cada pictograma vale 20 mil y Chiapas lidera con 260"
        series={[
          { label: "Chiapas", value: 260 },
          { label: "Veracruz", value: 230 },
          { label: "Puebla", value: 150 },
          { label: "Oaxaca", value: 120 },
          { label: "Guerrero", value: 60 },
        ]}
        unit={20}
        format={(v: number) => new Intl.NumberFormat("es-MX").format(v)}
      />
    </ChartTooltipPortal>
  );
}
