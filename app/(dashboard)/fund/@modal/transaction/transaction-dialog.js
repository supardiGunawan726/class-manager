"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { usePathname, useRouter } from "next/navigation";
import { TransactionTable } from "./transaction-table";

export function TransactionDialog({ user, users, transactions }) {
  const router = useRouter();
  const path = usePathname();

  function handleOpenChange(open) {
    if (open) {
      router.replace(`/fund/transaction`);
    } else {
      router.replace("/fund");
    }
  }

  function handleDataChanged() {
    router.replace("/fund");
  }

  return (
    <Dialog onOpenChange={handleOpenChange} open={path === "/fund/transaction"}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Data transaksi</DialogTitle>
        </DialogHeader>
        <TransactionTable
          user={user}
          users={users}
          transactions={transactions}
          onDataChanged={handleDataChanged}
        />
      </DialogContent>
    </Dialog>
  );
}
