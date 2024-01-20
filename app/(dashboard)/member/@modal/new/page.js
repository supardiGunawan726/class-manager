import { getCurrentUser } from "@/lib/firebase/admin/db/user";
import { NewMemberDialog } from "./new-member-dialog";

export default async function NewMemberModal() {
  const user = await getCurrentUser();

  return <NewMemberDialog user={user} />;
}
