"use client";

import { FileTextIcon, SearchIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from "@/components/ui/command";
import { Kbd } from "@/components/ui/kbd";
import { norm } from "@/lib/utils";
import { DEMOS } from "../../demos/registry";
import { GUIDES } from "../../guias/guides";

/** Buscador global Cmd+K: palette sobre las 74 docs, sin servidor. */
export function DocsSearch() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function go(slug: string) {
    setOpen(false);
    router.push(`/docs/${slug}`);
  }

  return (
    <>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => setOpen(true)}
        aria-label="Buscar documentación (Ctrl+K)"
        className="hidden text-muted-foreground sm:inline-flex"
      >
        <SearchIcon data-icon="inline-start" />
        Buscar docs…
        <Kbd>⌘K</Kbd>
      </Button>
      <Button
        type="button"
        variant="outline"
        size="icon-sm"
        onClick={() => setOpen(true)}
        aria-label="Buscar documentación"
        className="sm:hidden"
      >
        <SearchIcon aria-hidden="true" />
      </Button>
      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        title="Buscar documentación"
        description="Filtra por título, descripción o sección."
      >
        <Command
          filter={(value, search) =>
            norm(value).includes(norm(search)) ? 1 : 0
          }
        >
          <CommandInput placeholder="Busca bar, sankey, gantt…" />
          <CommandList>
            <CommandEmpty>Sin resultados.</CommandEmpty>
            <CommandGroup heading="Conceptos">
              {GUIDES.map((g) => (
                <CommandItem
                  key={g.slug}
                  value={`${g.title} ${g.description} conceptos ${g.slug}`}
                  onSelect={() => go(g.slug)}
                >
                  <FileTextIcon />
                  <span className="min-w-0">
                    <span className="block truncate font-medium">
                      {g.title}
                    </span>
                    <span className="block truncate text-xs text-muted-foreground">
                      Conceptos · {g.description}
                    </span>
                  </span>
                  <CommandShortcut>/{g.slug}</CommandShortcut>
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandGroup heading="Documentación">
              {DEMOS.map((d) => (
                <CommandItem
                  key={d.slug}
                  value={`${d.title} ${d.description} ${d.section} ${d.slug}`}
                  onSelect={() => go(d.slug)}
                >
                  <FileTextIcon />
                  <span className="min-w-0">
                    <span className="block truncate font-medium">
                      {d.title}
                    </span>
                    <span className="block truncate text-xs text-muted-foreground">
                      {d.section} · {d.description}
                    </span>
                  </span>
                  <CommandShortcut>/{d.slug}</CommandShortcut>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  );
}
