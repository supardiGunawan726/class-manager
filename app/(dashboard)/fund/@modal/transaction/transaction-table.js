"use client";

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
import { unverifyTransactions, verifyTransactions } from "./actions";

export function TransactionTable({ transactions, user, users, onDataChanged }) {
  const [checks, setChecks] = useState(
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

  function findUser(uid) {
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

  function handleCheck(transactionId) {
    return () => {
      setChecks((prev) => ({ ...prev, [transactionId]: !prev[transactionId] }));
    };
  }

  async function handleVerifyClick() {
    try {
      setStatus({ loading: true, success: false });

      const formData = new FormData();
      formData.set("class_id", user.class_id);
      for (const transactionId of Object.keys(checks)) {
        if (checks[transactionId]) {
          formData.append("transactions_id", transactionId);
        }
      }

      await verifyTransactions(formData);
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

      const formData = new FormData();
      formData.set("class_id", user.class_id);
      for (const transactionId of Object.keys(checks)) {
        if (checks[transactionId]) {
          formData.append("transactions_id", transactionId);
        }
      }

      await unverifyTransactions(formData);
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
              <TableCell>{findUser(transaction.user_id).name}</TableCell>
              <TableCell>{formatTimestamp(transaction.date)}</TableCell>
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
