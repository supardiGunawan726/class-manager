import { NewTransactionDialog } from "./new-transaction-dialog";
import { unstable_cache } from "next/cache";
import {
  getCurrentUser,
  getUsersDataByClassId,
} from "@/lib/firebase/admin/db/user";
import { getFund, getBillingDateInterval } from "@/lib/firebase/admin/db/fund";

const getCachedUsersDataByClassId = unstable_cache(
  getUsersDataByClassId,
  ["users"],
  { tags: "users" }
);

const getCachedFund = unstable_cache(getFund, ["fund"], { tags: ["fund"] });

export default async function NewTransactionPage() {
  const user = await getCurrentUser();
  const users = await getCachedUsersDataByClassId(user.class_id);
  const fund = await getCachedFund(user.class_id);
  const billingDateInterval = getBillingDateInterval(fund);

  return (
    <NewTransactionDialog
      user={user}
      users={users}
      billingDateInterval={billingDateInterval}
    />
  );
}
