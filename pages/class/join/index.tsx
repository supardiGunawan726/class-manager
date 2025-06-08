import { JoinClassForm } from "@/components/class/join-class-form";
import { useGetClassById } from "@/lib/queries/class";
import { useGetCurrentUser } from "@/lib/queries/session";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function JoinClassPage() {
  const { data: user, isFetched } = useGetCurrentUser();
  const { data: userClass } = useGetClassById(user?.class_id);

  const router = useRouter();

  useEffect(() => {
    if (!user && isFetched) {
      router.replace("/auth/login");
    }
  }, [user, isFetched]);

  useEffect(() => {
    if (userClass) {
      router.replace("/");
    }
  }, [userClass]);

  if (!user) return null;

  return <JoinClassForm user={user} />;
}
