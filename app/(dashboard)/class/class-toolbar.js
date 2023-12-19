"use client";

import * as Icon from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthContext } from "../auth-provider";

export function ClassToolbar() {
  const user = useAuthContext();

  if (user.role !== "ketua") {
    return null;
  }

  return (
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
  );
}
