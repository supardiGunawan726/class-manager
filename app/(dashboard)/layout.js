import { getUserDataByUid } from "@/lib/firebase/admin/db/user";
import { AuthProvider } from "./auth-provider";
import { Sidebar } from "./sidebar";
import { UserClassProvider } from "./user-class-provider";
import { getClassById } from "@/lib/firebase/admin/db/class";
import { headers } from "next/headers";

export default async function DashboardLayout({ children }) {
  const uid = headers().get("x-uid");
  const user = await getUserDataByUid(uid);
  const userClass =
    user && user.class_id ? await getClassById(user.class_id) : null;

  return (
    <AuthProvider auth={user}>
      <UserClassProvider userClass={userClass}>
        <div className="grid grid-cols-[300px_1fr]">
          <Sidebar />
          {children}
        </div>
      </UserClassProvider>
    </AuthProvider>
  );
}
