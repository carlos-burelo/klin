/**
 * Demo Coordenadas paralelas del site (no se publica en el bundle de la lib).
 */
import { ChartTooltipPortal, ParallelCoordinates } from "@carlos-burelo/klin";

export default function ParallelCoordinatesDemo() {
  return (
    <ChartTooltipPortal>
      <ParallelCoordinates
        ariaLabel="Comparativa multivariada de tres modelos de auto eléctrico"
        axes={[
          { key: "precio", label: "Precio" },
          { key: "autonomia", label: "Autonomía" },
          { key: "potencia", label: "Potencia" },
          { key: "carga", label: "Carga" },
        ]}
        rows={[
          {
            label: "Volt A",
            values: { precio: 32, autonomia: 420, potencia: 150, carga: 45 },
          },
          {
            label: "Volt B",
            values: { precio: 45, autonomia: 510, potencia: 210, carga: 30 },
          },
          {
            label: "Volt C",
            values: { precio: 28, autonomia: 350, potencia: 120, carga: 60 },
          },
        ]}
      />
    </ChartTooltipPortal>
  );
}
