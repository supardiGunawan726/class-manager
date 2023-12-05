import { JoinClassForm } from "./join-class-form";
import { getUserDataByUid } from "@/lib/firebase/admin/db/user";
import { redirect } from "next/navigation";
import { getClassById } from "@/lib/firebase/admin/db/class";

export default async function JoinClass({ searchParams }) {
  const { uid } = searchParams;

  if (!uid) {
    const error = new Error("You're unauthorized to request to this URL");
    error.name = "unauthorized";
    throw error;
  }

  const user = await getUserDataByUid(uid);
  if (!user) {
    const error = new Error("You're unauthorized to request to this URL");
    error.name = "unauthorized";
    throw error;
  }

  if (user.class_id) {
    const userClass = await getClassById(user.class_id);

    if (userClass) {
      return redirect(`/`);
    }
  }

  return <JoinClassForm uid={uid} />;
}
