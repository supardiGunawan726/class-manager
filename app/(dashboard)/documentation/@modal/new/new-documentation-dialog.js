"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useRouter, usePathname } from "next/navigation";
import { NewDocumentationForm } from "./new-documentation-form";
import { useToast } from "@/components/ui/use-toast";

export function NewDocumentationDialog({ user }) {
  const router = useRouter();
  const path = usePathname();

  const { toast } = useToast();

  function handleOpenChange(open) {
    if (open) {
      router.replace(`/documentation/new`);
    } else {
      router.replace("/documentation");
    }
  }

  function handleDataSaved() {
    toast({
      title: "Dokumentasi berhasil dibuat",
    });
    router.replace("/documentation");
  }

  return (
    <Dialog
      onOpenChange={handleOpenChange}
      open={path === `/documentation/new`}
    >
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Buat dokumentasi</DialogTitle>
          <DialogDescription>
            Mohon isi informasi diskusi dan upload foto/video dibawah
          </DialogDescription>
        </DialogHeader>
        <NewDocumentationForm user={user} onDataSaved={handleDataSaved} />
      </DialogContent>
    </Dialog>
  );
}
