import type { TimelineEvent } from "@carlos-burelo/klin";
import { ChartTooltipPortal, TimelineChart } from "@carlos-burelo/klin";

const events: TimelineEvent[] = [
  {
    date: "ene 2026",
    label: "Levantamiento",
    detail: "Censo de actas y diagnóstico de módulos",
    done: true,
  },
  {
    date: "mar 2026",
    label: "Digitalización",
    detail: "Escaneo de 40 mil fojas históricas",
    done: true,
  },
  {
    date: "may 2026",
    label: "Ventanilla única",
    detail: "Apertura del módulo piloto en el centro",
    done: true,
  },
  {
    date: "jul 2026",
    label: "Citas en línea",
    detail: "Portal de turnos con confirmación por mensaje",
  },
  {
    date: "sep 2026",
    label: "Firma electrónica",
    detail: "Actas firmadas con validez oficial",
  },
  {
    date: "nov 2026",
    label: "Cierre y auditoría",
    detail: "Evaluación de tiempos de espera",
  },
];

export default function TimelineChartDemo() {
  return (
    <ChartTooltipPortal>
      <TimelineChart
        events={events}
        ariaLabel="Hitos del programa de modernización del registro civil en 2026"
      />
    </ChartTooltipPortal>
  );
}
