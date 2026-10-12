import { Sparkline } from "@carlos-burelo/klin";

/** Ventas diarias de las últimas dos semanas (miles de pesos). */
export default function SparklineDemo() {
  return (
    <Sparkline
      ariaLabel="Minigráfica de ventas diarias de las últimas dos semanas"
      values={[42, 48, 45, 52, 58, 61, 55, 63, 59, 66, 71, 68, 74, 79]}
    />
  );
}
