import { TableChart } from "@carlos-burelo/klin";
import { DemoExample } from "../../components/docs/demo-example";

const filasEstres = Array.from({ length: 40 }, (_, i) => ({
  label: `Municipio ${i + 1}`,
  values: {
    nomina: 100 + ((i * 37) % 900),
    obra: 50 + ((i * 53) % 450),
  },
}));

export default function TableChartExamples() {
  return (
    <div className="flex flex-col gap-6">
      <DemoExample
        caption="Maíz por estado con barra de cosecha"
        code={`import { TableChart } from "@carlos-burelo/klin";

const columns = [
  { key: "superficie", label: "Superficie (miles ha)" },
  { key: "cosecha", label: "Cosecha (miles t)" },
];

const rows = [
  { label: "Sinaloa", values: { superficie: 520, cosecha: 5800 } },
  { label: "Jalisco", values: { superficie: 610, cosecha: 3900 } },
  { label: "Michoacán", values: { superficie: 480, cosecha: 2600 } },
  { label: "Chiapas", values: { superficie: 690, cosecha: 1800 } },
];

<TableChart
  ariaLabel="Producción de maíz por estado, Sinaloa lidera la cosecha con 5,800 miles de toneladas"
  columns={columns}
  rows={rows}
  bars={[{ key: "cosecha", label: "Cosecha" }]}
  format={(v: number) => new Intl.NumberFormat("es-MX").format(v)}
/>`}
      >
        <TableChart
          ariaLabel="Producción de maíz por estado, Sinaloa lidera la cosecha con 5,800 miles de toneladas"
          columns={[
            { key: "superficie", label: "Superficie (miles ha)" },
            { key: "cosecha", label: "Cosecha (miles t)" },
          ]}
          rows={[
            { label: "Sinaloa", values: { superficie: 520, cosecha: 5800 } },
            { label: "Jalisco", values: { superficie: 610, cosecha: 3900 } },
            { label: "Michoacán", values: { superficie: 480, cosecha: 2600 } },
            { label: "Chiapas", values: { superficie: 690, cosecha: 1800 } },
          ]}
          bars={[{ key: "cosecha", label: "Cosecha" }]}
          format={(v: number) => new Intl.NumberFormat("es-MX").format(v)}
        />
      </DemoExample>
      <DemoExample
        caption="Presupuesto municipal como tabla simple sin barras"
        code={`import { TableChart } from "@carlos-burelo/klin";

const columns = [
  { key: "nomina", label: "Nómina (mdp)" },
  { key: "obra", label: "Obra (mdp)" },
];

const rows = [
  { label: "Mérida", values: { nomina: 820, obra: 460 } },
  { label: "Kanasín", values: { nomina: 310, obra: 180 } },
  { label: "Valladolid", values: { nomina: 240, obra: 150 } },
];

<TableChart
  ariaLabel="Presupuesto municipal en nómina y obra, Mérida concentra el mayor gasto"
  columns={columns}
  rows={rows}
  format={(v: number) => new Intl.NumberFormat("es-MX").format(v)}
/>`}
      >
        <TableChart
          ariaLabel="Presupuesto municipal en nómina y obra, Mérida concentra el mayor gasto"
          columns={[
            { key: "nomina", label: "Nómina (mdp)" },
            { key: "obra", label: "Obra (mdp)" },
          ]}
          rows={[
            { label: "Mérida", values: { nomina: 820, obra: 460 } },
            { label: "Kanasín", values: { nomina: 310, obra: 180 } },
            { label: "Valladolid", values: { nomina: 240, obra: 150 } },
          ]}
          format={(v: number) => new Intl.NumberFormat("es-MX").format(v)}
        />
      </DemoExample>
      <DemoExample
        caption="Remesas con máximo explícito y formato de moneda"
        code={`import { TableChart } from "@carlos-burelo/klin";

const columns = [
  { key: "remesas", label: "Remesas (M USD)" },
  { key: "hogares", label: "Hogares (miles)" },
];

const rows = [
  { label: "Michoacán", values: { remesas: 4200, hogares: 890 } },
  { label: "Guanajuato", values: { remesas: 3800, hogares: 810 } },
  { label: "Jalisco", values: { remesas: 3400, hogares: 760 } },
];

<TableChart
  ariaLabel="Remesas por estado contra meta de 5,000 millones, Michoacán va al 84 por ciento"
  columns={columns}
  rows={rows}
  bars={[{ key: "remesas", label: "Avance a meta", max: 5000 }]}
  format={(v: number) => new Intl.NumberFormat("es-MX").format(v)}
/>`}
      >
        <TableChart
          ariaLabel="Remesas por estado contra meta de 5,000 millones, Michoacán va al 84 por ciento"
          columns={[
            { key: "remesas", label: "Remesas (M USD)" },
            { key: "hogares", label: "Hogares (miles)" },
          ]}
          rows={[
            { label: "Michoacán", values: { remesas: 4200, hogares: 890 } },
            { label: "Guanajuato", values: { remesas: 3800, hogares: 810 } },
            { label: "Jalisco", values: { remesas: 3400, hogares: 760 } },
          ]}
          bars={[{ key: "remesas", label: "Avance a meta", max: 5000 }]}
          format={(v: number) => new Intl.NumberFormat("es-MX").format(v)}
        />
      </DemoExample>
      <DemoExample
        caption="Filas ordenadas por cosecha descendente"
        code={`import { TableChart } from "@carlos-burelo/klin";

const columns = [
  { key: "superficie", label: "Superficie (miles ha)" },
  { key: "cosecha", label: "Cosecha (miles t)" },
];

const rows = [
  { label: "Chiapas", values: { superficie: 690, cosecha: 1800 } },
  { label: "Sinaloa", values: { superficie: 520, cosecha: 5800 } },
  { label: "Michoacán", values: { superficie: 480, cosecha: 2600 } },
  { label: "Jalisco", values: { superficie: 610, cosecha: 3900 } },
];

<TableChart
  ariaLabel="Producción de maíz ordenada por cosecha descendente"
  columns={columns}
  rows={rows}
  sortBy={{ key: "cosecha", dir: "desc" }}
  bars={[{ key: "cosecha", label: "Cosecha" }]}
  format={(v: number) => new Intl.NumberFormat("es-MX").format(v)}
/>`}
      >
        <TableChart
          ariaLabel="Producción de maíz ordenada por cosecha descendente"
          columns={[
            { key: "superficie", label: "Superficie (miles ha)" },
            { key: "cosecha", label: "Cosecha (miles t)" },
          ]}
          rows={[
            { label: "Chiapas", values: { superficie: 690, cosecha: 1800 } },
            { label: "Sinaloa", values: { superficie: 520, cosecha: 5800 } },
            { label: "Michoacán", values: { superficie: 480, cosecha: 2600 } },
            { label: "Jalisco", values: { superficie: 610, cosecha: 3900 } },
          ]}
          sortBy={{ key: "cosecha", dir: "desc" }}
          bars={[{ key: "cosecha", label: "Cosecha" }]}
          format={(v: number) => new Intl.NumberFormat("es-MX").format(v)}
        />
      </DemoExample>
      <DemoExample
        caption="estrés: 40 filas compactas con barra de nómina"
        code={`import { TableChart } from "@carlos-burelo/klin";

const columns = [
  { key: "nomina", label: "Nómina (mdp)" },
  { key: "obra", label: "Obra (mdp)" },
];

const rows = Array.from({ length: 40 }, (_, i) => ({
  label: \`Municipio \${i + 1}\`,
  values: {
    nomina: 100 + ((i * 37) % 900),
    obra: 50 + ((i * 53) % 450),
  },
}));

<TableChart
  ariaLabel="Presupuesto de 40 municipios con barra de nómina en densidad compacta"
  columns={columns}
  rows={rows}
  bars={[{ key: "nomina", label: "Nómina" }]}
  density="compact"
  format={(v: number) => new Intl.NumberFormat("es-MX").format(v)}
/>`}
      >
        <TableChart
          ariaLabel="Presupuesto de 40 municipios con barra de nómina en densidad compacta"
          columns={[
            { key: "nomina", label: "Nómina (mdp)" },
            { key: "obra", label: "Obra (mdp)" },
          ]}
          rows={filasEstres}
          bars={[{ key: "nomina", label: "Nómina" }]}
          density="compact"
          format={(v: number) => new Intl.NumberFormat("es-MX").format(v)}
        />
      </DemoExample>
    </div>
  );
}
