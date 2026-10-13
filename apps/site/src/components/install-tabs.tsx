"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CopyButton } from "./copy-button";

const MANAGERS = [
  { id: "pnpm", label: "pnpm", cmd: "pnpm add @carlos-burelo/klin" },
  { id: "npm", label: "npm", cmd: "npm i @carlos-burelo/klin" },
  { id: "yarn", label: "yarn", cmd: "yarn add @carlos-burelo/klin" },
  { id: "bun", label: "bun", cmd: "bun add @carlos-burelo/klin" },
] as const;

type ManagerId = (typeof MANAGERS)[number]["id"];

/** Instalación con pestañas por gestor (única isla cliente del héroe). */
export function InstallTabs() {
  const [pm, setPm] = useState<ManagerId>("pnpm");
  const cmd = MANAGERS.find((m) => m.id === pm)?.cmd ?? "";
  return (
    <Card className="gap-0 bg-card/80 py-0 backdrop-blur">
      <CardContent className="flex flex-col gap-1 p-3">
        <fieldset className="flex gap-1 border-0 p-0 px-1">
          <legend className="sr-only">Gestor de paquetes</legend>
          {MANAGERS.map((m) => (
            <button
              key={m.id}
              type="button"
              aria-pressed={pm === m.id}
              onClick={() => setPm(m.id)}
              className={`rounded-md px-2.5 py-1 font-mono text-xs transition-colors ${
                pm === m.id
                  ? "bg-accent font-semibold text-accent-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {m.label}
            </button>
          ))}
        </fieldset>
        <div className="flex flex-wrap items-center gap-2">
          <code
            aria-live="polite"
            className="min-w-0 flex-1 truncate px-2 font-mono text-xs"
          >
            {cmd}
          </code>
          <CopyButton text={cmd} size="xs" />
          <Button
            nativeButton={false}
            variant="link"
            size="sm"
            render={<Link href="/docs/ssr-first" />}
            className="h-auto"
          >
            Guía SSR-first →
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
