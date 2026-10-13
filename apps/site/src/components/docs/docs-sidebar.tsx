"use client";

import { ArrowLeftIcon, SearchIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { DEMOS, type DemoSection } from "../../demos/registry";

const ORDER: DemoSection[] = ["Gráficas", "Diagramas", "Utilidades"];

function norm(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

/** Sidebar docs con filtro, conteos y scroll de la activa a la vista. */
export function DocsSidebar({ active }: { active?: string }) {
  const [q, setQ] = useState("");
  const activeRef = useRef<HTMLAnchorElement>(null);

  const filtered = useMemo(() => {
    const nq = norm(q.trim());
    if (!nq) return DEMOS;
    return DEMOS.filter((d) =>
      norm(`${d.title} ${d.description} ${d.slug}`).includes(nq),
    );
  }, [q]);

  useEffect(() => {
    activeRef.current?.scrollIntoView({ block: "nearest" });
  }, []);

  return (
    <nav aria-label="Documentación" className="flex flex-col gap-4">
      <Button
        nativeButton={false}
        variant="ghost"
        size="sm"
        render={
          <Link href="/docs">
            <ArrowLeftIcon data-icon="inline-start" />
            Índice
          </Link>
        }
        className="self-start text-muted-foreground"
      />
      <InputGroup>
        <InputGroupInput
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Filtrar…"
          aria-label="Filtrar documentación"
        />
        <InputGroupAddon>
          <SearchIcon aria-hidden="true" />
        </InputGroupAddon>
      </InputGroup>
      {ORDER.map((section) => {
        const items = filtered.filter((d) => d.section === section);
        if (items.length === 0) return null;
        return (
          <div key={section}>
            <p className="flex items-center justify-between pb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              {section}
              <Badge variant="secondary">{items.length}</Badge>
            </p>
            <ul className="flex flex-col gap-0.5">
              {items.map((d) => {
                const isActive = d.slug === active;
                return (
                  <li key={d.slug}>
                    <Link
                      ref={isActive ? activeRef : undefined}
                      href={`/docs/${d.slug}`}
                      aria-current={isActive ? "page" : undefined}
                      title={d.description}
                      className={
                        isActive
                          ? "block rounded-lg bg-accent px-2.5 py-1.5 text-[13px] font-medium text-accent-foreground"
                          : "block rounded-lg px-2.5 py-1.5 text-[13px] text-muted-foreground hover:bg-muted hover:text-foreground"
                      }
                    >
                      {d.title}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
      {filtered.length === 0 ? (
        <p className="text-[13px] text-muted-foreground">
          Sin coincidencias para “{q}”.
        </p>
      ) : null}
    </nav>
  );
}
