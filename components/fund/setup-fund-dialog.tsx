import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { usePathname, useRouter } from "next/navigation";
import { SetupFundForm } from "./setup-fund-form";
import { User } from "@/lib/firebase/model/user";
import { toast } from "sonner";

type SetupFundDialogProps = {
  user: User;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
};

export function SetupFundDialog({
  user,
  isOpen,
  onOpenChange,
}: SetupFundDialogProps) {
  function handleDataSaved() {
    toast("Fitur uang kas berhasil disiapkan");
    onOpenChange(false);
  }

  return (
    <Dialog onOpenChange={onOpenChange} open={isOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Persiapkan uang kas</DialogTitle>
          <DialogDescription>
            Mohon masukan informasi mengenai pengumpulan uang kas kelas kamu
          </DialogDescription>
        </DialogHeader>
        <SetupFundForm user={user} onDataSaved={handleDataSaved} />
      </DialogContent>
    </Dialog>
  );
}
