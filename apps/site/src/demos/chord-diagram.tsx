import { ChartTooltipPortal, ChordDiagram } from "@carlos-burelo/klin";

/** Migración interna entre ciudades latam (personas por año). */
export default function ChordDiagramDemo() {
  return (
    <ChartTooltipPortal>
      <ChordDiagram
        ariaLabel="Migración entre CDMX, Guadalajara, Monterrey, Bogotá y Lima; la CDMX concentra el mayor intercambio"
        labels={["CDMX", "Guadalajara", "Monterrey", "Bogotá", "Lima"]}
        matrix={[
          [0, 320, 410, 180, 120],
          [280, 0, 150, 90, 60],
          [390, 140, 0, 110, 80],
          [160, 70, 100, 0, 210],
          [110, 50, 70, 190, 0],
        ]}
      />
    </ChartTooltipPortal>
  );
}
