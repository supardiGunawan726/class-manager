import type { Announcement } from "@/lib/firebase/model/announcement";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { AnnouncementCard } from "../announcement";

type AnnouncementProps = {
  announcements: Announcement[];
};

export default function Announcement({ announcements }: AnnouncementProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Pengumuman</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        {announcements.length === 0 && (
          <p className="text-sm text-slate-500 text-center">
            Tidak ada pengumuman
          </p>
        )}
        {announcements.map((announcement) => (
          <AnnouncementCard key={announcement.id} announcement={announcement} />
        ))}
      </CardContent>
    </Card>
  );
}
