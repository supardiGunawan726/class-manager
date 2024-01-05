"use client";

import { Button } from "@/components/ui/button";
import * as Icon from "lucide-react";
import { useAuthContext } from "../../auth-provider";
import { usePathname } from "next/navigation";
import Link from "next/link";

export function MemberToolbar({ user }) {
  const currentUser = useAuthContext();
  const isCurrentUserKetua = currentUser.role === "ketua";
  const isViewingOwnUser = currentUser.uid === user.uid;

  const path = usePathname();

  function handleClickDelete() {}

  return (
    <div className="ml-auto flex gap-2">
      {(isCurrentUserKetua || isViewingOwnUser) && (
        <>
          <Button
            variant="outline"
            size="icon"
            className="rounded-full text-slate-500 hover:text-slate-500"
            asChild
          >
            <Link href={`${path}/edit`}>
              <Icon.Pencil />
            </Link>
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="rounded-full text-red-500 hover:text-red-500 border-red-100"
            onClick={handleClickDelete}
          >
            <Icon.Trash />
          </Button>
        </>
      )}
    </div>
  );
}
