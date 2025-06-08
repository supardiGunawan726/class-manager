import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Transaction } from "@/lib/firebase/model/transaction";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

type TransactionProofDialogProps = {
  transaction: Transaction;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
};

export function TransactionProofDialog({
  transaction,
  isOpen,
  onOpenChange,
}: TransactionProofDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Bukti transaksi</DialogTitle>
        </DialogHeader>
        {transaction.proof && (
          <figure className="relative w-full aspect-square">
            <Image
              src={transaction.proof}
              alt="Transaction proof"
              fill
              className="object-cover"
            />
          </figure>
        )}
        {!transaction.proof && (
          <div className="flex flex-col items-center justify-center gap-4 min-h-[300px]">
            <p className="text-sm text-slate-500 text-center">
              Bukti transaksi tidak ada
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
