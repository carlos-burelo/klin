"use client";

import { ThumbsDownIcon, ThumbsUpIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

/** Feedback local por doc ("¿Te sirvió?"), guardado en localStorage. */
export function DocFeedback({ slug }: { slug: string }) {
  const [vote, setVote] = useState<"up" | "down" | null>(null);

  useEffect(() => {
    try {
      const v = localStorage.getItem(`klin-feedback-${slug}`);
      if (v === "up" || v === "down") setVote(v);
    } catch {
      // Sin almacenamiento: sin memoria de voto.
    }
  }, [slug]);

  function send(v: "up" | "down") {
    setVote(v);
    try {
      localStorage.setItem(`klin-feedback-${slug}`, v);
    } catch {
      // Solo sesión.
    }
  }

  return (
    <Card>
      <CardContent className="flex flex-wrap items-center gap-3">
        <p className="text-sm font-medium">¿Te sirvió esta página?</p>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant={vote === "up" ? "secondary" : "outline"}
            size="icon-sm"
            onClick={() => send("up")}
            aria-pressed={vote === "up"}
            aria-label="Sí, me sirvió"
          >
            <ThumbsUpIcon aria-hidden="true" />
          </Button>
          <Button
            type="button"
            variant={vote === "down" ? "secondary" : "outline"}
            size="icon-sm"
            onClick={() => send("down")}
            aria-pressed={vote === "down"}
            aria-label="No, puede mejorar"
          >
            <ThumbsDownIcon aria-hidden="true" />
          </Button>
        </div>
        <span className="text-xs text-muted-foreground">
          {vote
            ? "Gracias — lo usamos para priorizar qué docs pulir."
            : "Vota y abre un issue con lo que faltó."}
        </span>
        <Button
          nativeButton={false}
          variant="link"
          size="sm"
          render={
            <Link
              href={`https://github.com/carlos-burelo/klin/issues/new?title=Docs: ${slug}`}
            />
          }
          className="ml-auto"
        >
          Reportar hueco
        </Button>
      </CardContent>
    </Card>
  );
}
