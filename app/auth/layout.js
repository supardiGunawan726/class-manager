import { getCurrentUser } from "@/lib/firebase/admin/db/user";
import { redirect } from "next/navigation";

export default async function Layout({ children }) {
  const user = await getCurrentUser().catch(() => null);
  if (user) {
    redirect("/");
  }

  return <>{children}</>;
}
