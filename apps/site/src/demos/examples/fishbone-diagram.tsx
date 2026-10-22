import { FishboneDiagram } from "@carlos-burelo/klin";
import { DemoExample } from "../../components/docs/demo-example";

const estresCauses = [
  {
    label: "Personal",
    subcauses: ["Rotación alta", "Faltas", "Falta de capacitación"],
  },
  {
    label: "Procesos",
    subcauses: ["Cobro lento", "Cierres tardíos", "Inventario desactualizado"],
  },
  { label: "Equipos", subcauses: ["Terminales viejas", "Refrigeración falla"] },
  {
    label: "Proveedores",
    subcauses: ["Entregas incompletas", "Precios al alza", "Fletes caros"],
  },
  { label: "Entorno", subcauses: ["Obra en la calle", "Competencia nueva"] },
  {
    label: "Gestión",
    subcauses: ["Metas irreales", "Sin incentivos", "Turnos largos"],
  },
];

export default function FishboneDiagramExamples() {
  return (
    <div className="flex flex-col gap-6">
      <DemoExample
        caption="Caída de ventas con cuatro categorías de causa"
        code={`import { FishboneDiagram } from "@carlos-burelo/klin";

const causes = [
  { label: "Personal", subcauses: ["Rotación alta", "Falta de capacitación"] },
  { label: "Procesos", subcauses: ["Cobro lento", "Inventario desactualizado"] },
  { label: "Proveedores", subcauses: ["Entregas incompletas", "Precios al alza"] },
  { label: "Entorno", subcauses: ["Obra en la calle", "Competencia nueva"] },
];

<FishboneDiagram
  ariaLabel="Causas de la caída de ventas en tienda Centro, personal y procesos pesan más"
  effect="Caída de ventas en tienda Centro"
  causes={causes}
/>`}
      >
        <FishboneDiagram
          ariaLabel="Causas de la caída de ventas en tienda Centro, personal y procesos pesan más"
          effect="Caída de ventas en tienda Centro"
          causes={[
            {
              label: "Personal",
              subcauses: ["Rotación alta", "Falta de capacitación"],
            },
            {
              label: "Procesos",
              subcauses: ["Cobro lento", "Inventario desactualizado"],
            },
            {
              label: "Proveedores",
              subcauses: ["Entregas incompletas", "Precios al alza"],
            },
            {
              label: "Entorno",
              subcauses: ["Obra en la calle", "Competencia nueva"],
            },
          ]}
        />
      </DemoExample>
      <DemoExample
        caption="Deserción en bachillerato por entorno y escuela"
        code={`import { FishboneDiagram } from "@carlos-burelo/klin";

const causes = [
  { label: "Economía", subcauses: ["Necesidad de trabajar", "Costo de transporte"] },
  { label: "Escuela", subcauses: ["Grupos saturados", "Falta de tutorías"] },
  { label: "Familia", subcauses: ["Cuidado de hermanos", "Migración"] },
];

<FishboneDiagram
  ariaLabel="Causas de la deserción en bachillerato, la economía familiar es el factor dominante"
  effect="Deserción en bachillerato"
  causes={causes}
/>`}
      >
        <FishboneDiagram
          ariaLabel="Causas de la deserción en bachillerato, la economía familiar es el factor dominante"
          effect="Deserción en bachillerato"
          causes={[
            {
              label: "Economía",
              subcauses: ["Necesidad de trabajar", "Costo de transporte"],
            },
            {
              label: "Escuela",
              subcauses: ["Grupos saturados", "Falta de tutorías"],
            },
            {
              label: "Familia",
              subcauses: ["Cuidado de hermanos", "Migración"],
            },
          ]}
        />
      </DemoExample>
      <DemoExample
        caption="misma caída de ventas con espina en espejo"
        code={`import { FishboneDiagram } from "@carlos-burelo/klin";

const causes = [
  { label: "Personal", subcauses: ["Rotación alta", "Falta de capacitación"] },
  { label: "Procesos", subcauses: ["Cobro lento", "Inventario desactualizado"] },
  { label: "Proveedores", subcauses: ["Entregas incompletas", "Precios al alza"] },
  { label: "Entorno", subcauses: ["Obra en la calle", "Competencia nueva"] },
];

<FishboneDiagram
  ariaLabel="Causas de la caída de ventas con espina en espejo"
  effect="Caída de ventas en tienda Centro"
  causes={causes}
  direction="RL"
/>`}
      >
        <FishboneDiagram
          ariaLabel="Causas de la caída de ventas con espina en espejo"
          effect="Caída de ventas en tienda Centro"
          causes={[
            {
              label: "Personal",
              subcauses: ["Rotación alta", "Falta de capacitación"],
            },
            {
              label: "Procesos",
              subcauses: ["Cobro lento", "Inventario desactualizado"],
            },
            {
              label: "Proveedores",
              subcauses: ["Entregas incompletas", "Precios al alza"],
            },
            {
              label: "Entorno",
              subcauses: ["Obra en la calle", "Competencia nueva"],
            },
          ]}
          direction="RL"
        />
      </DemoExample>
      <DemoExample
        caption="Retraso en obra pública con altura extendida"
        code={`import { FishboneDiagram } from "@carlos-burelo/klin";

const causes = [
  { label: "Materiales", subcauses: ["Cemento escaso", "Acarreos lentos"] },
  { label: "Clima", subcauses: ["Lluvias atípicas", "Calor extremo"] },
  { label: "Trámites", subcauses: ["Permisos federales", "Liberación de predios"] },
  { label: "Mano de obra", subcauses: ["Falta de oficiales", "Turnos incompletos"] },
];

<FishboneDiagram
  ariaLabel="Causas del retraso en el libramiento sur, trámites y materiales lo frenan"
  effect="Retraso en libramiento sur"
  causes={causes}
  height={360}
/>`}
      >
        <FishboneDiagram
          ariaLabel="Causas del retraso en el libramiento sur, trámites y materiales lo frenan"
          effect="Retraso en libramiento sur"
          causes={[
            {
              label: "Materiales",
              subcauses: ["Cemento escaso", "Acarreos lentos"],
            },
            {
              label: "Clima",
              subcauses: ["Lluvias atípicas", "Calor extremo"],
            },
            {
              label: "Trámites",
              subcauses: ["Permisos federales", "Liberación de predios"],
            },
            {
              label: "Mano de obra",
              subcauses: ["Falta de oficiales", "Turnos incompletos"],
            },
          ]}
          height={360}
        />
      </DemoExample>
      <DemoExample
        caption="estrés de tienda con 6 causas y 15 subcausas apretadas"
        code={`import { FishboneDiagram } from "@carlos-burelo/klin";

const causes = [
  {
    label: "Personal",
    subcauses: ["Rotación alta", "Faltas", "Falta de capacitación"],
  },
  {
    label: "Procesos",
    subcauses: ["Cobro lento", "Cierres tardíos", "Inventario desactualizado"],
  },
  { label: "Equipos", subcauses: ["Terminales viejas", "Refrigeración falla"] },
  {
    label: "Proveedores",
    subcauses: ["Entregas incompletas", "Precios al alza", "Fletes caros"],
  },
  { label: "Entorno", subcauses: ["Obra en la calle", "Competencia nueva"] },
  {
    label: "Gestión",
    subcauses: ["Metas irreales", "Sin incentivos", "Turnos largos"],
  },
];

<FishboneDiagram
  ariaLabel="Causas densas de la merma en tienda Norte con seis categorías"
  effect="Merma en tienda Norte"
  causes={causes}
/>`}
      >
        <FishboneDiagram
          ariaLabel="Causas densas de la merma en tienda Norte con seis categorías"
          effect="Merma en tienda Norte"
          causes={estresCauses}
        />
      </DemoExample>
    </div>
  );
}
