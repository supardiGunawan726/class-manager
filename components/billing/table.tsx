import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BILLING_STATUS, formatTimestamp, idrFormatter } from "@/lib/utils";
import * as Icon from "lucide-react";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { User } from "@/lib/firebase/model/user";
import { Billing } from "@/lib/firebase/model/billing";
import { TransactionDialog } from "./transaction-dialog";
import { useState } from "react";
import { NewTransactionDialog } from "./new-transaction-dialog";
import { PayTransactionDialog } from "./pay-transaction-dialog";
import { Transaction } from "@/lib/firebase/model/transaction";
import { TransactionProofDialog } from "../fund/transaction-proof-dialog";

type BillingToolbarProps = {
  billingDateInterval: { seconds: number; nanoseconds: number }[];
  user: User;
};

export function BillingToolbar({
  billingDateInterval,
  user,
}: BillingToolbarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const billingDateSearchParam = searchParams.get("date");

  const billingDate = billingDateSearchParam
    ? billingDateSearchParam
    : formatTimestamp(billingDateInterval[billingDateInterval.length - 1]);

  const [isTransactionDialogOpen, setIsTransactionDialogOpen] = useState(false);
  const [isNewTransactionDialogOpen, setIsNewTransactionDialogOpen] =
    useState(false);
  const [isPayTransactionDialogOpen, setIsPayTransactionDialogOpen] =
    useState(false);

  function handleBillingDateChange(value: string) {
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set("date", value);
    router.replace(`/fund?${searchParams.toString()}`);
  }

  return (
    <>
      <TransactionDialog
        user={user}
        isOpen={isTransactionDialogOpen}
        onOpenChange={setIsTransactionDialogOpen}
      />
      <NewTransactionDialog
        user={user}
        billingDateInterval={billingDateInterval}
        billingDate={billingDate}
        isOpen={isNewTransactionDialogOpen}
        onOpenChange={setIsNewTransactionDialogOpen}
      />
      <PayTransactionDialog
        user={user}
        billingDateInterval={billingDateInterval}
        billingDate={billingDate}
        isOpen={isPayTransactionDialogOpen}
        onOpenChange={setIsPayTransactionDialogOpen}
      />
      <header className="flex items-center">
        {/* <Input
          type="text"
          name="search"
          id="search"
          placeholder="Cari nama mahasiswa"
          className="w-[200px]"
        /> */}
        <Select
          defaultValue={billingDate}
          onValueChange={handleBillingDateChange}
        >
          <SelectTrigger className="w-[180px] ml-2">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {billingDateInterval.map((billingDateOption) => (
              <SelectItem
                key={formatTimestamp(billingDateOption)}
                value={formatTimestamp(billingDateOption)}
              >
                {formatTimestamp(billingDateOption)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {user.role === "ketua" && (
          <>
            <Button
              variant="outline"
              className="ml-auto cursor-pointer"
              onClick={() => setIsTransactionDialogOpen(true)}
            >
              Lihat data transaksi
            </Button>
            <Button
              variant="destructive"
              className="ml-2 cursor-pointer"
              onClick={() => setIsNewTransactionDialogOpen(true)}
            >
              Input uang kas
            </Button>
          </>
        )}
        <Button
          className="ml-2 cursor-pointer"
          onClick={() => setIsPayTransactionDialogOpen(true)}
        >
          Bayar uang kas
        </Button>
      </header>
    </>
  );
}

type BillingTableProps = {
  billings: Billing[];
  simple?: boolean;
};

export function BillingTable({ billings, simple }: BillingTableProps) {
  const [openedTransaction, setOpenedTransaction] = useState<
    Transaction | undefined
  >();

  return (
    <>
      {openedTransaction && (
        <TransactionProofDialog
          transaction={openedTransaction}
          isOpen={!!openedTransaction}
          onOpenChange={() => setOpenedTransaction(undefined)}
        />
      )}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nama</TableHead>
            <TableHead>Tanggal</TableHead>
            {!simple && <TableHead>Terbayar/Tagihan</TableHead>}
            <TableHead className="text-center">Status</TableHead>
            {!simple && (
              <>
                <TableHead className="text-center">Terverifikasi</TableHead>
                <TableHead>Total uang kas</TableHead>
              </>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {billings.map((billing) => (
            <TableRow key={billing.name}>
              <TableCell>{billing.name}</TableCell>
              <TableCell>
                {billing.last_transaction ? (
                  <Button
                    variant="link"
                    className="hover:underline"
                    onClick={() =>
                      setOpenedTransaction(billing.last_transaction)
                    }
                  >
                    {formatTimestamp(billing.last_transaction.date)}
                  </Button>
                ) : (
                  "-"
                )}
              </TableCell>
              {!simple && (
                <TableCell>
                  {idrFormatter.format(billing.amount_paid)}/
                  {idrFormatter.format(billing.amount_bill)}
                </TableCell>
              )}
              <TableCell>
                <div className="grid place-items-center">
                  <StatusBadge status={billing.status} />
                </div>
              </TableCell>
              {!simple && (
                <>
                  <TableCell>
                    <div className="grid place-items-center">
                      {billing.verified ? (
                        <Icon.Check className="text-green-500" />
                      ) : (
                        <Icon.X className="text-red-500" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {idrFormatter.format(billing.total_funding)}
                  </TableCell>
                </>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}

type StatusBadgeProps = {
  status: Billing["status"];
};

function StatusBadge({ status }: StatusBadgeProps) {
  if (status === BILLING_STATUS.PAID.value) {
    return (
      <Badge className="bg-green-500 hover:bg-green-400">
        {BILLING_STATUS.PAID.label}
      </Badge>
    );
  }

  if (status === BILLING_STATUS.PARTIAL.value) {
    return (
      <Badge className="bg-yellow-500 hover:bg-yellow-400">
        {BILLING_STATUS.PARTIAL.label}
      </Badge>
    );
  }

  if (status === BILLING_STATUS.UNPAID.value) {
    return <Badge variant="destructive">{BILLING_STATUS.UNPAID.label}</Badge>;
  }

  return <Badge>Tidak diketahui</Badge>;
}
