import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAnnouncements } from "@/lib/firebase/admin/db/announcement";
import { unstable_cache } from "next/cache";
import { getCurrentUser } from "@/lib/firebase/admin/db/user";
import { AnnouncementCard } from "@/components/announcement";

const getCachedAllAnnouncements = unstable_cache(
  getAnnouncements,
  ["announcements"],
  { tags: ["announcements"] }
);

export default async function Announcement() {
  const user = await getCurrentUser();
  const announcements = await getCachedAllAnnouncements(user.class_id);
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
          <AnnouncementCard
            key={announcement.id}
            announcement={announcement}
            user={user}
          />
        ))}
      </CardContent>
    </Card>
  );
}
