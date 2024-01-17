import { getCurrentUser } from "@/lib/firebase/admin/db/user";
import { redirect } from "next/navigation";
import { getClassById } from "@/lib/firebase/admin/db/class";

export default async function Layout({ children }) {
  const user = await getCurrentUser().catch(() => null);

  if (!user) {
    redirect("/auth/login");
  }

  if (user.class_id) {
    const userClass = await getClassById(user.class_id);

    if (userClass) {
      redirect("/");
    }
  }

  return <>{children}</>;
}
