import type { SequenceMessage } from "@carlos-burelo/klin";
import { SequenceDiagram } from "@carlos-burelo/klin";
import { DemoExample } from "../../components/docs/demo-example";

const citaParticipants = ["Paciente", "Recepción", "Médico", "Farmacia"];

const citaMessages: SequenceMessage[] = [
  { from: "Paciente", to: "Recepción", label: "Pide cita" },
  { from: "Recepción", to: "Médico", label: "Agenda consulta" },
  { from: "Médico", to: "Recepción", label: "Envía receta", kind: "return" },
  { from: "Recepción", to: "Farmacia", label: "Turna receta" },
  { from: "Farmacia", to: "Paciente", label: "Entrega medicamento" },
];

const inscripcionParticipants = ["Alumno", "Portal", "Control"];

const inscripcionMessages: SequenceMessage[] = [
  { from: "Alumno", to: "Portal", label: "Elige materias" },
  { from: "Portal", to: "Portal", label: "Valida cupo interno" },
  { from: "Portal", to: "Control", label: "Registra inscripción" },
  { from: "Control", to: "Portal", label: "Confirma folio", kind: "return" },
];

const estresParticipants = ["Cliente", "App", "API", "Pagos", "Cola", "Banco"];

const estresMessages: SequenceMessage[] = [
  { from: "Cliente", to: "App", label: "Inicia compra" },
  { from: "App", to: "API", label: "Crea pedido" },
  { from: "API", to: "API", label: "Valida inventario" },
  { from: "API", to: "Pagos", label: "Reserva cargo" },
  { from: "Pagos", to: "Banco", label: "Autoriza tarjeta" },
  { from: "Banco", to: "Pagos", label: "Aprueba", kind: "return" },
  { from: "Pagos", to: "API", label: "Confirma reserva", kind: "return" },
  { from: "API", to: "Cola", label: "Encola surtido" },
  { from: "Cola", to: "Banco", label: "Concilia pago" },
  { from: "Banco", to: "Cola", label: "Envía corte", kind: "return" },
  { from: "Cola", to: "API", label: "Marca listo", kind: "return" },
  { from: "API", to: "App", label: "Notifica avance", kind: "return" },
  { from: "App", to: "Cliente", label: "Muestra rastreo", kind: "return" },
  { from: "Cliente", to: "App", label: "Confirma entrega" },
  { from: "App", to: "API", label: "Cierra pedido" },
];

export default function SequenceDiagramExamples() {
  return (
    <div className="flex flex-col gap-6">
      <DemoExample
        caption="cita médica con mensaje de retorno punteado"
        code={`import { SequenceDiagram } from "@carlos-burelo/klin";

const participants = ["Paciente", "Recepción", "Médico", "Farmacia"];

const messages = [
  { from: "Paciente", to: "Recepción", label: "Pide cita" },
  { from: "Recepción", to: "Médico", label: "Agenda consulta" },
  { from: "Médico", to: "Recepción", label: "Envía receta", kind: "return" },
  { from: "Recepción", to: "Farmacia", label: "Turna receta" },
  { from: "Farmacia", to: "Paciente", label: "Entrega medicamento" },
];

<SequenceDiagram
  ariaLabel="Secuencia de cita médica entre paciente, recepción, médico y farmacia"
  participants={participants}
  messages={messages}
/>`}
      >
        <SequenceDiagram
          ariaLabel="Secuencia de cita médica entre paciente, recepción, médico y farmacia"
          participants={citaParticipants}
          messages={citaMessages}
        />
      </DemoExample>
      <DemoExample
        caption="inscripción con auto-mensaje de validación interna"
        code={`import { SequenceDiagram } from "@carlos-burelo/klin";

const participants = ["Alumno", "Portal", "Control"];

const messages = [
  { from: "Alumno", to: "Portal", label: "Elige materias" },
  { from: "Portal", to: "Portal", label: "Valida cupo interno" },
  { from: "Portal", to: "Control", label: "Registra inscripción" },
  { from: "Control", to: "Portal", label: "Confirma folio", kind: "return" },
];

<SequenceDiagram
  ariaLabel="Secuencia de inscripción con validación interna del portal"
  participants={participants}
  messages={messages}
/>`}
      >
        <SequenceDiagram
          ariaLabel="Secuencia de inscripción con validación interna del portal"
          participants={inscripcionParticipants}
          messages={inscripcionMessages}
        />
      </DemoExample>
      <DemoExample
        caption="misma inscripción con leyenda de llamada y retorno"
        code={`import { SequenceDiagram } from "@carlos-burelo/klin";

const participants = ["Alumno", "Portal", "Control"];

const messages = [
  { from: "Alumno", to: "Portal", label: "Elige materias" },
  { from: "Portal", to: "Portal", label: "Valida cupo interno" },
  { from: "Portal", to: "Control", label: "Registra inscripción" },
  { from: "Control", to: "Portal", label: "Confirma folio", kind: "return" },
];

<SequenceDiagram
  ariaLabel="Secuencia de inscripción con leyenda visible"
  participants={participants}
  messages={messages}
  showLegend
/>`}
      >
        <SequenceDiagram
          ariaLabel="Secuencia de inscripción con leyenda visible"
          participants={inscripcionParticipants}
          messages={inscripcionMessages}
          showLegend
        />
      </DemoExample>
      <DemoExample
        caption="estrés de compra con 6 participantes y 15 mensajes cruzados"
        code={`import { SequenceDiagram } from "@carlos-burelo/klin";

const participants = ["Cliente", "App", "API", "Pagos", "Cola", "Banco"];

const messages = [
  { from: "Cliente", to: "App", label: "Inicia compra" },
  { from: "App", to: "API", label: "Crea pedido" },
  { from: "API", to: "API", label: "Valida inventario" },
  { from: "API", to: "Pagos", label: "Reserva cargo" },
  { from: "Pagos", to: "Banco", label: "Autoriza tarjeta" },
  { from: "Banco", to: "Pagos", label: "Aprueba", kind: "return" },
  { from: "Pagos", to: "API", label: "Confirma reserva", kind: "return" },
  { from: "API", to: "Cola", label: "Encola surtido" },
  { from: "Cola", to: "Banco", label: "Concilia pago" },
  { from: "Banco", to: "Cola", label: "Envía corte", kind: "return" },
  { from: "Cola", to: "API", label: "Marca listo", kind: "return" },
  { from: "API", to: "App", label: "Notifica avance", kind: "return" },
  { from: "App", to: "Cliente", label: "Muestra rastreo", kind: "return" },
  { from: "Cliente", to: "App", label: "Confirma entrega" },
  { from: "App", to: "API", label: "Cierra pedido" },
];

<SequenceDiagram
  ariaLabel="Secuencia densa de compra con seis participantes y quince mensajes"
  participants={participants}
  messages={messages}
/>`}
      >
        <SequenceDiagram
          ariaLabel="Secuencia densa de compra con seis participantes y quince mensajes"
          participants={estresParticipants}
          messages={estresMessages}
        />
      </DemoExample>
    </div>
  );
}
