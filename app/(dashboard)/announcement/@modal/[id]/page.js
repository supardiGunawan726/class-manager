import { getAnnouncementById } from "@/lib/firebase/admin/db/announcement";
import { AnnouncementDialog } from "./announcement-dialog";
import { unstable_cache } from "next/cache";
import { getCurrentUser, getUserDataByUid } from "@/lib/firebase/admin/db/user";
import { notFound } from "next/navigation";

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

export default async function AnnouncementPage(props) {
  const params = await props.params;
  const user = await getCurrentUser();
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
