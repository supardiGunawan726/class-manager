import AppLayout from "@/components/app-layout";
import { TransactionProofDialog } from "@/components/fund/transaction-proof-dialog";
import { useGetCurrentUser } from "@/lib/queries/session";
import { useGetTransaction } from "@/lib/queries/transactions";
import { useRouter } from "next/router";
import { useState } from "react";

export default function TransactionPage() {
  const router = useRouter();

  const { data: user } = useGetCurrentUser();
  const { data: transaction } = useGetTransaction(
    user?.class_id,
    router.query.id as string
  );

  const [isTransactionProofDialogOpen, setIsTransactionProofDialogOpen] =
    useState(false);

  return (
    <AppLayout>
      {transaction && (
        <TransactionProofDialog
          transaction={transaction}
          isOpen={isTransactionProofDialogOpen}
          onOpenChange={setIsTransactionProofDialogOpen}
        />
      )}
    </AppLayout>
  );
}
