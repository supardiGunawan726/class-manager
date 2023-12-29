"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useRouter, usePathname } from "next/navigation";

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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Buat akun mahasiswa</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
