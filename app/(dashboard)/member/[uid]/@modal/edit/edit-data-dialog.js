"use client";

import { EditDataForm } from "./edit-data-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { usePathname, useParams, useRouter } from "next/navigation";

export function EditDataDialog({ user }) {
  const router = useRouter();
  const path = usePathname();
  const params = useParams();

  const { toast } = useToast();

  function handleOpenChange(open) {
    if (open) {
      router.replace(`/member/${params.uid}/edit`);
    } else {
      router.replace(`/member/${params.uid}`);
    }
  }

  async function handleDataSaved(data) {
    toast({
      title: "Perubahan berhasil disimpan",
      description:
        user.email !== data.email
          ? "Kamu akan dialihkan ke halaman login"
          : undefined,
    });
    router.replace(`/member/${params.uid}`);
  }

  return (
    <Dialog
      onOpenChange={handleOpenChange}
      open={path === `/member/${params.uid}/edit`}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Ubah data mahasiswa</DialogTitle>
        </DialogHeader>
        <EditDataForm user={user} onDataSaved={handleDataSaved} />
      </DialogContent>
    </Dialog>
  );
}
