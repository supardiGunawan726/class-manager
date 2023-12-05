import { getUserDataByUid } from "@/lib/firebase/admin/db/user";
import { CreateClassForm } from "./create-class-form";
import { redirect } from "next/navigation";
import { getClassById } from "@/lib/firebase/admin/db/class";

export default async function CreateClass({ searchParams }) {
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

  const userClass = user.class_id ? await getClassById(user.class_id) : null;
  if (userClass) {
    return redirect(`/`);
  } else if (user.role !== "ketua") {
    return redirect(`/class/join?uid=${uid}`);
  }

  return <CreateClassForm uid={uid} />;
}
