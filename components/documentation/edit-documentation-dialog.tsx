import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { EditDocumentationForm } from "./edit-documentation-form";
import { toast } from "sonner";
import { useGetCurrentUser } from "@/lib/queries/session";
import { useGetDocumentation } from "@/lib/queries/documentations";

type EditDocumentationDialogProps = {
  documentationId?: string;
  isOpen: boolean;
  handleOpenChange: (isOpen: boolean) => void;
};

export function EditDocumentationDialog({
  documentationId,
  isOpen,
  handleOpenChange,
}: EditDocumentationDialogProps) {
  const { data: user } = useGetCurrentUser();
  const { data: documentation } = useGetDocumentation(
    user?.class_id,
    documentationId
  );

  function handleDataSaved() {
    toast("Dokumentasi berhasil dirubah");
    handleOpenChange(false);
  }

  return (
    <Dialog onOpenChange={handleOpenChange} open={isOpen}>
      <DialogContent className="max-w-3xl">
        {user && documentation && (
          <>
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
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
