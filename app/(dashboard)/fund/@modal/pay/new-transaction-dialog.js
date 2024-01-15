"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { usePathname, useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { NewTransactionForm } from "./new-transaction-form";

export function NewTransactionDialog({ user, billingDateInterval }) {
  const router = useRouter();
  const path = usePathname();

  const { toast } = useToast();

  function handleOpenChange(open) {
    if (open) {
      router.replace(`/fund/pay`);
    } else {
      router.replace("/fund");
    }
  }

  function handleDataSaved() {
    toast({
      title: "Data transaksi uang kas berhasil disimpan",
    });
    router.replace("/fund");
  }

  return (
    <Dialog onOpenChange={handleOpenChange} open={path === "/fund/pay"}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Bayar uang kas</DialogTitle>
          <DialogDescription>
            Mohon masukan informasi mengenai transaksi uang kas dibawah dengan
            benar
          </DialogDescription>
        </DialogHeader>
        <NewTransactionForm
          user={user}
          billingDateInterval={billingDateInterval}
          onDataSaved={handleDataSaved}
        />
      </DialogContent>
    </Dialog>
  );
}
