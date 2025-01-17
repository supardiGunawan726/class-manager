import { getUserDataByUid } from "@/lib/firebase/admin/db/user";
import { notFound } from "next/navigation";
import * as Icon from "lucide-react";
import { MemberToolbar } from "./member-toolbar";
import { Separator } from "@/components/ui/separator";
import { unstable_cache } from "next/cache";
import { getTransactionsByUserId } from "@/lib/firebase/admin/db/fund";
import { UserTransactionTable } from "./user-transaction-table";

const getCachedUser = unstable_cache(getUserDataByUid, ["user"], {
  tags: ["user"],
});
const getCachedTransactionsByUserId = unstable_cache(
  getTransactionsByUserId,
  ["user-transactions"],
  { tags: ["user-transactions"] }
);

export default async function MemberPage(props) {
  const params = await props.params;
  const { uid } = params;

  if (!uid) {
    return notFound();
  }

  const user = await getCachedUser(uid);

  if (!user) {
    return notFound();
  }

  const transactions = await getCachedTransactionsByUserId(
    user.class_id,
    user.uid
  );

  return (
    <main className="px-12 pt-10">
      <header className="flex items-center justify-start gap-6">
        <div>
          <figure className="w-24 h-24 bg-slate-500 text-white grid place-items-center rounded-full">
            <Icon.User2 />
          </figure>
        </div>
        <div>
          <h1 className="font-semibold text-4xl">{user.name}</h1>
          <p>
            {user.email} - {user.nim}
          </p>
        </div>
        <MemberToolbar user={user} />
      </header>
      <Separator className="my-6" />
      <UserTransactionTable transactions={transactions} />
    </main>
  );
}
