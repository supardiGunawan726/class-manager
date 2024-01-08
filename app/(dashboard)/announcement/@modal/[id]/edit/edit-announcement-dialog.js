"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useRouter, usePathname } from "next/navigation";
import { EditAnnouncementForm } from "./edit-announcement-form";
import { useToast } from "@/components/ui/use-toast";

export function EditAnnouncementDialog({ author, announcement }) {
  const router = useRouter();
  const path = usePathname();

  const { toast } = useToast();

  function handleOpenChange(open) {
    if (open) {
      router.replace(`/announcement/${announcement.id}/edit`);
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
    <Dialog
      onOpenChange={handleOpenChange}
      open={path === `/announcement/${announcement.id}/edit`}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit pengumuman</DialogTitle>
          <DialogDescription>Mohon isi setiap kolom dibawah</DialogDescription>
        </DialogHeader>
        <EditAnnouncementForm
          author={author}
          announcement={announcement}
          onDataSaved={handleDataSaved}
        />
      </DialogContent>
    </Dialog>
  );
}
