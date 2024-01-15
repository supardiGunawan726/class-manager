import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { unstable_cache } from "next/cache";
import { headers } from "next/headers";
import { getUserDataByUid } from "@/lib/firebase/admin/db/user";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import {
  getBillingDateInterval,
  getFund,
  getUsersBillingByPeriod,
} from "@/lib/firebase/admin/db/fund";
import { BillingTable } from "@/components/billing/table";
import { formatTimestamp } from "@/lib/utils";

const getCachedCurrentUser = unstable_cache(
  getUserDataByUid,
  ["current-user"],
  { tags: ["current-user"] }
);

const getCachedFund = unstable_cache(getFund, ["fund"], { tags: ["fund"] });

const getCachedUsersBillingByPeriod = unstable_cache(
  getUsersBillingByPeriod,
  ["billings"],
  { tags: ["billings"] }
);

export default async function PettyCashPage() {
  const uid = headers().get("x-uid");
  const user = await getCachedCurrentUser(uid);
  const fund = await getCachedFund(user.class_id).catch(() => null);
  const billingDateInterval = getBillingDateInterval(fund);
  const datePeriod = billingDateInterval[billingDateInterval.length - 1];
  const billings = await getCachedUsersBillingByPeriod(user.class_id, {
    fund,
    datePeriod,
    billingDateInterval,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Uang Kas</CardTitle>
        {fund && billings.length > 0 && (
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
        {fund && billings.length < 1 && (
          <div className="flex flex-col items-center justify-center gap-4 min-h-[500px]">
            <p className="text-sm text-slate-500 text-center">
              Data uang kas kosong
            </p>
          </div>
        )}
        {fund && billings.length > 0 && (
          <BillingTable billings={billings} simple />
        )}
      </CardContent>
    </Card>
  );
}
