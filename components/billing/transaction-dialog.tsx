import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { usePathname, useRouter } from "next/navigation";
import { TransactionTable } from "./transaction-table";
import { User } from "@/lib/firebase/model/user";
import { useGetUsersByClassId } from "@/lib/queries/user";
import { useGetTransactions } from "@/lib/queries/transactions";

type TransactionDialogProps = {
  user: User;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
};

export function TransactionDialog({
  user,
  isOpen,
  onOpenChange,
}: TransactionDialogProps) {
  const { data: users } = useGetUsersByClassId(user.class_id);
  const { data: transactions } = useGetTransactions(user.class_id);

  function handleDataChanged() {
    onOpenChange(false);
  }

  return (
    <Dialog onOpenChange={onOpenChange} open={isOpen}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Data transaksi</DialogTitle>
        </DialogHeader>
        {users && transactions && (
          <TransactionTable
            user={user}
            users={users}
            transactions={transactions}
            onDataChanged={handleDataChanged}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
