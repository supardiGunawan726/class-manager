import { getUserDataByUid } from "@/lib/firebase/admin/db/user";
import { EditDataDialog } from "./edit-data-dialog";
import { unstable_cache } from "next/cache";

const getCachedCurrentUser = unstable_cache(
  getUserDataByUid,
  ["current-user"],
  { tags: ["current-user"] }
);

export default async function EditModal({ params }) {
  const user = await getCachedCurrentUser(params.uid);

  return <EditDataDialog user={user} />;
}
