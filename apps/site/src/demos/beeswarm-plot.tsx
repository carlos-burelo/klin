/**
 * Demo Enjambre del site (no se publica en el bundle de la lib).
 */
import {
  BeeswarmPlot,
  type BeeswarmPoint,
  ChartTooltipPortal,
} from "@carlos-burelo/klin";

const points: BeeswarmPoint[] = [
  { value: 12.5, label: "Los Cocuyos" },
  { value: 13, label: "El Paisa" },
  { value: 12, label: "Tacos Charly" },
  { value: 14, label: "Los Tres Gallos" },
  { value: 13.5, label: "El Vilsito" },
  { value: 15, label: "Los Parados" },
  { value: 12.8, label: "El Huequito" },
  { value: 22, label: "El Faraón" },
  { value: 24, label: "El Borrego Viudo" },
  { value: 23, label: "El Pescadito" },
  { value: 25, label: "La Casa del Pastor" },
  { value: 26, label: "El Parnita" },
  { value: 24.5, label: "Taquería Orinoco" },
  { value: 32, label: "Contramar" },
  { value: 35, label: "Pujol" },
  { value: 33, label: "Quintonil" },
  { value: 38, label: "Sud 777" },
  { value: 34, label: "Rosetta" },
];

export default function BeeswarmPlotDemo() {
  return (
    <ChartTooltipPortal>
      <BeeswarmPlot
        ariaLabel="Precio del taco al pastor por taquería en CDMX: se agrupa en barato, medio y premium"
        points={points}
        formatX={(v: number) => `$${v}`}
      />
    </ChartTooltipPortal>
  );
}
