import { unstable_cache } from "next/cache";
import { getCurrentUser, getUserDataByUid } from "@/lib/firebase/admin/db/user";
import { getDocumentation } from "@/lib/firebase/admin/db/documentation";
import { EditDocumentationDialog } from "./edit-documentation-dialog";

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
  const user = await getCurrentUser();
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
