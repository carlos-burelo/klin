import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import Link from "next/link";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { DEMOS } from "../../demos/registry";

/** Anterior/siguiente con sección y descripción, no solo título. */
export function DocsPager({ slug }: { slug: string }) {
  const index = DEMOS.findIndex((d) => d.slug === slug);
  if (index < 0) return null;
  const prev = DEMOS[(index - 1 + DEMOS.length) % DEMOS.length];
  const next = DEMOS[(index + 1) % DEMOS.length];
  if (!prev || !next) return null;
  return (
    <nav aria-label="Paginación" className="flex flex-col gap-3">
      <Separator />
      <div className="grid gap-3 pt-3 sm:grid-cols-2">
        <Link
          href={`/docs/${prev.slug}`}
          className="group"
          aria-label={`Anterior: ${prev.title}`}
        >
          <Card className="transition-colors group-hover:ring-ring">
            <CardHeader>
              <CardDescription className="inline-flex items-center gap-1.5">
                <ArrowLeftIcon
                  aria-hidden="true"
                  className="transition-transform group-hover:-translate-x-0.5"
                />
                Anterior · {prev.section}
              </CardDescription>
              <CardTitle>{prev.title}</CardTitle>
              <CardDescription className="truncate">
                {prev.description}
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>
        <Link
          href={`/docs/${next.slug}`}
          className="group text-right"
          aria-label={`Siguiente: ${next.title}`}
        >
          <Card className="transition-colors group-hover:ring-ring">
            <CardHeader>
              <CardDescription className="inline-flex items-center justify-end gap-1.5">
                Siguiente · {next.section}
                <ArrowRightIcon
                  aria-hidden="true"
                  className="transition-transform group-hover:translate-x-0.5"
                />
              </CardDescription>
              <CardTitle>{next.title}</CardTitle>
              <CardDescription className="truncate">
                {next.description}
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>
      </div>
    </nav>
  );
}
