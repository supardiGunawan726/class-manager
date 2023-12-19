import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <Card className="max-w-sm mx-auto mt-24">
      <CardHeader className="flex flex-col items-center">
        <Skeleton className="w-[180px] h-7" />
        <Skeleton className="w-[100px] h-5" />
      </CardHeader>
      <CardContent className="grid gap-3">
        <div className="grid gap-2">
          <Skeleton className="w-[80px] h-4" />
          <Skeleton className="w-full h-7" />
        </div>
        <div className="grid gap-2">
          <Skeleton className="w-[80px] h-4" />
          <Skeleton className="w-full h-7" />
        </div>
        <div className="grid gap-2">
          <Skeleton className="w-[80px] h-4" />
          <Skeleton className="w-full h-7" />
        </div>
        <div className="grid gap-2">
          <Skeleton className="w-[80px] h-4" />
          <Skeleton className="w-full h-7" />
        </div>
      </CardContent>
      <CardFooter className="grid gap-2">
        <Skeleton className="w-full h-7" />
        <Skeleton className="w-full h-7" />
      </CardFooter>
    </Card>
  );
}
