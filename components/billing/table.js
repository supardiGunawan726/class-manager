"use client";

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
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";

export function BillingToolbar({ billingDateInterval, user }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const dateSearchParams = searchParams.get("date");
  const dateValue = dateSearchParams
    ? dateSearchParams
    : formatTimestamp(billingDateInterval[billingDateInterval.length - 1]);

  function handleDateChange(value) {
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
        className="w-[276px]"
      />
      <Select value={dateValue} onValueChange={handleDateChange}>
        <SelectTrigger className="w-[180px] ml-2">{dateValue}</SelectTrigger>
        <SelectContent>
          {billingDateInterval.map((billingDate) => (
            <SelectItem
              key={formatTimestamp(billingDate)}
              value={formatTimestamp(billingDate)}
            >
              {formatTimestamp(billingDate)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {user && user.role === "ketua" && (
        <Link
          href="/fund/transaction/new"
          className={cn(buttonVariants({ variant: "outline" }), "ml-auto")}
        >
          Input data uang kas
        </Link>
      )}
      <Link href="/fund/pay" className={cn(buttonVariants(), "ml-2")}>
        Bayar uang kas
      </Link>
    </header>
  );
}

export function BillingTable({ billings, simple }) {
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
              {billing.last_transaction_date
                ? formatTimestamp(billing.last_transaction_date)
                : "-"}
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

function StatusBadge({ status }) {
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