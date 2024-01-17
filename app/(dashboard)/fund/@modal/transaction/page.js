import { TransactionDialog } from "./transaction-dialog";
import { unstable_cache } from "next/cache";
import {
  getCurrentUser,
  getUsersDataByClassId,
} from "@/lib/firebase/admin/db/user";
import { getAllTransactions } from "@/lib/firebase/admin/db/fund";

const getCachedUsersDataByClassId = unstable_cache(
  getUsersDataByClassId,
  ["users"],
  { tags: ["users"] }
);

const getCachedAllTransactions = unstable_cache(
  getAllTransactions,
  ["transactions"],
  { tags: ["transactions"] }
);

export default async function TransactionPage() {
  const currentUser = await getCurrentUser();
  const users = await getCachedUsersDataByClassId(currentUser.class_id);
  const transactions = await getCachedAllTransactions(currentUser.class_id);

  return (
    <TransactionDialog
      transactions={transactions}
      user={currentUser}
      users={users}
    />
  );
}
