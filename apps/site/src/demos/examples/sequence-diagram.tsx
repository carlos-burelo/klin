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
    </div>
  );
}
