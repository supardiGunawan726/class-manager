import { NewDocumentationDialog } from "./new-documentation-dialog";
import { getCurrentUser } from "@/lib/firebase/admin/db/user";

export default async function NewDocumentationPage() {
  const user = await getCurrentUser();

  return <NewDocumentationDialog user={user} />;
}
