import { getCurrentUser } from "@/lib/firebase/admin/db/user";
import { CreateClassForm } from "./create-class-form";

export default async function CreateClass() {
  const user = await getCurrentUser();

  return <CreateClassForm user={user} />;
}
