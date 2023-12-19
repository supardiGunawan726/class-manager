"use client";

import * as Icon from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUserClassContext } from "@/app/user-class-provider";

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
        <div className="ml-auto flex gap-2">
          <Button
            variant="outline"
            size="icon"
            className="rounded-full text-slate-500 hover:text-slate-500"
          >
            <Icon.Pencil />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="rounded-full text-red-500 hover:text-red-500 border-red-100"
          >
            <Icon.Trash />
          </Button>
        </div>
      </header>
    </main>
  );
}
