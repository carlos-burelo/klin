import { Sparkline } from "@carlos-burelo/klin";
import { DemoExample } from "../../components/docs/demo-example";

const alza = [12, 15, 14, 18, 22, 27, 31];
const caida = [48, 44, 45, 38, 33, 29, 24];
const meseta = [20, 20, 0, 0, 22, 22, 23];

const estresSpark: number[] = Array.from({ length: 400 }, (_, i) =>
  Math.round(50 + 30 * Math.sin(i / 9) + ((i * 7) % 13)),
);

export default function SparklineExamples() {
  return (
    <div className="flex flex-col gap-6">
      <DemoExample
        caption="tendencia al alza en ventas"
        code={`import { Sparkline } from "@carlos-burelo/klin";

const alza = [12, 15, 14, 18, 22, 27, 31];

<Sparkline
  values={alza}
  ariaLabel="Ventas semanales al alza de 12 a 31"
/>`}
      >
        <div className="flex items-center gap-3">
          <span className="text-sm">Ventas</span>
          <Sparkline
            values={alza}
            ariaLabel="Ventas semanales al alza de 12 a 31"
          />
        </div>
      </DemoExample>
      <DemoExample
        caption="tendencia a la baja con color de alerta"
        code={`import { Sparkline } from "@carlos-burelo/klin";

const caida = [48, 44, 45, 38, 33, 29, 24];

<Sparkline
  values={caida}
  color="var(--chart-5)"
  ariaLabel="Reservas semanales a la baja de 48 a 24"
/>`}
      >
        <div className="flex items-center gap-3">
          <span className="text-sm">Reservas</span>
          <Sparkline
            values={caida}
            color="var(--chart-5)"
            ariaLabel="Reservas semanales a la baja de 48 a 24"
          />
        </div>
      </DemoExample>
      <DemoExample
        caption="serie con ceros y color de recuperación"
        code={`import { Sparkline } from "@carlos-burelo/klin";

const meseta = [20, 20, 0, 0, 22, 22, 23];

<Sparkline
  values={meseta}
  color="var(--chart-2)"
  ariaLabel="Asistencia con dos días en cero y recuperación a 23"
/>`}
      >
        <div className="flex items-center gap-3">
          <span className="text-sm">Asistencia</span>
          <Sparkline
            values={meseta}
            color="var(--chart-2)"
            ariaLabel="Asistencia con dos días en cero y recuperación a 23"
          />
        </div>
      </DemoExample>
      <DemoExample
        caption="estrés: 400 puntos con generador determinista y marcas de mínimo y máximo"
        code={`import { Sparkline } from "@carlos-burelo/klin";

const estres = Array.from({ length: 400 }, (_, i) =>
  Math.round(50 + 30 * Math.sin(i / 9) + ((i * 7) % 13)),
);

<Sparkline
  values={estres}
  showMinMax
  ariaLabel="Lecturas de sensor con 400 puntos deterministas"
/>`}
      >
        <div className="flex items-center gap-3">
          <span className="text-sm">Sensor</span>
          <Sparkline
            values={estresSpark}
            showMinMax
            ariaLabel="Lecturas de sensor con 400 puntos deterministas"
          />
        </div>
      </DemoExample>
    </div>
  );
}
