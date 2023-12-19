import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <main className="px-12 pt-10">
      <header>
        <Skeleton className="w-[600px] h-10" />
      </header>
      <div className="grid place-items-center min-h-[50vh]">
        <div className="flex items-center gap-4">
          <Skeleton className="w-16 h-16" />
          <div className="grid gap-4">
            <Skeleton className="w-96 h-6" />
            <Skeleton className="w-96 h-6" />
          </div>
        </div>
      </div>
    </main>
  );
}
