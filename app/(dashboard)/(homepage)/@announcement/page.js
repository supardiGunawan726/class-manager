import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAnnouncements } from "@/lib/firebase/admin/db/announcement";
import { unstable_cache } from "next/cache";
import { headers } from "next/headers";
import { getUserDataByUid } from "@/lib/firebase/admin/db/user";
import { formatTimestamp } from "@/lib/utils";

const getCachedCurrentUser = unstable_cache(
  async (uid) => getUserDataByUid(uid),
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
          <Card className="grid gap-1" key={announcement.id}>
            <CardHeader className="pb-0">
              <span className="text-xs text-slate-500">
                {formatTimestamp(announcement.published_at)}
              </span>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-900">{announcement.content}</p>
            </CardContent>
          </Card>
        ))}
      </CardContent>
    </Card>
  );
}
