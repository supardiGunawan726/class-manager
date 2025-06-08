import { CreateClassForm } from "@/components/class/create-class-form";
import { useGetClassById } from "@/lib/queries/class";
import { useGetCurrentUser } from "@/lib/queries/session";
import { useRouter } from "next/router";
import React, { useEffect } from "react";

export default function index() {
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

  return <CreateClassForm user={user} />;
}
