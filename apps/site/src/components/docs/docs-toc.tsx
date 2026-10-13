"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Heading = { id: string; text: string };

/** TOC "En esta página": lee los h2 del artículo y resalta el visible. */
export function DocsToc() {
  const [heads, setHeads] = useState<Heading[]>([]);
  const [active, setActive] = useState("");

  useEffect(() => {
    const els = Array.from(
      document.querySelectorAll<HTMLElement>("article h2[id]"),
    ).map((h) => ({ id: h.id, text: h.innerText }));
    setHeads(els);
    if (els[0]) setActive(els[0].id);

    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(e.target.id);
        }
      },
      { rootMargin: "-20% 0px -70% 0px" },
    );
    for (const h of document.querySelectorAll("article h2[id]")) obs.observe(h);
    return () => obs.disconnect();
  }, []);

  if (heads.length === 0) return null;

  return (
    <nav aria-label="En esta página" className="flex flex-col gap-1">
      <p className="pb-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        En esta página
      </p>
      {heads.map((h) => (
        <Link
          key={h.id}
          href={`#${h.id}`}
          aria-current={h.id === active ? "true" : undefined}
          className={
            h.id === active
              ? "border-l-2 border-primary pl-3 py-1 text-[13px] font-medium text-foreground"
              : "border-l-2 border-transparent pl-3 py-1 text-[13px] text-muted-foreground hover:text-foreground"
          }
        >
          {h.text}
        </Link>
      ))}
    </nav>
  );
}
