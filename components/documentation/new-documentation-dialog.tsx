import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { NewDocumentationForm } from "./new-documentation-form";
import { useGetCurrentUser } from "@/lib/queries/session";

type NewDocumentationDialogProps = {
  isOpen: boolean;
  handleOpenChange: (isOpen: boolean) => void;
};

export function NewDocumentationDialog({
  isOpen,
  handleOpenChange,
}: NewDocumentationDialogProps) {
  const { data: user } = useGetCurrentUser();

  function handleDataSaved() {
    console.log("test");
    handleOpenChange(false);
    toast("Dokumentasi berhasil dirubah");
  }

  return (
    <Dialog onOpenChange={handleOpenChange} open={isOpen}>
      <DialogContent className="max-w-3xl">
        {user && (
          <>
            <DialogHeader>
              <DialogTitle>Buat dokumentasi</DialogTitle>
              <DialogDescription>
                Mohon isi informasi diskusi dan upload foto/video dibawah
              </DialogDescription>
            </DialogHeader>
            <NewDocumentationForm user={user} onDataSaved={handleDataSaved} />
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
