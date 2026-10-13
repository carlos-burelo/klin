"use client";

import { CheckIcon, CopyIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

/** Botón copiar reutilizable (server-safe: solo este archivo es cliente). */
export function CopyButton({
  text,
  label = "Copiar",
  className,
  size = "sm",
  variant = "outline",
}: {
  text: string;
  label?: string;
  className?: string;
  size?: "xs" | "sm";
  variant?: "outline" | "ghost";
}) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const area = document.createElement("textarea");
      area.value = text;
      document.body.appendChild(area);
      area.select();
      document.execCommand("copy");
      area.remove();
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      onClick={copy}
      aria-label={copied ? "Copiado" : label}
      className={className}
    >
      {copied ? (
        <CheckIcon data-icon="inline-start" />
      ) : (
        <CopyIcon data-icon="inline-start" />
      )}
      {copied ? "Copiado" : label}
    </Button>
  );
}
