"use client";

import { Dialog } from "@/components/ui/dialog";
import { useRouter, usePathname } from "next/navigation";
import { NewMemberDialog } from "./new-member-dialog";

export default async function NewMemberModal() {
  const router = useRouter();
  const path = usePathname();

  function handleOpenChange(open) {
    if (open) {
      router.replace("/member/new");
    } else {
      router.replace("/member");
    }
  }

  return (
    <Dialog onOpenChange={handleOpenChange} open={path === "/member/new"}>
      <NewMemberDialog />
    </Dialog>
  );
}
