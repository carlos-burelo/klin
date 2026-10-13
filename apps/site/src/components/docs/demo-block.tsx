import type { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";

/** Contenedor de demo viva: gráfica SSR renderizada tal cual. */
export function DemoBlock({ children }: { children: ReactNode }) {
  return (
    <Card>
      <CardContent className="overflow-x-auto p-4 sm:p-6">
        {children}
      </CardContent>
    </Card>
  );
}
