import { unstable_cache } from "next/cache";
import { getCurrentUser } from "@/lib/firebase/admin/db/user";
import {
  getUsersBillingByPeriod,
  getFund,
  getBillingDateInterval,
} from "@/lib/firebase/admin/db/fund";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Timestamp } from "firebase-admin/firestore";
import { parseDate } from "@/lib/utils";
import { BillingTable, BillingToolbar } from "@/components/billing/table";

const getCachedFund = unstable_cache(getFund, ["fund"], { tags: ["fund"] });

const getCachedUsersBillingByPeriod = unstable_cache(
  getUsersBillingByPeriod,
  ["billings"],
  { tags: ["billings"] }
);

export default async function FundPage({ searchParams }) {
  const user = await getCurrentUser();
  const fund = await getCachedFund(user.class_id).catch(() => null);
  const billingDateInterval = fund ? getBillingDateInterval(fund) : null;

  let datePeriod = billingDateInterval
    ? billingDateInterval[billingDateInterval.length - 1]
    : null;
  if (searchParams.date) {
    try {
      const parsedDate = parseDate(searchParams.date);
      datePeriod = Timestamp.fromDate(parsedDate);
    } catch (error) {}
  }

  const billings = billingDateInterval
    ? await getCachedUsersBillingByPeriod(user.class_id, {
        fund,
        datePeriod,
        billingDateInterval,
      })
    : null;

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
        {fund && billings.length > 0 && (
          <section className="grid gap-4">
            <BillingToolbar
              user={user}
              billingDateInterval={billingDateInterval}
            />
            <BillingTable billings={billings} />
          </section>
        )}
      </div>
    </main>
  );
}
