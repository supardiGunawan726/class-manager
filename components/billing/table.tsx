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
import { buttonVariants } from "@/components/ui/button";
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
import { Billing } from "@/lib/firebase/model/transaction";

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

  function handleBillingDateChange(value: string) {
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set("date", value);
    router.replace(`/fund?${searchParams.toString()}`);
  }

  return (
    <header className="flex items-center">
      <Input
        type="text"
        name="search"
        id="search"
        placeholder="Cari nama mahasiswa"
        className="w-[200px]"
      />
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
      {user && user.role === "ketua" && (
        <>
          <Link
            href="/fund/transaction"
            className={cn(buttonVariants({ variant: "outline" }), "ml-auto")}
          >
            Lihat data transaksi
          </Link>
          <Link
            href={`/fund/transaction/new?billing_date=${billingDate}`}
            className={cn(buttonVariants({ variant: "destructive" }), "ml-2")}
          >
            Input uang kas
          </Link>
        </>
      )}
      <Link
        href={`/fund/pay?billing_date=${billingDate}`}
        className={cn(buttonVariants(), "ml-2")}
      >
        Bayar uang kas
      </Link>
    </header>
  );
}

type BillingTableProps = {
  billings: Billing[];
  simple?: boolean;
};

export function BillingTable({ billings, simple }: BillingTableProps) {
  return (
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
                <Link
                  href={`/fund/transaction/${billing.last_transaction.id}`}
                  className="hover:underline"
                >
                  {formatTimestamp(billing.last_transaction.date)}
                </Link>
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
