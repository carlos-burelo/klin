"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Lleva el contenido arriba al cambiar de doc. Las transiciones del
 * App Router entre slugs reutilizan el layout y no siempre reinician
 * el scroll: esto lo garantiza.
 */
export function ScrollTop() {
  const pathname = usePathname();
  // biome-ignore lint/correctness/useExhaustiveDependencies: pathname dispara el efecto al cambiar de doc.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}
