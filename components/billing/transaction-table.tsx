import { formatTimestamp, idrFormatter } from "@/lib/utils";
import * as Icon from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Transaction } from "@/lib/firebase/model/transaction";
import { User } from "@/lib/firebase/model/user";
import { useUpdateTransaction } from "@/lib/queries/transactions";

type TransactionTableProps = {
  transactions: Transaction[];
  user: User;
  users: User[];
  onDataChanged: () => void;
};

export function TransactionTable({
  transactions,
  user,
  users,
  onDataChanged,
}: TransactionTableProps) {
  const { mutateAsync: updateTransaction } = useUpdateTransaction();

  const [checks, setChecks] = useState<Record<string, boolean>>(
    transactions.reduce(
      (checks, transaction) => ({
        ...checks,
        [transaction.id]: false,
      }),
      {}
    )
  );
  const [status, setStatus] = useState({
    loading: false,
    success: true,
  });

  function findUser(uid: string) {
    return users.find((user) => user.uid === uid);
  }

  const isAllChecked = Object.values(checks).every((isChecked) => isChecked);
  const isSomeChecked = Object.values(checks).some((isChecked) => isChecked);

  function handleCheckAll() {
    setChecks(function (checks) {
      if (Object.values(checks).every((check) => check)) {
        return transactions.reduce(
          (checks, transaction) => ({
            ...checks,
            [transaction.id]: false,
          }),
          {}
        );
      } else {
        return transactions.reduce(
          (checks, transaction) => ({
            ...checks,
            [transaction.id]: true,
          }),
          {}
        );
      }
    });
  }

  function handleCheck(transactionId: string) {
    return () => {
      setChecks((prev) => ({ ...prev, [transactionId]: !prev[transactionId] }));
    };
  }

  async function handleVerifyClick() {
    try {
      setStatus({ loading: true, success: false });

      let updateTransactionPromises: Promise<unknown>[] = [];
      for (const transactionId of Object.keys(checks)) {
        if (checks[transactionId]) {
          updateTransactionPromises.push(
            updateTransaction({
              class_id: user.class_id!,
              id: transactionId,
              data: {
                verified: true,
              },
            })
          );
        }
      }

      await Promise.all(updateTransactionPromises);

      onDataChanged();

      setStatus({ loading: false, success: true });
    } catch (error) {
      console.error(error);
      setStatus({ loading: false, success: false });
    }
  }

  async function handleUnverifyClick() {
    try {
      setStatus({ loading: true, success: false });

      let updateTransactionPromises: Promise<unknown>[] = [];
      for (const transactionId of Object.keys(checks)) {
        if (checks[transactionId]) {
          updateTransactionPromises.push(
            updateTransaction({
              class_id: user.class_id!,
              id: transactionId,
              data: {
                verified: false,
              },
            })
          );
        }
      }

      await Promise.all(updateTransactionPromises);
      onDataChanged();

      setStatus({ loading: false, success: true });
    } catch (error) {
      console.error(error);
      setStatus({ loading: false, success: false });
    }
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="pt">
              <div className="grid place-items-center">
                <Checkbox checked={isAllChecked} onClick={handleCheckAll} />
              </div>
            </TableHead>
            <TableHead>Nama</TableHead>
            <TableHead>Tanggal transaksi</TableHead>
            <TableHead>Nominal</TableHead>
            <TableHead>Tanggal uang kas</TableHead>
            <TableHead>Terverifikasi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((transaction) => (
            <TableRow key={transaction.id}>
              <TableCell className="pt">
                <div className="grid place-items-center">
                  <Checkbox
                    checked={checks[`${transaction.id}`] || false}
                    onClick={handleCheck(transaction.id)}
                  />
                </div>
              </TableCell>
              <TableCell>{findUser(transaction.user_id)?.name}</TableCell>
              <TableCell>
                <Link
                  href={`/fund/transaction/${transaction.id}`}
                  className="hover:underline"
                >
                  {formatTimestamp(transaction.date)}
                </Link>
              </TableCell>
              <TableCell>{idrFormatter.format(transaction.amount)}</TableCell>
              <TableCell>{formatTimestamp(transaction.billing_date)}</TableCell>
              <TableCell>
                <div className="grid place-items-center">
                  {transaction.verified ? (
                    <Icon.Check className="text-green-500" />
                  ) : (
                    <Icon.X className="text-red-500" />
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex items-center justify-end gap-2">
        <DialogClose asChild>
          <Button variant="outline">Tutup</Button>
        </DialogClose>
        <Button
          type="button"
          variant="destructive"
          disabled={!isSomeChecked || status.loading}
          onClick={handleUnverifyClick}
        >
          {status.loading && (
            <Icon.Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}
          <span>Hapus verifikasi</span>
        </Button>
        <Button
          type="button"
          disabled={!isSomeChecked || status.loading}
          onClick={handleVerifyClick}
        >
          {status.loading && (
            <Icon.Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}
          <span>Verifikasi</span>
        </Button>
      </div>
    </>
  );
}
