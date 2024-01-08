import { getAnnouncementById } from "@/lib/firebase/admin/db/announcement";
import { AnnouncementDialog } from "./announcement-dialog";
import { unstable_cache } from "next/cache";
import { headers } from "next/headers";
import { getUserDataByUid } from "@/lib/firebase/admin/db/user";
import { notFound } from "next/navigation";

const getCachedCurrentUser = unstable_cache(
  getUserDataByUid,
  ["current-user"],
  { tags: ["current-user"] }
);

const getCachedAnnouncementById = unstable_cache(
  getAnnouncementById,
  ["announcement"],
  { tags: ["announcement"] }
);

const getCachedAnnouncementAuthor = unstable_cache(
  getUserDataByUid,
  ["announcement", "announcement-author"],
  { tags: ["announcement", "announcement-author"] }
);

export default async function AnnouncementPage({ params }) {
  const uid = headers().get("x-uid");
  const user = await getCachedCurrentUser(uid);

  const annoucement = await getCachedAnnouncementById(user.class_id, params.id);
  const annoucementAuthor = await getCachedAnnouncementAuthor(
    annoucement.author
  );

  if (!annoucement) {
    return notFound();
  }

  return (
    <AnnouncementDialog
      user={user}
      author={annoucementAuthor}
      announcement={annoucement}
    />
  );
}
