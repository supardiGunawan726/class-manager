import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useRouter, usePathname } from "next/navigation";
import { EditAnnouncementForm } from "./edit-announcement-form";
import { Announcement } from "@/lib/firebase/model/announcement";
import { toast } from "sonner";

type EditAnnouncementDialogProps = {
  announcement: Announcement;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
};

export function EditAnnouncementDialog({
  announcement,
  isOpen,
  onOpenChange,
}: EditAnnouncementDialogProps) {
  function handleDataSaved() {
    toast("Perubahan berhasil disimpan");
    onOpenChange(false);
  }

  return (
    <Dialog onOpenChange={onOpenChange} open={isOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit pengumuman</DialogTitle>
          <DialogDescription>Mohon isi setiap kolom dibawah</DialogDescription>
        </DialogHeader>
        <EditAnnouncementForm
          announcement={announcement}
          onDataSaved={handleDataSaved}
        />
      </DialogContent>
    </Dialog>
  );
}
