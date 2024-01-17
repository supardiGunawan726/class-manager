import { getCurrentUser } from "@/lib/firebase/admin/db/user";
import { AuthProvider } from "./auth-provider";
import { Sidebar } from "./sidebar";
import { UserClassProvider } from "./user-class-provider";
import { getClassById } from "@/lib/firebase/admin/db/class";
import { redirect } from "next/navigation";

export default async function DashboardLayout({ children }) {
  const user = await getCurrentUser().catch(() => null);

  if (!user) {
    redirect("/auth/login");
  }

  const userClass =
    user && user.class_id ? await getClassById(user.class_id) : null;

  if (!userClass) {
    if (user.role === "ketua") {
      redirect("/class/create");
    } else {
      redirect("/class/join");
    }
  }

  return (
    <AuthProvider auth={user}>
      <UserClassProvider userClass={userClass}>
        <div className="grid grid-cols-[300px_1fr]">
          <Sidebar user={user} userClass={userClass} />
          {children}
        </div>
      </UserClassProvider>
    </AuthProvider>
  );
}
