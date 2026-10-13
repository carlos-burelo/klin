"use client";

import { CodeXmlIcon, EyeIcon } from "lucide-react";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CopyButton } from "../copy-button";

/**
 * Ejemplo de doc: Preview/Code con Tabs + copiar.
 * El HTML resaltado se genera en build y llega por props
 * (este componente no resalta nada en el cliente).
 */
export function DemoWrapper({
  caption,
  code,
  highlighted,
  children,
}: {
  caption: string;
  /** Fuente TSX del ejemplo (lo que se copia). */
  code: string;
  /** Misma fuente resaltada en build (shiki). */
  highlighted: string;
  children: React.ReactNode;
}) {
  const [tab, setTab] = useState("preview");

  return (
    <Tabs value={tab} onValueChange={setTab}>
      <Card className="gap-0 overflow-hidden py-0">
        <CardHeader className="flex flex-row items-center justify-between gap-2 border-b py-2">
          <TabsList aria-label={`Vista de ${caption}`}>
            <TabsTrigger value="preview">
              <EyeIcon data-icon="inline-start" />
              Preview
            </TabsTrigger>
            <TabsTrigger value="code">
              <CodeXmlIcon data-icon="inline-start" />
              Code
            </TabsTrigger>
          </TabsList>
          <CopyButton text={code} variant="ghost" size="xs" />
        </CardHeader>
        <TabsContent value="preview">
          <CardContent className="overflow-x-auto p-4 sm:p-6">
            {children}
          </CardContent>
        </TabsContent>
        <TabsContent value="code">
          <CardContent className="overflow-x-auto p-4 font-mono text-xs leading-relaxed">
            <div
              className="code-block"
              // biome-ignore lint/security/noDangerouslySetInnerHtml: HTML generado en build por shiki desde strings locales
              dangerouslySetInnerHTML={{ __html: highlighted }}
            />
          </CardContent>
        </TabsContent>
        <CardFooter className="border-t bg-transparent px-4 py-2 font-mono text-[11px] text-muted-foreground">
          {caption}
        </CardFooter>
      </Card>
    </Tabs>
  );
}
