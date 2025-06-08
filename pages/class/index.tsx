import AppLayout from "@/components/app-layout";
import { ClassToolbar } from "@/components/class/class-toolbar";
import { useGetClassById } from "@/lib/queries/class";
import { useGetCurrentUser } from "@/lib/queries/session";
import * as Icon from "lucide-react";
import React from "react";

export default function ClassPage() {
  const { data: user } = useGetCurrentUser();
  const { data: userClass } = useGetClassById(user?.class_id);

  return (
    <AppLayout>
      <main className="px-12 pt-10">
        {user && userClass && (
          <header className="flex items-center justify-start gap-6">
            <div>
              <figure className="w-24 h-24 bg-slate-500 text-white grid place-items-center rounded-full">
                <Icon.Users />
              </figure>
            </div>
            <div>
              <h1 className="font-semibold text-4xl">{userClass.name}</h1>
              <p>{userClass.id}</p>
            </div>
            <ClassToolbar user={user} />
          </header>
        )}
      </main>
    </AppLayout>
  );
}
