"use client";

import { ArrowUpRightIcon, SearchIcon } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { norm } from "@/lib/utils";
import { DEMO_SECTIONS, DEMOS, type DemoSection } from "../../demos/registry";

const TABS: Array<"Todas" | DemoSection> = ["Todas", ...DEMO_SECTIONS];

/** Explorador filtrable del catálogo (landing + índice docs, cliente). */
export function CatalogExplorer({ compact = false }: { compact?: boolean }) {
  const [q, setQ] = useState("");
  const [tab, setTab] = useState<(typeof TABS)[number]>("Todas");

  const list = useMemo(() => {
    const nq = norm(q.trim());
    return DEMOS.filter((d) => {
      if (tab !== "Todas" && d.section !== tab) return false;
      if (!nq) return true;
      return norm(`${d.title} ${d.description} ${d.slug}`).includes(nq);
    });
  }, [q, tab]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <InputGroup className="flex-1">
          <InputGroupInput
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={`Filtra entre ${DEMOS.length}… (bar, sankey, gantt)`}
            aria-label="Filtrar componentes"
          />
          <InputGroupAddon>
            <SearchIcon aria-hidden="true" />
          </InputGroupAddon>
        </InputGroup>
        <ToggleGroup
          aria-label="Filtrar por sección"
          value={[tab]}
          onValueChange={(v) => {
            const next = v[v.length - 1];
            if (next) setTab(next as (typeof TABS)[number]);
          }}
        >
          {TABS.map((t) => (
            <ToggleGroupItem key={t} value={t} aria-label={t}>
              {t}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>
      <p
        aria-live="polite"
        className="font-mono text-[11px] text-muted-foreground"
      >
        {list.length} de {DEMOS.length}
        {q ? ` para “${q}”` : ""}
        {tab !== "Todas" ? ` en ${tab}` : ""}
      </p>
      {compact ? (
        <div className="flex flex-wrap gap-1.5">
          {list.map((d) => (
            <Badge
              key={d.slug}
              variant="outline"
              render={<Link href={`/docs/${d.slug}`} title={d.description} />}
            >
              {d.title}
            </Badge>
          ))}
        </div>
      ) : (
        <Card className="gap-0 py-0">
          <CardContent className="px-0">
            {list.map((d, i) => (
              <Link
                key={d.slug}
                href={`/docs/${d.slug}`}
                className="group flex items-center gap-4 border-b border-border px-4 py-3 transition-colors last:border-0 hover:bg-muted/60 sm:px-5"
              >
                <span className="w-7 shrink-0 font-mono text-[11px] text-muted-foreground">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="flex min-w-0 flex-col gap-0.5">
                  <span className="flex items-center gap-2 truncate text-sm font-semibold group-hover:underline">
                    {d.title}
                    <Badge variant="secondary">{d.section}</Badge>
                  </span>
                  <span className="truncate text-[13px] text-muted-foreground">
                    {d.description}
                  </span>
                </span>
                <ArrowUpRightIcon
                  aria-hidden="true"
                  className="ml-auto size-4 shrink-0 text-muted-foreground opacity-0 transition-all group-hover:translate-x-0.5 group-hover:text-primary group-hover:opacity-100"
                />
              </Link>
            ))}
            {list.length === 0 ? (
              <p className="px-5 py-8 text-center text-sm text-muted-foreground">
                Sin coincidencias. Prueba “bar”, “flujo” o “mapa”.
              </p>
            ) : null}
          </CardContent>
        </Card>
      )}
      {compact && list.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Sin coincidencias. Prueba “bar”, “flujo” o “mapa”.
        </p>
      ) : null}
    </div>
  );
}
