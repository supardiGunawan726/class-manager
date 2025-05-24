import { cn, formatTimestamp } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { Announcement } from "@/lib/firebase/model/announcement";

type AnnouncementCardProps = {
  announcement: Announcement;
};

export function AnnouncementCard({ announcement }: AnnouncementCardProps) {
  return (
    <Card className="grid gap-1" key={announcement.id}>
      <CardContent className="p-4">
        <span className="text-xs text-slate-500">
          {formatTimestamp(announcement.published_at)}
        </span>
        <CardTitle className="text-lg mt-1.5 leading-tight p-0">
          <Link
            href={`/announcement/${announcement.id}`}
            className="hover:underline"
          >
            {announcement.title}
          </Link>
        </CardTitle>
        <CardDescription className="text-sm text-slate-900 mt-1">
          {announcement.content}
        </CardDescription>
      </CardContent>
    </Card>
  );
}
