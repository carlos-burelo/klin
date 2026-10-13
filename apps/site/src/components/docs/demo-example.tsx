import { codeToHtml } from "shiki";
import { DemoWrapper } from "./demo-wrapper";

const THEMES = {
  light: "github-light",
  dark: "github-dark",
} as const;

/**
 * Ejemplo de doc: vista previa viva + tabs preview/código + copiar.
 * Server Component async: resalta el snippet en build con shiki y se lo
 * pasa ya renderizado al wrapper cliente (cero resaltado en el browser).
 */
export async function DemoExample({
  caption,
  code,
  children,
}: {
  caption: string;
  /** Snippet TSX autocontenido (imports + datos + JSX), lo que se copia. */
  code: string;
  children: React.ReactNode;
}) {
  const highlighted = await codeToHtml(code.trim(), {
    lang: "tsx",
    themes: THEMES,
    defaultColor: false,
    transformers: [
      {
        pre(node) {
          delete node.properties.style;
        },
      },
    ],
  });

  return (
    <DemoWrapper caption={caption} code={code.trim()} highlighted={highlighted}>
      {children}
    </DemoWrapper>
  );
}
