import { unstable_cache } from "next/cache";
import { headers } from "next/headers";
import { getUserDataByUid } from "@/lib/firebase/admin/db/user";
import { getUsersBillingByDate, getFund } from "@/lib/firebase/admin/db/fund";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Timestamp } from "firebase-admin/firestore";
import { BILLING_PERIODS } from "@/lib/utils";
import { BillingTable } from "@/components/billings-table";

const getCachedCurrentUser = unstable_cache(
  getUserDataByUid,
  ["current-user"],
  { tags: ["current-user"] }
);

const getCachedFund = unstable_cache(getFund, ["fund"], { tags: ["fund"] });

const getCachedUsersBillingByDate = unstable_cache(
  getUsersBillingByDate,
  ["billings"],
  { tags: ["billings"] }
);

export default async function FundPage({ searchParams }) {
  const uid = headers().get("x-uid");
  const user = await getCachedCurrentUser(uid);
  const fund = await getCachedFund(user.class_id).catch(() => null);

  const from = new Timestamp(
    fund.billing_start_date._seconds,
    fund.billing_start_date._nanoseconds
  );
  const toDate = new Date(from.toDate());

  switch (fund.billing_period) {
    case BILLING_PERIODS.DAILY.value:
      toDate.setDate(toDate.getDate() + 1);
      break;
    case BILLING_PERIODS.WEEKLY.value:
      toDate.setDate(toDate.getDate() + 7);
      break;
    case BILLING_PERIODS.FORTNIGHTLY.value:
      toDate.setDate(toDate.getDate() + 14);
      break;
    case BILLING_PERIODS.MONTHLY.value:
      toDate.setMonth(toDate.getMonth() + 1);
      break;
  }

  const to = Timestamp.fromDate(toDate);

  const billings = await getCachedUsersBillingByDate(user.class_id, {
    from,
    to,
  });

  return (
    <main className="px-12 pt-10">
      <header>
        <h1 className="font-semibold text-4xl">Uang Kas</h1>
      </header>
      <div className="mt-12">
        {!fund && (
          <div className="flex flex-col items-center justify-center gap-4 min-h-[500px]">
            <p className="text-sm text-slate-500 text-center">
              Fitur uang kas belum disiapkan
            </p>
            <Link
              href="/fund/setup"
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
        {fund && billings.length > 0 && <BillingTable billings={billings} />}
      </div>
    </main>
  );
}
