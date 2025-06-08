import { EditDataForm } from "./edit-data-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { User } from "@/lib/firebase/model/user";
import { toast } from "sonner";

type EditDataDialogProps = {
  user: User;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
};

export function EditDataDialog({
  user,
  isOpen,
  onOpenChange,
}: EditDataDialogProps) {
  async function handleDataSaved(data: User) {
    toast("Perubahan berhasil disimpan", {
      description:
        user.email !== data.email
          ? "Kamu akan dialihkan ke halaman login"
          : undefined,
    });
    onOpenChange(false);
  }

  return (
    <Dialog onOpenChange={onOpenChange} open={isOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Ubah data mahasiswa</DialogTitle>
        </DialogHeader>
        <EditDataForm user={user} onDataSaved={handleDataSaved} />
      </DialogContent>
    </Dialog>
  );
}
