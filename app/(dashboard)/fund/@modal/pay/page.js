import { NewTransactionDialog } from "./new-transaction-dialog";
import { unstable_cache } from "next/cache";
import { getCurrentUser } from "@/lib/firebase/admin/db/user";
import { getFund, getBillingDateInterval } from "@/lib/firebase/admin/db/fund";

const getCachedFund = unstable_cache(getFund, ["fund"], { tags: ["fund"] });

export default async function NewTransactionPage() {
  const user = await getCurrentUser();
  const fund = await getCachedFund(user.class_id);
  const billingDateInterval = getBillingDateInterval(fund);

  return (
    <NewTransactionDialog
      user={user}
      billingDateInterval={billingDateInterval}
    />
  );
}
