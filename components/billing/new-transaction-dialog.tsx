import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { NewTransactionForm } from "./new-transaction-form";
import { User } from "@/lib/firebase/model/user";
import { useGetUsersByClassId } from "@/lib/queries/user";
import { toast } from "sonner";

type NewTransactionDialogProps = {
  user: User;
  billingDateInterval: { seconds: number; nanoseconds: number }[];
  billingDate: string;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
};

export function NewTransactionDialog({
  user,
  billingDateInterval,
  billingDate,
  isOpen,
  onOpenChange,
}: NewTransactionDialogProps) {
  const { data: users = [] } = useGetUsersByClassId(user.class_id);

  function handleDataSaved() {
    toast("Data transaksi uang kas berhasil disimpan");
    onOpenChange(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Input data uang kas</DialogTitle>
          <DialogDescription>
            Mohon masukan informasi mengenai transaksi uang kas dibawah dengan
            benar
          </DialogDescription>
        </DialogHeader>
        <NewTransactionForm
          user={user}
          users={users}
          billingDateInterval={billingDateInterval}
          billingDate={billingDate}
          onDataSaved={handleDataSaved}
        />
      </DialogContent>
    </Dialog>
  );
}
