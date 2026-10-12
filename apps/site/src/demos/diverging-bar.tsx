/**
 * Demo Barras divergentes del site (no se publica en el bundle de la lib).
 */
import { ChartTooltipPortal, DivergingBar } from "@carlos-burelo/klin";

export default function DivergingBarDemo() {
  return (
    <ChartTooltipPortal>
      <DivergingBar
        ariaLabel="Barras divergentes de opinión sobre el nuevo horario"
        data={[
          { tema: "Horario", contra: 32, favor: 68 },
          { tema: "Remoto", contra: 25, favor: 75 },
          { tema: "Comedor", contra: 45, favor: 55 },
          { tema: "Transporte", contra: 58, favor: 42 },
        ]}
        yKey="tema"
        left={{ key: "contra", label: "En contra" }}
        right={{ key: "favor", label: "A favor" }}
      />
    </ChartTooltipPortal>
  );
}
