import { NewAnnouncementDialog } from "./new-announcement-dialog";
import { getCurrentUser } from "@/lib/firebase/admin/db/user";

export default async function NewAnnouncement() {
  const user = await getCurrentUser();

  return <NewAnnouncementDialog user={user} />;
}
