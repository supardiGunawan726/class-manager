import { NewDiscussionDialog } from "./new-discussion-dialog";
import { getCurrentUser } from "@/lib/firebase/admin/db/user";

export default async function NewDiscussionPage() {
  const user = await getCurrentUser();

  return <NewDiscussionDialog user={user} />;
}
