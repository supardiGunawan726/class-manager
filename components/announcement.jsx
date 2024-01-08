import { formatTimestamp } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";

export function AnnouncementCard({ announcement, user }) {
  return (
    <Card className="grid gap-1" key={announcement.id}>
      <CardContent className="p-4">
        <span className="text-xs text-slate-500">
          {formatTimestamp(announcement.published_at)}
        </span>
        <CardTitle className="text-lg">{announcement.title}</CardTitle>
        <CardDescription className="text-sm text-slate-900">
          {announcement.content}
        </CardDescription>
      </CardContent>
    </Card>
  );
}
