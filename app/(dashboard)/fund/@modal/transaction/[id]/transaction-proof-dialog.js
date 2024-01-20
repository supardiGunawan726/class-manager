"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

export function TransactionProofDialog({ transaction }) {
  const router = useRouter();
  const path = usePathname();

  function handleOpenChange(open) {
    if (!open) {
      router.back();
    }
  }

  console.log(transaction);

  return (
    <Dialog
      onOpenChange={handleOpenChange}
      open={path === `/fund/transaction/${transaction.id}`}
    >
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
