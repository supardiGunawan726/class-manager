import AppLayout from "@/components/app-layout";
import { BillingTable, BillingToolbar } from "@/components/billing/table";
import { SetupFundDialog } from "@/components/fund/setup-fund-dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import { useGetBillingsByClassId } from "@/lib/queries/billing";
import { useGetFundByClassId } from "@/lib/queries/fund";
import { useGetCurrentUser } from "@/lib/queries/session";
import { getBillingDateInterval } from "@/lib/services/billing";
import { parseDate } from "@/lib/utils";
import { Timestamp } from "firebase/firestore";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

export default function FundPage() {
  const searchParams = useSearchParams();
  const date = searchParams.get("date");

  const { data: user } = useGetCurrentUser();
  const { data: fund } = useGetFundByClassId(user?.class_id);
  const billingDateInterval = fund ? getBillingDateInterval(fund) : undefined;

  let datePeriod = billingDateInterval
    ? billingDateInterval[billingDateInterval.length - 1]
    : undefined;
  if (date) {
    try {
      const parsedDate = parseDate(date);
      datePeriod = Timestamp.fromDate(parsedDate);
    } catch (error) {}
  }

  const { data: billings } = useGetBillingsByClassId(user?.class_id, {
    datePeriod,
  });

  const [isSetupFundDialogOpen, setIsSetupFundDialogOpen] = useState(false);

  return (
    <AppLayout>
      <main className="px-12 pt-10">
        <header>
          <h1 className="font-semibold text-4xl">Uang Kas</h1>
        </header>
        <div className="mt-12">
          {!fund && (
            <>
              {user && (
                <SetupFundDialog
                  user={user}
                  isOpen={isSetupFundDialogOpen}
                  onOpenChange={setIsSetupFundDialogOpen}
                />
              )}
              <div className="flex flex-col items-center justify-center gap-4 min-h-[500px]">
                <p className="text-sm text-slate-500 text-center">
                  Fitur uang kas belum disiapkan
                </p>
                <Button
                  className="w-max cursor-pointer"
                  onClick={() => setIsSetupFundDialogOpen(true)}
                >
                  Siapkan
                </Button>
              </div>
            </>
          )}
          {fund && billings && billings.length < 1 && (
            <div className="flex flex-col items-center justify-center gap-4 min-h-[500px]">
              <p className="text-sm text-slate-500 text-center">
                Data uang kas kosong
              </p>
            </div>
          )}
          {billings && billings.length > 0 && user && billingDateInterval && (
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
    </AppLayout>
  );
}
