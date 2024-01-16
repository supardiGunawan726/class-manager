"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { usePathname, useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { NewDiscussionForm } from "./new-discussion-form";

export function NewDiscussionDialog({ user }) {
  const router = useRouter();
  const path = usePathname();

  const { toast } = useToast();

  function handleOpenChange(open) {
    if (open) {
      router.replace(`/discussion/new`);
    } else {
      router.replace("/discussion");
    }
  }

  function handleDataSaved() {
    toast({
      title: "Forum diskusi berhasil dibuat",
    });
    router.replace("/discussion");
  }

  return (
    <Dialog onOpenChange={handleOpenChange} open={path === "/discussion/new"}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Buat forum diskusi baru</DialogTitle>
          <DialogDescription>
            Mohon masukan informasi mengenai forum diskusi dibawah dengan benar
          </DialogDescription>
        </DialogHeader>
        <NewDiscussionForm user={user} onDataSaved={handleDataSaved} />
      </DialogContent>
    </Dialog>
  );
}
