"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useRouter, usePathname } from "next/navigation";
import { NewAnnouncementForm } from "./new-announcement-form";
import { useToast } from "@/components/ui/use-toast";

export function NewAnnouncementDialog({ user }) {
  const router = useRouter();
  const path = usePathname();

  const { toast } = useToast();

  function handleOpenChange(open) {
    if (open) {
      router.replace("/announcement/new");
    } else {
      router.replace("/announcement");
    }
  }

  function handleDataSaved() {
    toast({
      title: "Pengumuman berhasil dibuat",
    });
    router.replace("/announcement/");
  }

  return (
    <Dialog onOpenChange={handleOpenChange} open={path === "/announcement/new"}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Buat pengumuman baru</DialogTitle>
          <DialogDescription>Mohon isi setiap kolom dibawah</DialogDescription>
        </DialogHeader>
        <NewAnnouncementForm user={user} onDataSaved={handleDataSaved} />
      </DialogContent>
    </Dialog>
  );
}
