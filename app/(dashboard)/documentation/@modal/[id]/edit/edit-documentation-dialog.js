"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useRouter, usePathname } from "next/navigation";
import { EditDocumentationForm } from "./edit-documentation-form";
import { useToast } from "@/components/ui/use-toast";

export function EditDocumentationDialog({ user, documentation, author }) {
  const router = useRouter();
  const path = usePathname();

  const { toast } = useToast();

  function handleOpenChange(open) {
    if (open) {
      router.replace(`/documentation/edit/${documentation.id}`);
    } else {
      router.replace("/documentation");
    }
  }

  function handleDataSaved() {
    toast({
      title: "Dokumentasi berhasil dirubah",
    });
    router.replace("/documentation");
  }

  return (
    <Dialog
      onOpenChange={handleOpenChange}
      open={path === `/documentation/${documentation.id}/edit`}
    >
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Edit dokumentasi</DialogTitle>
          <DialogDescription>
            Mohon isi informasi diskusi dan upload foto/video dibawah
          </DialogDescription>
        </DialogHeader>
        <EditDocumentationForm
          user={user}
          documentation={documentation}
          onDataSaved={handleDataSaved}
        />
      </DialogContent>
    </Dialog>
  );
}
