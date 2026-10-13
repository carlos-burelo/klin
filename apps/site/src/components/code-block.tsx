import { codeToHtml } from "shiki";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { CopyButton } from "./copy-button";

const THEMES = {
  light: "github-light",
  dark: "github-dark",
} as const;

/**
 * Bloque de código con resaltado en build (shiki, cero JS cliente).
 * Mismo dual-theme que los MDX: `globals.css` conmuta los tokens con .dark.
 */
export async function CodeBlock({
  code,
  lang,
  title,
  bare = false,
}: {
  code: string;
  lang: "tsx" | "bash" | "css";
  title?: string;
  /** Sin ventana: solo el bloque resaltado (para anidar en tarjetas). */
  bare?: boolean;
}) {
  const html = await codeToHtml(code.trim(), {
    lang,
    themes: THEMES,
    defaultColor: false,
    transformers: [
      {
        // El fondo lo pone el contenedor (bg-card); shiki solo colorea tokens.
        pre(node) {
          delete node.properties.style;
        },
      },
    ],
  });

  const body = (
    <div
      className="code-block overflow-x-auto p-4 font-mono text-xs leading-relaxed"
      // biome-ignore lint/security/noDangerouslySetInnerHtml: HTML generado en build por shiki desde strings locales
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );

  if (bare) {
    return (
      <Card className="gap-0 overflow-hidden bg-background py-0">
        <CardContent className="px-0">{body}</CardContent>
      </Card>
    );
  }

  return (
    <Card className="gap-0 overflow-hidden py-0">
      <CardHeader className="flex flex-row items-center gap-1.5 border-b py-2">
        <span aria-hidden="true" className="size-2.5 rounded-full bg-border" />
        <span aria-hidden="true" className="size-2.5 rounded-full bg-border" />
        <span aria-hidden="true" className="size-2.5 rounded-full bg-border" />
        {title ? (
          <span className="pl-2 font-mono text-[11px] text-muted-foreground">
            {title}
          </span>
        ) : null}
        <span className="ml-auto">
          <CopyButton text={code.trim()} size="xs" variant="ghost" />
        </span>
      </CardHeader>
      <CardContent className="px-0">{body}</CardContent>
    </Card>
  );
}
