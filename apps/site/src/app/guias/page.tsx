import { ArrowRightIcon, BookOpenIcon } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { GUIDES } from "../../guias/guides";

export const metadata: Metadata = {
  title: "Guías — klin",
  description:
    "Conceptos klin: SSR-first, tema por tokens, tooltip portal y accesibilidad.",
};

/** Índice de guías conceptuales. */
export default function GuiasPage() {
  return (
    <div className="flex flex-col gap-10 pt-14">
      <section className="flex max-w-2xl flex-col gap-3">
        <Badge variant="secondary" className="w-fit font-mono">
          <BookOpenIcon />
          Guías · {GUIDES.length}
        </Badge>
        <h1 className="text-4xl font-bold tracking-tighter text-balance sm:text-5xl">
          Conceptos <span className="text-primary">una sola vez</span>.
        </h1>
        <p className="text-base leading-7 text-muted-foreground text-balance">
          Lo que todas las páginas de docs asumen: cómo rinde el SSR, cómo
          funciona el tema, cuándo usar el portal y el contrato de
          accesibilidad.
        </p>
      </section>
      <div className="grid gap-3 md:grid-cols-2">
        {GUIDES.map((g, i) => (
          <Link key={g.slug} href={`/guias/${g.slug}`} className="group">
            <Card className="h-full transition-all group-hover:-translate-y-0.5 group-hover:ring-ring group-hover:shadow-xl group-hover:shadow-primary/5">
              <CardHeader>
                <CardDescription className="font-mono text-[11px]">
                  {String(i + 1).padStart(2, "0")} · /guias/{g.slug}
                </CardDescription>
                <CardTitle className="text-lg group-hover:underline">
                  {g.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                <p className="text-sm leading-6 text-muted-foreground">
                  {g.description}
                </p>
                <span className="inline-flex items-center gap-1 text-[13px] font-medium text-primary">
                  Leer guía
                  <ArrowRightIcon
                    aria-hidden="true"
                    className="size-3.5 transition-transform group-hover:translate-x-0.5"
                  />
                </span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
