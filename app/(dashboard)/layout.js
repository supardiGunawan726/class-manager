import { getUserDataByUid } from "@/lib/firebase/admin/db/user";
import { AuthProvider } from "./auth-provider";
import { Sidebar } from "./sidebar";
import { UserClassProvider } from "./user-class-provider";
import { getClassById } from "@/lib/firebase/admin/db/class";
import { headers } from "next/headers";
import { unstable_cache } from "next/cache";

const getCachedCurrentUser = unstable_cache(
  async (uid) => getUserDataByUid(uid),
  ["current-user"],
  { tags: ["current-user"] }
);

export default async function DashboardLayout({ children }) {
  const uid = headers().get("x-uid");
  const user = await getCachedCurrentUser(uid);
  const userClass =
    user && user.class_id ? await getClassById(user.class_id) : null;

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
