/**
 * Demo Velas OHLC del site (no se publica en el bundle de la lib).
 */
import { CandlestickChart, ChartTooltipPortal } from "@carlos-burelo/klin";

export default function CandlestickChartDemo() {
  return (
    <ChartTooltipPortal>
      <CandlestickChart
        ariaLabel="Velas semanales de América Móvil en la BMV de enero a febrero, con cierre al alza en 17.45 pesos"
        data={[
          {
            semana: "6 ene",
            apertura: 16.8,
            maximo: 17.05,
            minimo: 16.6,
            cierre: 16.95,
          },
          {
            semana: "13 ene",
            apertura: 16.95,
            maximo: 17.2,
            minimo: 16.75,
            cierre: 17.1,
          },
          {
            semana: "20 ene",
            apertura: 17.1,
            maximo: 17.25,
            minimo: 16.8,
            cierre: 16.85,
          },
          {
            semana: "27 ene",
            apertura: 16.85,
            maximo: 17.0,
            minimo: 16.5,
            cierre: 16.6,
          },
          {
            semana: "3 feb",
            apertura: 16.6,
            maximo: 16.95,
            minimo: 16.45,
            cierre: 16.9,
          },
          {
            semana: "10 feb",
            apertura: 16.9,
            maximo: 17.55,
            minimo: 16.85,
            cierre: 17.45,
          },
        ]}
        labelKey="semana"
        openKey="apertura"
        highKey="maximo"
        lowKey="minimo"
        closeKey="cierre"
        formatY={(v: number) =>
          new Intl.NumberFormat("es-MX", {
            style: "currency",
            currency: "MXN",
          }).format(v)
        }
      />
    </ChartTooltipPortal>
  );
}
