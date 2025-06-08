import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { usePathname, useRouter } from "next/navigation";
import { PayTransactionForm } from "./pay-transaction-form";
import { User } from "@/lib/firebase/model/user";
import { toast } from "sonner";

type PayTransactionDialogProps = {
  user: User;
  billingDateInterval: { seconds: number; nanoseconds: number }[];
  billingDate: string;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
};

export function PayTransactionDialog({
  user,
  billingDateInterval,
  billingDate,
  isOpen,
  onOpenChange,
}: PayTransactionDialogProps) {
  function handleDataSaved() {
    toast("Data transaksi uang kas berhasil disimpan");
    onOpenChange(false);
  }

  return (
    <Dialog onOpenChange={onOpenChange} open={isOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Bayar uang kas</DialogTitle>
          <DialogDescription>
            Mohon masukan informasi mengenai transaksi uang kas dibawah dengan
            benar
          </DialogDescription>
        </DialogHeader>
        <PayTransactionForm
          user={user}
          billingDateInterval={billingDateInterval}
          billingDate={billingDate}
          onDataSaved={handleDataSaved}
        />
      </DialogContent>
    </Dialog>
  );
}
