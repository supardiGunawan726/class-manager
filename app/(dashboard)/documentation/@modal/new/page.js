import { NewDocumentationDialog } from "./new-documentation-dialog";
import { headers } from "next/headers";
import { getUserDataByUid } from "@/lib/firebase/admin/db/user";
import { unstable_cache } from "next/cache";

const getCachedCurrentUser = unstable_cache(
  getUserDataByUid,
  ["current-user"],
  { tags: ["current-user"] }
);

export default async function NewDocumentationPage() {
  const uid = headers().get("x-uid");
  const user = await getCachedCurrentUser(uid);

  return <NewDocumentationDialog user={user} />;
}
