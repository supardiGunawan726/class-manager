import { auth } from "@/lib/firebase/firebase-config";
import { useGetCurrentUser } from "@/lib/queries/session";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/router";
import { ReactElement, useEffect } from "react";

export default function AuthLayout({ children }: { children: ReactElement }) {
  const { data: user, isFetched } = useGetCurrentUser();

  const router = useRouter();

  useEffect(() => {
    if (!isFetched) return;
    if (!user) return;

    if (user.class_id) {
      router.replace("/");
    } else if (user.role === "ketua") {
      router.replace("/class/create");
    } else if (user.role !== "ketua") {
      router.replace("/class/join");
    }
  }, [user, isFetched]);

  return <>{children}</>;
}
