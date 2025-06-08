import type { Fund } from "@/lib/firebase/model/fund";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { formatTimestamp } from "@/lib/utils";
import Link from "next/link";
import { buttonVariants } from "../ui/button";
import { BillingTable } from "../billing/table";
import { Billing } from "@/lib/firebase/model/billing";

type FundProps = {
  fund?: Fund;
  datePeriod?: { seconds: number; nanoseconds: number };
  billings?: Billing[];
};

export default function Fund({ fund, datePeriod, billings }: FundProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Uang Kas</CardTitle>
        {datePeriod && (
          <CardDescription>{formatTimestamp(datePeriod)}</CardDescription>
        )}
      </CardHeader>
      <CardContent>
        {!fund && (
          <div className="flex flex-col items-center gap-4">
            <p className="text-sm text-slate-500 text-center">
              Fitur uang kas belum disiapkan
            </p>
            <Link
              href="/fund"
              className={buttonVariants({
                variant: "default",
                className: "w-max",
              })}
            >
              Siapkan
            </Link>
          </div>
        )}
        {fund && billings && billings.length < 1 && (
          <div className="flex flex-col items-center justify-center gap-4 min-h-[500px]">
            <p className="text-sm text-slate-500 text-center">
              Data uang kas kosong
            </p>
          </div>
        )}
        {fund && billings && billings.length > 0 && (
          <BillingTable billings={billings} simple />
        )}
      </CardContent>
    </Card>
  );
}
