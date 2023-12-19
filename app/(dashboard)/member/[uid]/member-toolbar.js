"use client";

import { Button } from "@/components/ui/button";
import * as Icon from "lucide-react";
import { useAuthContext } from "../../auth-provider";

export function MemberToolbar({ user }) {
  const currentUser = useAuthContext();
  const isCurrentUserKetua = currentUser.role === "ketua";
  const isViewingOwnUser = currentUser.uid === user.uid;

  return (
    <div className="ml-auto flex gap-2">
      {(isCurrentUserKetua || isViewingOwnUser) && (
        <Button
          variant="outline"
          size="icon"
          className="rounded-full text-slate-500 hover:text-slate-500"
        >
          <Icon.Pencil />
        </Button>
      )}
      {isCurrentUserKetua && (
        <Button
          variant="outline"
          size="icon"
          className="rounded-full text-red-500 hover:text-red-500 border-red-100"
        >
          <Icon.Trash />
        </Button>
      )}
    </div>
  );
}
