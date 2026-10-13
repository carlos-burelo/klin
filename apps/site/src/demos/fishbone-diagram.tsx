import { ChartTooltipPortal, FishboneDiagram } from "@carlos-burelo/klin";

export default function FishboneDiagramDemo() {
  return (
    <ChartTooltipPortal>
      <FishboneDiagram
        ariaLabel="Causas de la caída de ventas en la tienda del Centro, personal y procesos concentran las subcausas principales"
        effect="Caída de ventas en tienda Centro"
        causes={[
          {
            label: "Personal",
            subcauses: [
              "Rotación alta",
              "Falta de capacitación",
              "Turnos sin cubrir",
            ],
          },
          {
            label: "Procesos",
            subcauses: [
              "Cobro lento",
              "Devoluciones tardadas",
              "Inventario desactualizado",
            ],
          },
          {
            label: "Proveedores",
            subcauses: ["Entregas incompletas", "Precios al alza"],
          },
          {
            label: "Entorno",
            subcauses: [
              "Obra en la calle",
              "Competencia nueva",
              "Menos foot traffic",
            ],
          },
          {
            label: "Equipo",
            subcauses: ["Terminales viejas", "Aire acondicionado fallando"],
          },
          {
            label: "Marketing",
            subcauses: ["Sin promo local", "Redes desactualizadas"],
          },
        ]}
      />
    </ChartTooltipPortal>
  );
}
