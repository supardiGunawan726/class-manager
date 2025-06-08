import Link from "next/link";
import * as Icon from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Discussion } from "@/lib/firebase/model/discussion";

type DiscussionListProps = {
  discussions: Discussion[];
};

export function DiscussionList({ discussions }: DiscussionListProps) {
  return (
    <div className="mt-4">
      {discussions?.length < 1 && (
        <div className="flex flex-col items-center justify-center gap-4 min-h-[500px]">
          <p className="text-sm text-slate-500 text-center">
            Belum ada diskusi
          </p>
        </div>
      )}
      {discussions?.length > 0 && (
        <div className="grid grid-cols-6 gap-6">
          {discussions.map((discussion) => (
            <Link href={`/discussion/${discussion.id}`} key={discussion.id}>
              <div className="grid gap-2">
                <Card className="aspect-square bg-green-100 border-none">
                  <CardContent className="w-full h-full p-0 grid place-items-center text-green-500">
                    <Icon.MessageSquare width={48} height={48} />
                  </CardContent>
                </Card>
                <p className="text-center text-lg font-medium">
                  {discussion.name}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
