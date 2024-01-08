import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAnnouncements } from "@/lib/firebase/admin/db/announcement";
import { unstable_cache } from "next/cache";
import { headers } from "next/headers";
import { getUserDataByUid } from "@/lib/firebase/admin/db/user";
import { AnnouncementCard } from "@/components/announcement";

const getCachedCurrentUser = unstable_cache(
  getUserDataByUid,
  ["current-user"],
  { tags: ["current-user"] }
);

export default async function Announcement() {
  const uid = headers().get("x-uid");
  const user = await getCachedCurrentUser(uid);

  const announcements = await getAnnouncements(user.class_id);
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
