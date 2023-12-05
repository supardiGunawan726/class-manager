import { getClassById } from "@/lib/firebase/admin/db/class";
import { AuthProvider } from "./auth-provider";
import { cookies, headers } from "next/headers";
import { UserClassProvider } from "./user-class-provider";

export default async function DashboardLayout({ children }) {
  const origin = headers().get("x-origin");
  const session = cookies().get("session");
  const loginResult = await fetch(`${origin}/api/auth/login`, {
    headers: {
      Cookie: `session=${session?.value}`,
    },
  });
  const loginResultData = await loginResult.json();
  const user = loginResultData.user;
  const userClass = await getClassById(user.class_id);

  return (
    <AuthProvider auth={user}>
      <UserClassProvider userClass={userClass}>{children}</UserClassProvider>
    </AuthProvider>
  );
}
