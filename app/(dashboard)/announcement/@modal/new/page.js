import { NewAnnouncementDialog } from "./new-announcement-dialog";
import { NewAnnouncementForm } from "./new-announcement-form";
import { headers } from "next/headers";
import { getUserDataByUid } from "@/lib/firebase/admin/db/user";
import { unstable_cache } from "next/cache";

const getCachedCurrentUser = unstable_cache(
  getUserDataByUid,
  ["current-user"],
  { tags: ["current-user"] }
);

export default async function NewAnnouncement() {
  const uid = headers().get("x-uid");
  const user = await getCachedCurrentUser(uid);

  return <NewAnnouncementDialog user={user} />;
}
