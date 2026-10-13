import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type PropRow = {
  name: string;
  type: string;
  required?: boolean;
  default?: string;
  description: string;
};

/**
 * Tabla de props (datos por MDX, sin introspección).
 * Requeridas con badge, opcionales apagadas, tipo mono legible.
 */
export function PropsTable({ props }: { props: PropRow[] }) {
  const req = props.filter((p) => p.required).length;
  return (
    <div className="flex flex-col gap-2">
      <p
        aria-live="polite"
        className="font-mono text-[11px] text-muted-foreground"
      >
        {props.length} props · {req} requeridas
      </p>
      <Card className="gap-0 py-0">
        <CardContent className="px-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Prop</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Descripción</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {props.map((p) => (
                <TableRow key={p.name}>
                  <TableCell className="font-mono text-[12px] whitespace-normal">
                    <span className="font-semibold">{p.name}</span>{" "}
                    {p.required ? (
                      <Badge>req</Badge>
                    ) : (
                      <Badge variant="outline">opc</Badge>
                    )}
                    {p.default ? (
                      <span className="mt-1 block w-fit rounded border border-border bg-muted px-1 font-mono text-[11px] text-muted-foreground">
                        = {p.default}
                      </span>
                    ) : null}
                  </TableCell>
                  <TableCell className="max-w-56 font-mono text-[12px] break-words whitespace-normal text-muted-foreground">
                    {p.type}
                  </TableCell>
                  <TableCell className="text-[13px] leading-6 whitespace-normal text-muted-foreground">
                    {p.description === "—" ? (
                      <span className="text-muted-foreground/60">
                        Sin descripción aún —{" "}
                        <Link
                          href="https://github.com/carlos-burelo/klin/issues/new"
                          className="underline underline-offset-4 hover:text-foreground"
                        >
                          pide docs
                        </Link>
                        .
                      </span>
                    ) : (
                      p.description
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
