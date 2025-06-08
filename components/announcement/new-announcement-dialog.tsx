import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useRouter, usePathname } from "next/navigation";
import { NewAnnouncementForm } from "./new-announcement-form";
import { User } from "@/lib/firebase/model/user";
import { toast } from "sonner";

type NewAnnouncementDialogProps = {
  user: User;
  isOpen: boolean;
  openOpenChange: (isOpen: boolean) => void;
};

export function NewAnnouncementDialog({
  user,
  isOpen,
  openOpenChange,
}: NewAnnouncementDialogProps) {
  function handleDataSaved() {
    openOpenChange(false);
    toast("Pengumuman berhasil dibuat");
  }

  return (
    <Dialog onOpenChange={openOpenChange} open={isOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Buat pengumuman baru</DialogTitle>
          <DialogDescription>Mohon isi setiap kolom dibawah</DialogDescription>
        </DialogHeader>
        <NewAnnouncementForm user={user} onDataSaved={handleDataSaved} />
      </DialogContent>
    </Dialog>
  );
}
