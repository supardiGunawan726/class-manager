import { getAnnouncementById } from "@/lib/firebase/admin/db/announcement";
import { unstable_cache } from "next/cache";
import { getCurrentUser, getUserDataByUid } from "@/lib/firebase/admin/db/user";
import { notFound } from "next/navigation";
import { EditAnnouncementDialog } from "./edit-announcement-dialog";

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

export default async function EditAnnouncementPage(props) {
  const params = await props.params;
  const user = await getCurrentUser();

  const announcement = await getCachedAnnouncementById(
    user.class_id,
    params.id
  );
  const announcementAuthor = await getCachedAnnouncementAuthor(
    announcement.author
  );

  if (!announcement) {
    return notFound();
  }

  return (
    <EditAnnouncementDialog
      author={announcementAuthor}
      announcement={announcement}
    />
  );
}
