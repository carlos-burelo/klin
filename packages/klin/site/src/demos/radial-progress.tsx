import { ChartTooltipPortal, RadialProgress } from "@carlos-burelo/klin";

/** Avance de la meta anual de vacunación (72 %). */
export default function RadialProgressDemo() {
  return (
    <ChartTooltipPortal>
      <RadialProgress
        ariaLabel="Avance de la meta anual de vacunación: 72 por ciento"
        label="Meta anual"
        value={72}
      />
    </ChartTooltipPortal>
  );
}
