import { LightbulbIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import type { Guide } from "../../guias/guides";
import { CodeBlock } from "../code-block";

function headingId(heading: string): string {
  return heading
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-");
}

/** Cuerpo de guía conceptual (secciones + código + consejos). */
export function GuideArticle({ guide }: { guide: Guide }) {
  return (
    <article className="flex min-w-0 max-w-3xl flex-col gap-4">
      {guide.sections.map((s) => (
        <section key={s.heading}>
          <h2
            id={headingId(s.heading)}
            className="mt-10 scroll-mt-24 border-b border-border pb-2 text-xl font-semibold tracking-tight"
          >
            {s.heading}
          </h2>
          <div className="flex flex-col gap-3 pt-3">
            {s.body.map((p) => (
              <p
                key={p.slice(0, 32)}
                className="text-sm leading-7 text-muted-foreground"
              >
                {p}
              </p>
            ))}
          </div>
          {s.code ? (
            <div className="pt-4">
              <CodeBlock
                title={s.code.title}
                lang={s.code.lang}
                code={s.code.code}
              />
            </div>
          ) : null}
          {s.tip ? (
            <div className="pt-4">
              <Alert>
                <LightbulbIcon />
                <AlertTitle>Consejo</AlertTitle>
                <AlertDescription>{s.tip}</AlertDescription>
              </Alert>
            </div>
          ) : null}
        </section>
      ))}
    </article>
  );
}
