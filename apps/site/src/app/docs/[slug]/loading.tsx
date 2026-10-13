/** Skeleton mientras el App Router trae la siguiente doc (transición cliente). */
import { Skeleton } from "@/components/ui/skeleton";

export default function DocLoading() {
  return (
    <div
      aria-hidden="true"
      className="grid gap-10 pt-10 lg:grid-cols-[220px_minmax(0,1fr)]"
    >
      <aside className="hidden lg:block">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8" />
          <Skeleton className="h-8" />
          <Skeleton className="h-8" />
          <Skeleton className="h-8" />
        </div>
      </aside>
      <div className="flex flex-col gap-4">
        <Skeleton className="h-10 w-2/3" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-80" />
        <Skeleton className="h-40" />
      </div>
    </div>
  );
}
