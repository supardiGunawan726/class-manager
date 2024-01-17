import { getUserDataByUid } from "@/lib/firebase/admin/db/user";
import { EditDataDialog } from "./edit-data-dialog";
import { unstable_cache } from "next/cache";

const getCachedUser = unstable_cache(getUserDataByUid, ["user"], {
  tags: ["user"],
});

export default async function EditModal({ params }) {
  const user = await getCachedUser(params.uid);

  return <EditDataDialog user={user} />;
}
