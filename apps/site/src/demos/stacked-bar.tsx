import { ChartTooltipPortal, StackedBar } from "@carlos-burelo/klin";

/** Avance de proyectos por estado (horas). */
export default function StackedBarDemo() {
  return (
    <ChartTooltipPortal>
      <StackedBar
        ariaLabel="Avance de proyectos por estado de tareas"
        percentOf="completado"
        segments={[
          { key: "completado", label: "Completado" },
          { key: "encurso", label: "En curso" },
          { key: "pendiente", label: "Pendiente" },
        ]}
        rows={[
          {
            detail: "Portal de alumnos",
            label: "Portal web",
            values: { completado: 120, encurso: 45, pendiente: 35 },
          },
          {
            detail: "App de pagos",
            label: "App móvil",
            values: { completado: 80, encurso: 60, pendiente: 60 },
          },
          {
            detail: "Migración de datos",
            label: "Migración",
            values: { completado: 150, encurso: 20, pendiente: 30 },
          },
        ]}
      />
    </ChartTooltipPortal>
  );
}
