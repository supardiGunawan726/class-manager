import { unstable_cache } from "next/cache";
import { headers } from "next/headers";
import { getUserDataByUid } from "@/lib/firebase/admin/db/user";
import { getDocumentation } from "@/lib/firebase/admin/db/documentation";
import { EditDocumentationDialog } from "./edit-documentation-dialog";

const getCachedCurrentUser = unstable_cache(
  getUserDataByUid,
  ["current-user"],
  { tags: ["current-user"] }
);

const getCachedDocumentation = unstable_cache(
  getDocumentation,
  ["documentation"],
  { tags: ["documentation"] }
);

const getCachedDocumentationAuthor = unstable_cache(
  getUserDataByUid,
  ["documentation", "documentation-author"],
  { tags: ["documentation", "documentation-author"] }
);

export default async function DocumentationItemPage({ params }) {
  const uid = headers().get("x-uid");
  const user = await getCachedCurrentUser(uid);

  const documentation = await getCachedDocumentation(user.class_id, params.id);

  const author = await getCachedDocumentationAuthor(documentation.author);

  return (
    <EditDocumentationDialog
      user={user}
      author={author}
      documentation={documentation}
    />
  );
}
