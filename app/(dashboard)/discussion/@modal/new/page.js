import { NewDiscussionDialog } from "./new-discussion-dialog";
import { unstable_cache } from "next/cache";
import { headers } from "next/headers";
import { getUserDataByUid } from "@/lib/firebase/admin/db/user";

const getCachedCurrentUser = unstable_cache(
  getUserDataByUid,
  ["current-user"],
  { tags: ["current-user"] }
);

export default async function NewDiscussionPage() {
  const uid = headers().get("x-uid");
  const user = await getCachedCurrentUser(uid);

  return <NewDiscussionDialog user={user} />;
}
