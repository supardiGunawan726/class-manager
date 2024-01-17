import { JoinClassForm } from "./join-class-form";
import { getCurrentUser } from "@/lib/firebase/admin/db/user";

export default async function JoinClass() {
  const user = await getCurrentUser();
  return <JoinClassForm user={user} />;
}
