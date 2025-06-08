import AppLayout from "@/components/app-layout";
import { MemberToolbar } from "@/components/member/member-toolbar";
import { UserTransactionTable } from "@/components/member/user-transaction-table";
import { Separator } from "@/components/ui/separator";
import { useGetCurrentUser } from "@/lib/queries/session";
import { useGetTransactions } from "@/lib/queries/transactions";
import { useGetUserByUid } from "@/lib/queries/user";
import * as Icon from "lucide-react";
import { useRouter } from "next/router";

function MemberPage() {
  const router = useRouter();
  const { data: user } = useGetUserByUid(router.query.uid as string);
  const { data: transactions = [] } = useGetTransactions(
    user?.class_id,
    user?.uid
  );

  return (
    <AppLayout>
      {user && (
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
      )}
    </AppLayout>
  );
}

export default MemberPage;
