import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { User } from "@/lib/firebase/model/user";
import { toast } from "sonner";
import { NewDiscussionForm } from "./new-discussion-form";

type NewDiscussionDialogProps = {
  user: User;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
};

export function NewDiscussionDialog({
  user,
  isOpen,
  onOpenChange,
}: NewDiscussionDialogProps) {
  function handleDataSaved() {
    toast("Forum diskusi berhasil dibuat");
    onOpenChange(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
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
