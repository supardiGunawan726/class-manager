"use client";

import * as Icon from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUserClassContext } from "@/app/(dashboard)/user-class-provider";
import { ClassToolbar } from "./class-toolbar";

export default async function ClassInfoPage() {
  const userClass = useUserClassContext();

  return (
    <main className="px-12 pt-10">
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
        <ClassToolbar />
      </header>
    </main>
  );
}
